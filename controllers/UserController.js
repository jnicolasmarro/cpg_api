/*Controlador de Usuario*/
const validator = require('validator');
const { User, Afiliacion, Ciudad } = require('../db');
const bcrypt = require('bcryptjs');


/* 
Función para la validación de los datos de registro de un nuevo usuario
- Se valida que no existan datos en blanco
- Se valida que la membresía esté dentro del listado de membresías
- Se valida que la membresía no cuente con un usuario asignado
- Si la membresía es válida se retorna el id de la membresía
- Se valida que el correo ingresado no se encuentre registrado
- Se valida que la contraseña contenga mínimo 8 caracteres
@req 
*/

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

    if(user.contraseñaNueva){
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
}
    if (validator.isEmpty(user.numero_identificacion, { ignore_whitespace: true })) {
        error.push('No ha ingresado el número de identificación')
    }else{
        if(!validator.isInt(user.numero_identificacion)){
            error.push('El número de identificación ingresado no es válido')
        }
    }
    if (error.length == 0) {
        error = null;
    }
    return error
}


module.exports = {
    // Funcion que permite obtener los datos de un usuario por su Id
    obtenerUsuario(req, res) {
        User.findOne({ 
            where: { id_user: req.params.id },
            attributes:['id_user','nombre_usuario','numero_identificacion','email','numero_celular'] })
            .then(user => {
                if (user)
                    res.json({user})
                else
                    res.json({ error: 'Usuario no existe' });
            })
    },
    // Funcion que permite a un usuario final actualizar sus datos
    async actualizarUsuario(req, res) {
        // Se obtienen los campos ingresados en el front
        let user = {
            nombre_usuario: req.body.nombre_usuario,
            numero_identificacion:req.body.numero_identificacion,
            email: req.body.email,
            numero_celular: req.body.numero_celular,
            contraseñaNueva: req.body.contraseñaNueva,
            contraseñaActual: req.body.contraseñaActual,
            id_user: req.params.id
        }
        // Se validan los datos suministrados
        let error = await validacionActualizarUsuario(user)
        if (error) {
            // Si existen errores se retornan al front
            return res.json({ error })
        } else {

            let userUpdate;

            // Si la nueva contraseña no está en blanco se establece la variable userUpdate a actualizar
            if(!validator.isEmpty(user.contraseñaNueva, { ignore_whitespace: true })){
                let salt = bcrypt.genSaltSync(10);
                userUpdate={
                    nombre_usuario:user.nombre_usuario,
                    numero_identificacion:user.numero_identificacion,
                    email:user.email,
                    numero_celular:user.numero_celular,
                    password:bcrypt.hashSync(user.contraseñaNueva, salt)
                }
            }else{
            
                // Si no existe una nueva contraseña se actualizan los demas datos 
                userUpdate={
                    nombre_usuario:user.nombre_usuario,
                    numero_identificacion:user.numero_identificacion,
                    email:user.email,
                    numero_celular:user.numero_celular
                }

            }

            // Se actualizan los datos del usuario
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
    // Funcion que permite actualizar por medio de un administrador
    // los datos de un usuario final
    async actualizarDatosUsuario (req,res){
        // Se obtienen los campos ingresados en el front
        let user = {
            nombre_usuario: req.body.nombre_usuario,
            numero_identificacion:req.body.numero_identificacion,
            email: req.body.email,
            numero_celular: req.body.numero_celular,
            estado_user: req.body.estado_user,
            id_user: req.params.id
        }

        // Se validan los datos suministrados
        let errores = await validacionActualizarUsuario(user)

        if (errores){
            // Si existen errores se retornan al front
            return res.json({ errores })
        }else{
            // Se actualizan los datos del usuario
            await User.update(user, {
                where: {
                    id_user: user.id_user
                }
            })
            .then(
                res.json({success:"Usuario actualizado con éxito"})
            );
        }




    },
    // Permite obtener todos los usuarios finales 
    async obtenerUsuarios(req, res) {
        await User.findAll({ 
            where: { rol_id_rol: 2 },
            raw:true, 
            include:{
                model:Ciudad,
                attributes:['nombre_ciudad'],
                nested: false,
                attributes: [],
                required: true,
            },
            attributes: ['id_user', 'nombre_usuario','numero_identificacion','email','numero_celular','estado_user','ciudad.nombre_ciudad','user_direccion'] })
            .then(users => {

                users.forEach(user => {
                    if(user.estado_user){
                        user.estado_user = 'ACTIVO'
                    }else{
                        user.estado_user = 'INACTIVO'
                    }

                });
                    res.json({users})
            })
        
    },
    async inactivarUsuario(req, res) {
        let user = {
            estado_user: 0
        }
        await User.update(user, {
            where: {
                id_user: req.params.id
            }
        }).then(res.json("Usuario inactivado"))
            .catch(error => {
                console.log(error)
            });
    }
}