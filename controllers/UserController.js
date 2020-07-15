/*Controlador de Usuario*/
const validator = require('validator');
const { User, Membresia } = require('../db');
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
async function validacionNuevoUsuario(req) {
    let error = [];
    let id_membresia;
    if (validator.isEmpty(req.body.codigo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el código de la membresía')
    } else {
        await Membresia.findOne({ where: { codigo: req.body.codigo } })
            .then(membresia => {
                if (!membresia) {
                    error.push('La membresía ingresada no es válida')
                } else if (!membresia.user_id_user) {
                    id_membresia = membresia.id_membresia;
                } else {
                    error.push('La membresía se encuentra asignada a un usuario');
                }
            })
    }
    if (validator.isEmpty(req.body.email, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo')
    } else if (!validator.isEmail(req.body.email)) {
        error.push('No ha ingresado un correo válido')
    } else {
        await User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    error.push('El correo ingresado ya se encuentra registrado')
                }
            })
    }
    if (validator.isEmpty(req.body.password, { ignore_whitespace: true })) {
        error.push('No ha ingresado la contraseña')
    } else if (!validator.isByteLength(req.body.password, { min: 8 })) {
        error.push('La contraseña debe tener mínimo 8 caracteres')
    }
    if (validator.isEmpty(req.body.numero_celular, { ignore_whitespace: true })) {
        error.push('No ha ingresado un número celular')
    } else if (!validator.isMobilePhone(req.body.numero_celular, "es-CO")) {
        error.push('El número celular no es válido')
    }
    if (validator.isEmpty(req.body.nombre_usuario, { ignore_whitespace: true })) {
        error.push('No ha ingresado el nombre')
    }
    if (error.length == 0) {
        error = null;
    }
    return { error, id_membresia };
};
async function validacionActualizarUsuario(req) {
    let error = [];
    if (validator.isEmpty(req.body.email, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo')
    } else if (!validator.isEmail(req.body.email)) {
        error.push('No ha ingresado un correo válido')
    } else {
        await User.findOne({ where: { email: req.body.email } }).
            then(user => {
                if (user && user.id_user != req.params.id) {
                    error.push('El correo electrónico ya se encuentra en uso')
                }
            })
    }
    if (validator.isEmpty(req.body.numero_celular, { ignore_whitespace: true })) {
        error.push('No ha ingresado un número celular')
    } else if (!validator.isMobilePhone(req.body.numero_celular, "es-CO")) {
        error.push('El número celular no es válido')
    }
    if (validator.isEmpty(req.body.nombre_usuario, { ignore_whitespace: true })) {
        error.push('No ha ingresado el nombre')
    }
    if (error.length == 0) {
        error = null;
    }
    return error
}

module.exports = {
    async crearUsuario(req, res) {
        let validacion = await validacionNuevoUsuario(req);
        if (!validacion.error) {
            let salt = bcrypt.genSaltSync(10);
            let user = {
                nombre_usuario: req.body.nombre_usuario,
                email: req.body.email,
                numero_celular: req.body.numero_celular,
                password: bcrypt.hashSync(req.body.password, salt),
                rol_id_rol: 2
            }
            await User.create(user).then(usuario => {
             Membresia.update({ user_id_user: usuario.id_user }, {
                    where: {
                        id_membresia: validacion.id_membresia
                    }
                });
            });
            return res.json({ succcess: 'Usuario registrado correctamente' })
        } else {
            return res.json(validacion)
        }

    },
    obtenerUsuario(req, res) {
        User.findOne({ where: { id_user: req.params.id } })
            .then(user => {
                if (user)
                    res.json(user)
                else
                    res.json({ error: 'Usuario no existe' });
            })
    },
    async actualizarUsuario(req, res) {
        let user = {
            nombre_usuario: req.body.nombre_usuario,
            email: req.body.email,
            numero_celular: req.body.numero_celular,
        }
        let error = await validacionActualizarUsuario(req)
        if (error) {
           res.json(error) 
        } else {
            await User.update(user, {
                where: {
                    id_user: req.params.id
                }
            }).then(res.json("Usuario actualizado con exito"))
                .catch(error => {
                console.log(error)
            });
        }
        
    },
    async obtenerUsuarios(req, res) {
        await User.findAll({ where: { rol_id_rol: 2 } })
            .then(users => {
                if (users.length > 0)
                    res.json(users)
                else
                    res.json("No existen usuarios")
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