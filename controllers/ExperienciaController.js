const { Experiencia, Establecimiento, Item, User, Experiencia_Usada, Afiliacion, Sequelize } = require('../db');
const {obtenerIDEstablecimientoXIDAdmin} = require ('./EstablecimientoController');
const validator = require('validator');
const fs = require('fs');
const CryptoJS = require("crypto-js");

//Validaciones antes de agregar una experiencia//

async function validacionAfiliacion(id_user){
       return await Afiliacion.findOne({ where: { id_user_afiliacion: id_user } }).
            then(afiliacion => {
                let fecha_actual = new Date();
                let fecha_venc = new Date(afiliacion.fecha_vencimiento); 
                if (fecha_actual > fecha_venc) {
                    return false;
                }else{
                    return true;
                }
            })
}

async function calcularValorComision(id_experiencia){

    let valorComision;
    let porcentajeComision;
    let valorExperiencia;

    await Experiencia.findOne({where:{id_experiencia:id_experiencia}})
    .then(experiencia=>{
        porcentajeComision = experiencia.comision
        valorExperiencia = experiencia.precio_experiencia
    })

    valorComision = valorExperiencia*(porcentajeComision/100)
    return valorComision;
}


async function validacionExperiencia(experiencia,files) {
    let error = [];
    if (validator.isEmpty(experiencia.titulo_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado un título para la experiencia!')
    }
    if (validator.isEmpty(experiencia.descripcion_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado una descripción para la experiencia!')
    }
    if (validator.isEmpty(experiencia.precio_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado un precio PG a la experiencia!')
    } else if (!validator.isInt(experiencia.precio_experiencia)) {
        error.push('El precio PG debe de ser un número entero!')
    } else if (parseInt(experiencia.precio_experiencia) <= 0) {
        error.push('El precio PG debe de ser mayor a cero!')
    }
    if (validator.isEmpty(experiencia.precio_publico, { ignore_whitespace: true })) {
        error.push('No ha ingresado un precio de establecimiento a la experiencia!')
    } else if (!validator.isInt(experiencia.precio_publico)) {
        error.push('El precio de establecimiento debe de ser un número entero!')
    } else if (parseInt(experiencia.precio_publico) <= 0) {
        error.push('El precio de establecimiento debe de ser mayor a cero!')
    }
    if (validator.isEmpty(experiencia.comision, { ignore_whitespace: true })) {
        error.push('No ha ingresado un porcentaje de comisión a la experiencia!')
    } else if (!validator.isDecimal(experiencia.comision, { force_decimal: false, decimal_digits: '0,2' })) {
        error.push('El porcentaje de comisión puede tener máximo 2 decimales!')
    } else if (parseFloat(experiencia.comision) <= 0) {
        error.push('El porcentaje de comisión debe de ser mayor a cero!')
    } else if (parseFloat(experiencia.comision) > 100) {
        error.push('El porcentaje de comisión debe de ser máximo 100!')
    }
    if (validator.isEmpty(experiencia.experiencia_tipo_id_tipo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el tipo de experiencia!')
    } /*else if (!(parseInt(experiencia.experiencia_tipo_id_tipo) == 1 || parseInt(experiencia.experiencia_tipo_id_tipo) == 2)) {
        error.push('Error tipo de experiencia!')
    }*/
    if (validator.isEmpty(experiencia.id_establecimiento_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado el establecimiento!')
    } else if (!validator.isInt(experiencia.id_establecimiento_experiencia)) {
        error.push('El NIT de establecimiento no es válido!')
    } else {
        await Establecimiento.findOne({ where: { id_establecimiento: experiencia.id_establecimiento_experiencia } })
            .then(establecimiento => {
                if (!establecimiento) {
                    error.push('El establecimiento no existe')
                } else {
                    if (!establecimiento.estado_establecimiento) {
                        error.push('El establecimiento no está activo')
                    }
                }
            })
    }

    if (!files || Object.keys(files).length === 0){
        error.push('No ha subido la imagen de la experiencia!')
      }else{
        let mime = files.imagen_experiencia.mimetype.split('/')
        if (mime[0] != 'image') {
          error.push('El formato de la imagen no es válido!')
        }
      }

    if (error.length == 0)
        error = null
    return error

}

async function validacionActivacionExperiencia(experiencia) {
    let error = [];
    if (validator.isEmpty(experiencia.id_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado el ID de la experiencia!')
    } else {
        await Experiencia.findOne({ where: { id_experiencia: experiencia.id_experiencia } }).
            then(exp => {
                if (!exp) {
                    error.push('La experiencia no existe!')
                } else {
                    if (exp.estado_experiencia == 1) {
                        error.push('La experiencia ya se encuentra activa!')
                    }
                }
            })
    }
    if (error.length == 0)
        error = null
    return error
}



async function validacionInactivacionExperiencia(experiencia) {
    let error = [];
    if (validator.isEmpty(experiencia.id_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado el ID de la experiencia!')
    } else {
        await Experiencia.findOne({ where: { id_experiencia: experiencia.id_experiencia } }).
            then(exp => {
                if (!exp) {
                    error.push('La experiencia no existe!')
                } else {
                    if (exp.estado_experiencia == 0) {
                        error.push('La experiencia ya se encuentra inactiva!')
                    }
                }
            })
    }
    if (error.length == 0)
        error = null
    return error
}

async function validaImagenExperiencia(id_experiencia) {
    let error = [];

    await Experiencia.findOne({ where: { id_experiencia: id_experiencia } }).
        then(experiencia => {
            if (!experiencia) {
                error.push("No existe la experiencia!")
            }
        })
    if (error.length == 0) {
        error = null;
    }
    return error
}

module.exports = {
    async crearExperiencia(req, res) {
        let files = req.files;

        let experiencia = {
            titulo_experiencia: req.body.titulo,
            descripcion_experiencia: req.body.descripcion,
            precio_experiencia: req.body.precio_experiencia,
            precio_publico: req.body.precio_publico,
            comision: req.body.comision,
            experiencia_tipo_id_tipo: req.body.tipo_experiencia,
            id_establecimiento_experiencia: req.body.id_establecimiento
        }

        let error = await validacionExperiencia(experiencia,files);

        if (error) {
            return res.json({ error })
        } else {
            Experiencia.create(experiencia)
            .then(newExperiencia=>{
                files.imagen_experiencia.mv(`./publico/experiencias/${newExperiencia.id_experiencia}.${files.imagen_experiencia.mimetype.split('/')[1]}`, err => {
                    if (err) return res.json({error:['Error al guardar la imagen']})
            
                    Experiencia.update({imagen_experiencia:`/experiencias/${newExperiencia.id_experiencia}.${files.imagen_experiencia.mimetype.split('/')[1]}`},
                                {where:{id_experiencia:newExperiencia.id_experiencia}})
                })
            })
            return res.json({ success: 'Experiencia creada!' })
        }
    },
    async obtenerExperienciasDisponibles(req,res){
        let id_user = req.headers.id_user;

        let tipo_experiencia = req.params.tipo_experiencia;
        console.log(tipo_experiencia)

        if(! await validacionAfiliacion(id_user)){
            return res.json({error:'Afiliación vencida'})
        }

        await Experiencia.findAll({
            
            include:
            {
                model:Experiencia_Usada,
                where:{
                    id_user_experiencia_usada:{
                        [Sequelize.Op.eq]:id_user
                    },
                    renovado_experiencia_usada:0
                },
                required:false
            },
            where:{
                '$experiencia_usadas.id_experiencia_usada$':null,
                experiencia_tipo_id_tipo:tipo_experiencia,
                estado_experiencia:true
            },
            attributes:['id_experiencia','titulo_experiencia','descripcion_experiencia','imagen_experiencia']
           
            
        }).
        then(experiencias => { res.json({ experiencias }) })


    },
    async obtenerGastronomicas(req, res) {

        let id_user = req.headers.id_user;

        if(! await validacionAfiliacion(id_user)){
            return res.json({error:'Afiliación vencida'})
        }

        await Experiencia.findAll({
            
            include:
            {
                model:Experiencia_Usada,
                where:{
                    id_user_experiencia_usada:{
                        [Sequelize.Op.eq]:id_user
                    },
                    renovado_experiencia_usada:0
                },
                required:false
            },
            where:{
                '$Experiencia_usadas.id_experiencia_usada$':null
            }
           
            
        }).
        then(experiencias => { res.json({ experiencias }) })

/*
        let usados = [];
        await Experiencia_Usada.findAll({ raw: true, attributes: ['id_experiencia_experiencia_usada'], where: { id_user_experiencia_usada: id_user, renovado_experiencia_usada: 0 } }).
            then(usado => {
                usado.forEach(e => {
                    usados.push(e.experiencia_id_experiencia_usada)
                });
            })

        await Experiencia.findAll({
            where: {
                id_experiencia: {
                    [Sequelize.Op.notIn]: usados
                },
                estado_experiencia: 1,
                experiencia_tipo_id_tipo: 1
            }
        }).
            then(experiencias => { res.json({ experiencias }) })*/

    },
    async obtenerSeleccion(req, res) {

        let id_user = req.headers.id_user;

        if(! await validacionAfiliacion(id_user)){
            return res.json({error:'Afiliación vencida'})
        }

        let usados = [];
        await Experiencia_Usada.findAll({ raw: true, attributes: ['experiencia_id_experiencia_usada'], where: { id_user_experiencia_usada: id_user, renovado_experiencia_usada: 0 } }).
            then(usado => {
                usado.forEach(e => {
                    usados.push(e.experiencia_id_experiencia_usada)
                });
            })

        await Experiencia.findAll({
            where: {
                id_experiencia: {
                    [Sequelize.Op.notIn]: usados
                },
                estado_experiencia: 1,
                experiencia_tipo_id_tipo: 2
            }
        }).
            then(experiencias => { res.json({ experiencias }) })
    },
    async obtenerBienestar(req, res) {

        let id_user = req.headers.id_user;

        if(! await validacionAfiliacion(id_user)){
            return res.json({error:'Afiliación vencida'})
        }

        let usados = [];
        await Experiencia_Usada.findAll({ raw: true, attributes: ['experiencia_id_experiencia_usada'], where: { id_user_experiencia_usada: id_user, renovado_experiencia_usada: 0 } }).
            then(usado => {
                usado.forEach(e => {
                    usados.push(e.experiencia_id_experiencia_usada)
                });
            })

        await Experiencia.findAll({
            where: {
                id_experiencia: {
                    [Sequelize.Op.notIn]: usados
                },
                estado_experiencia: 1,
                experiencia_tipo_id_tipo: 3
            }
        }).
            then(experiencias => { res.json({ experiencias }) })
    },
    async activacionExperiencia(req, res) {
        let experiencia = {
            id_experiencia: req.body.id_experiencia
        }

        let error = await validacionActivacionExperiencia(experiencia)

        if (error) {
            return res.json({ error })
        } else {
            Experiencia.update({ estado_experiencia: 1 },
                { where: { id_experiencia: req.body.id_experiencia } })
            return res.json({ success: 'Experiencia activada!' })
        }

    },
    async inactivacionExperiencia(req, res) {
        let experiencia = {
            id_experiencia: req.body.id_experiencia
        }

        let error = await validacionInactivacionExperiencia(experiencia)

        if (error) {
            return res.json({ error })
        } else {
            Experiencia.update({ estado_experiencia: 0 },
                { where: { id_experiencia: req.body.id_experiencia } })
            return res.json({ success: 'Experiencia inactivada!' })
        }

    },
    async añadirImagen(req, res) {
        if (req.file == undefined) {
            res.json({ error: 'Error al subir imagen!' })
        } else {
            let errores = await validaImagenExperiencia(req.body.id_imagen)
            if (errores) {
                let path = req.file.path
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }

                })
                res.json({ errores })
            } else {
                await Experiencia.update({ imagen_experiencia: '/experiencias/' + req.file.filename },
                    { where: { id_experiencia: req.body.id_imagen } })
                res.json({ success: 'Imagen de experiencia subida con éxito!' })
            }

        }
    },
    async encriptaDatos(req, res) {
        let id_usuario = CryptoJS.AES.encrypt(req.params.id_user, process.env.KEY_AES).toString();
        let id_experiencia = CryptoJS.AES.encrypt(req.params.id_exp, process.env.KEY_AES).toString();
        return res.json({ id_usuario, id_experiencia })
    },
    async procesaQR(req, res) {
        const QR = req.body.data.split(' ');

        if (QR.length != 2) {
            return res.json({ error: 'Se ha leído un QR no válido' })
        } else {
            let id_usuario = QR[0];
            let id_experiencia = QR[1];

            id_usuario = CryptoJS.AES.decrypt(id_usuario, process.env.KEY_AES);
            id_usuario = id_usuario.toString(CryptoJS.enc.Utf8);

            id_experiencia = CryptoJS.AES.decrypt(id_experiencia, process.env.KEY_AES);
            id_experiencia = id_experiencia.toString(CryptoJS.enc.Utf8);

            let result = await User.findOne({ where: { id_user: id_usuario } })
                .then(async (user) => {
                    if (!user) {
                        return { error: 'Error de información en el QR' }
                    } else {
                        if (!user.estado_user) {
                            return { error: 'Usuario no se encuentra activo' }
                        } else {
                            let fecha_vto_afiliacion = await Afiliacion
                                .findOne({ where: { id_user_afiliacion: user.id_user } })
                                .then((afiliacion) => {
                                    return afiliacion.fecha_vencimiento
                                })
                            let fecha_actual = new Date();
                            if (fecha_actual > fecha_vto_afiliacion) {
                                return { error: 'La afiliación del usuario ha expirado' }
                            }
                        }
                        return await Experiencia.findOne({ where: { id_experiencia: id_experiencia } })
                            .then(async (experiencia) => {
                                if (!experiencia) {
                                    return { error: 'Error de información en el QR' }
                                } else {
                                    let nit = await obtenerIDEstablecimientoXIDAdmin(req.headers.id_user);
                                    
                                    if (nit != experiencia.id_establecimiento_experiencia) {
                                        return { error: 'La experiencia no corresponde a este establecimiento' }
                                    }
                                    if (!experiencia.estado_experiencia) {
                                        return { error: 'La experiencia no está activa' }
                                    } else {
                                        return await Experiencia_Usada
                                            .findOne({
                                                where: {
                                                    id_experiencia_experiencia_usada: id_experiencia,
                                                    id_user_experiencia_usada: id_usuario,
                                                    renovado_experiencia_usada: false
                                                }
                                            })
                                            .then((usada) => {
                                                if (usada) {
                                                    return { error: 'La experiencia ya se ha sido usada por este usuario' }
                                                }
                                            })
                                    }
                                }
                            })
                    }
                })

            if (result != undefined) {
                if (result.error) {
                    return res.json(result)
                }
            }

            let registro_uso = {
                id_user_experiencia_usada: id_usuario,
                id_experiencia_experiencia_usada: id_experiencia,
                fecha_uso_experiencia_usada: new Date(),
                valor_comision: await calcularValorComision(id_experiencia)
            }

            return await Experiencia_Usada.create(registro_uso)
                .then((registro) => {
                    return res.json({ success: 'Experiencia procesada y registrada' })
                })





        }
    },
    async obtenerInfoExperiencia(req, res) {

        

        return await Experiencia.findOne({
            where: { id_experiencia: req.params.id },
            include: [{
                model: Item,
                where: { estado_item: 1 },
                required: false
            },
            {
                model: Establecimiento
            }]
        }).
            then(experiencia => {
                return res.json({ experiencia })
            })

    },
    async listarExperiencias(req, res) {
        let admin = req.headers.id_user;
        let id_establecimiento = await obtenerIDEstablecimientoXIDAdmin(admin);
        let experiencias = await Experiencia.findAll({ where: { id_establecimiento_experiencia: id_establecimiento } })
        return res.json({ experiencias })
    },
    async esperaRespuesta(req, res) {
        let id_user = req.params.id_user
        let id_exp = req.params.id_exp
        let espera = new Date()
        espera.setMinutes(espera.getMinutes() + 1)
        let validado = false;
        while (espera > new Date() && !validado) {

            await Experiencia_Usada.findOne({
                where: {
                    id_user_experiencia_usada: id_user,
                    id_experiencia_experiencia_usada: id_exp,
                    renovado_experiencia_usada: false
                }
            })
                .then((encontrada) => {
                    if (encontrada) {
                        validado = true;
                    }
                })

        }
        if (!validado) {
            return res.json({ error: 'Código no validado' })
        } else {
            return res.json({ success: 'Código validado' })
        }

    },
    async busquedaExperiencias(req, res) {
        let tipo = req.params.tipo
        let search = req.params.search
        let id_user = req.headers.id_user

        if(! await validacionAfiliacion(id_user)){
            return res.json({busqueda:[]})

        }

        if (tipo == 1) {


            return await Experiencia.findAll({
                raw: true,
                include:
                [
                {
                    model:Experiencia_Usada,
                    where:{
                        id_user_experiencia_usada:{
                            [Sequelize.Op.eq]:id_user
                        },
                        renovado_experiencia_usada:0
                    },
                    required:false
                },
                {
                    model: Establecimiento,
                        where:{
                            nombre_establecimiento:{
                                [Sequelize.Op.like]:`%${search}%`
                            }
                        },
                        require:true,
                        attributes:[]
                }
                ],
                where:{
                    '$experiencia_usadas.id_experiencia_usada$':null,
                    estado_experiencia:true
                },
                attributes:['id_experiencia','titulo_experiencia','descripcion_experiencia','imagen_experiencia']
               
                
            }).
            then((busqueda)=>{
                res.json({busqueda})
            })
            
        }
        if(tipo==2){

            return await Experiencia.findAll({
                raw: true,
                include:
                [
                {
                    model:Experiencia_Usada,
                    where:{
                        id_user_experiencia_usada:{
                            [Sequelize.Op.eq]:id_user
                        },
                        renovado_experiencia_usada:0
                    },
                    required:false
                }
                ],
                where:{
                    '$experiencia_usadas.id_experiencia_usada$':null,
                    titulo_experiencia:{
                        [Sequelize.Op.like]:`%${search}%`
                    },
                    estado_experiencia:true
                },
                attributes:['id_experiencia','titulo_experiencia','descripcion_experiencia','imagen_experiencia'] 
            }).
            then((busqueda)=>{
                res.json({busqueda})
            })
            
        }
    }

}