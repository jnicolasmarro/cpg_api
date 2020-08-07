const validator = require('validator');
const { User, Afiliacion, Util,Periodo_Afiliacion } = require('../../db');
const bcrypt = require('bcryptjs');

// Funcion que permite validar datos de un nuevo usuario final devuelve errores si los hay //
async function validacionNuevoUsuario(req) {
    let error = [];

    if (validator.isEmpty(req.body.codigo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el código de la afiliación')
    } else {
        await Afiliacion.findOne({ where: { codigo_afiliacion: req.body.codigo } })
            .then(afiliacion => {
                if (!afiliacion) {
                    error.push('El código ingresado no es válida')
                } else if (afiliacion.user_id_user || afiliacion.asignada == 0) {
                    error.push('El código se encuentra asignado a un usuario');
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
    return error;
};

module.exports = async (req, res) => {
    let error = await validacionNuevoUsuario(req);
    if (!error) {
        let dias_vencimiento;

        await Util.findOne({ where: { id_param: 1 } }).
            then(util => { dias_vencimiento = util.valor_param })

        let salt = bcrypt.genSaltSync(10);

        let user = {
            nombre_usuario: req.body.nombre_usuario,
            email: req.body.email,
            numero_celular: req.body.numero_celular,
            password: bcrypt.hashSync(req.body.password, salt),
            rol_id_rol: 2
        }

        User.create(user).then(usuario => {    
            let fecha_vencimiento = new Date();
            fecha_vencimiento.setDate(fecha_vencimiento.getDate() + parseInt(dias_vencimiento));
            fecha_vencimiento.setHours(23)
            fecha_vencimiento.setMinutes(59)
            fecha_vencimiento.setSeconds(59)
            let afiliacion = {
                user_id_user: usuario.id_user,
                fecha_uso: new Date(),
                fecha_vencimiento: fecha_vencimiento
            }

            Afiliacion.update(afiliacion, {
                where: {
                    codigo_afiliacion: req.body.codigo
                }
            })

            let periodo={
                afiliacion_codigo_afiliacion:req.body.codigo,
                periodo_afiliacion:1,
                fecha_afiliacion: new Date()
            }
            Periodo_Afiliacion.create(periodo)


        });
        return res.json({ success: 'Usuario registrado correctamente' })
    } else {
        return res.json({ error })
    }

}