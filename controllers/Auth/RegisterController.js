const validator = require('validator');
const { User, Membresia, Util} = require('../../db');
const bcrypt = require('bcryptjs');


async function validacionNuevoUsuario(req) {
    let error = [];
    let codigo_membresia;
    if (validator.isEmpty(req.body.codigo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el código de la membresía')
    } else {
        await Membresia.findOne({ where: { codigo_membresia: req.body.codigo } })
            .then(membresia => {
                if (!membresia) {
                    error.push('La membresía ingresada no es válida')
                } else if (!membresia.user_id_user && membresia.asignada==1) {
                    codigo_membresia = membresia.codigo_membresia;
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
    return { error, codigo_membresia };
};

module.exports = async (req, res) => {
    let validacion = await validacionNuevoUsuario(req);
        if (!validacion.error) {
            let dias_vencimiento;
            await Util.findOne({where:{id_param:1}}).
            then(util=>{dias_vencimiento=util.valor_param})
            let salt = bcrypt.genSaltSync(10);
            let user = {
                nombre_usuario: req.body.nombre_usuario,
                email: req.body.email,
                numero_celular: req.body.numero_celular,
                password: bcrypt.hashSync(req.body.password, salt),
                rol_id_rol: 2
            }
            await User.create(user).then(usuario => {
                let hoy = new Date();
                let fecha_hoy = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();
                let fecha_vencimiento = new Date();
                fecha_vencimiento.setDate(fecha_vencimiento.getDate() + parseInt(dias_vencimiento));
                let membresia = {
                    user_id_user: usuario.id_user,
                    fecha_uso: fecha_hoy,
                    fecha_vencimiento: fecha_vencimiento
                }
             Membresia.update(membresia, {
                    where: {
                        codigo_membresia: validacion.codigo_membresia
                    }
                });
            });
            return res.json({ success: 'Usuario registrado correctamente' })
        } else {
            return res.json(validacion)
        }
    
}