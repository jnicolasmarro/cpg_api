const { User, Establecimiento,Experiencia, Experiencia_Usada,Sequelize } = require('../db');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const moment = require('moment');
moment.locale('es-es');
const {obtenerIDEstablecimientoXIDAdmin} = require('./EstablecimientoController')


const getAdminEstablecimiento = async(id) => {
    return User.findOne({
        where: { id_user: id },
        include: {
            model: Establecimiento
        }
    })
}




async function validacionActualizarUsuario(user) {
    let error = [];
    if (validator.isEmpty(user.email, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo')
    } else if (!validator.isEmail(user.email)) {
        error.push('No ha ingresado un correo válido')
    } else {
        await User.findOne({ where: { email: user.email } }).
            then(usuario => {
                if (usuario && usuario.id_user != user.id_user) {
                    error.push('El correo electrónico ya se encuentra en uso')
                }
            })
    }
    if (validator.isEmpty(user.numero_celular, { ignore_whitespace: true })) {
        error.push('No ha ingresado un número celular')
    } else if (!validator.isMobilePhone(user.numero_celular, "es-CO")) {
        error.push('El número celular no es válido')
    }
    if (validator.isEmpty(user.nombre_usuario, { ignore_whitespace: true })) {
        error.push('No ha ingresado el nombre')
    }

    if (!validator.isEmpty(user.contraseñaNueva, { ignore_whitespace: true })) {
        
        if (!validator.isByteLength(user.contraseñaNueva, { min: 8 })) {
            error.push('La contraseña nueva debe tener mínimo 8 caracteres')
        } else {
            console.log(user.contraseñaActual)
            let contraseñaActualReal;
            await User.findOne({ where: { id_user: user.id_user } })
                .then(usuario => {
                    contraseñaActualReal = usuario.password;
                })
            

            if (!(await bcrypt.compare(user.contraseñaActual, contraseñaActualReal))) {
                error.push('La contraseña actual no corresponde con la actual indicada')
            }

        }
    }
    
    if (error.length == 0) {
        error = null;
    }
    return error
}

module.exports = {
    async obtenerAdministradorAsistenteEstablecimiento(req, res) {
        let id = req.params.id
        return res.json(await getAdminEstablecimiento(id))
    },
    async updateAdminAsisEstablecimiento(req,res){
        let user = {
            nombre_usuario: req.body.nombre_usuario,
            email: req.body.email,
            numero_celular: req.body.numero_celular,
            contraseñaNueva: req.body.contraseñaNueva,
            contraseñaActual: req.body.contraseñaActual,
            id_user: req.params.id
        }
        let error = await validacionActualizarUsuario(user)
        if (error) {
            return res.json({ error })
        } else {

            let userUpdate;

            if(!validator.isEmpty(user.contraseñaNueva, { ignore_whitespace: true })){
                let salt = bcrypt.genSaltSync(10);
                userUpdate={
                    nombre_usuario:user.nombre_usuario,
                    email:user.email,
                    numero_celular:user.numero_celular,
                    password:bcrypt.hashSync(user.contraseñaNueva, salt)
                }
            }else{
                userUpdate={
                    nombre_usuario:user.nombre_usuario,
                    email:user.email,
                    numero_celular:user.numero_celular
                }

            }

            await User.update(userUpdate, {
                where: {
                    id_user: user.id_user
                }
            }).then(res.json({success:"Usuario actualizado con éxito"}))
                .catch(error => {
                    console.log(error)
                });
        }
    },
    async traeEstadisticas(req,res){
        let admin = req.headers.id_user;
        let nit;
        let cantidad_leidas;
        let usuarios=[];
        let usos_meses;
        let meses=[];
        let cantidadespormeses=[];
        
        nit = await obtenerIDEstablecimientoXIDAdmin(admin)

        await Experiencia_Usada.findAll({raw: true,include: {
            model: Experiencia,
            where: {
                id_establecimiento_experiencia:nit
              },
              attributes: []
        }})
        .then((experiencias)=>{
            cantidad_leidas=experiencias.length;
        })

        
        

        await User.findAll({raw: true,attributes: ['nombre_usuario','numero_celular','email'],group: ['nombre_usuario','numero_celular','email'],include: [{
            model: Experiencia_Usada,
              include: {
                model: Experiencia,
                where:{
                    id_establecimiento_experiencia:nit
                },
                attributes: []
              },
              required: true,
              attributes: []
              
        }
    
    ]})
        .then((r_usuarios)=>{

            r_usuarios.forEach(usuario => {
                usuarios.push([usuario.nombre_usuario,usuario.numero_celular,usuario.email])
            });
        })

        await Establecimiento.findOne({where:{id_establecimiento:nit}})
        .then(async (establecimiento)=>{
            let inicio=establecimiento.createdAt;
            let startDate = moment([inicio.getFullYear(), inicio.getMonth()]);
            let detener=false;
            while(!detener){
                let sig;
                console.log(startDate.toDate());
                sig=moment(startDate).add(1, 'month');
                console.log(sig.toDate());

                await Experiencia_Usada.findAll({raw: true,where:{
                    fecha_uso_experiencia_usada:{
                        [Sequelize.Op.between]:[startDate,sig]
                    }
                },include: {
                    model: Experiencia,
                    where: {
                        id_establecimiento_experiencia:nit
                      },
                      attributes: []
                }})
                .then((experiencias)=>{
                    meses.push(startDate.format('YYYY')+' '+startDate.format('MMMM'))
                    cantidadespormeses.push(experiencias.length)
                })


                
                startDate=sig;
                if(moment()<startDate){
                    detener=true;
                }
            }


        })

        usos_meses={
            meses:meses,
            cantidades:cantidadespormeses
        }


        return res.json({cantidad_leidas,usuarios,usos_meses})
    }
}