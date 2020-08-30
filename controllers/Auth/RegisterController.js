const validator = require('validator');
const { User, Afiliacion, Util, Periodo_Afiliacion } = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Funcion que permite validar datos de un nuevo usuario final devuelve errores si los hay //
async function validacionNuevoUsuarioFinal(usuario) {
    let error = [];

    if (validator.isEmpty(usuario.codigo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el código de la afiliación')
    } else {
        await Afiliacion.findOne({ where: { codigo_afiliacion: usuario.codigo } })
            .then(afiliacion => {
                if (!afiliacion) {
                    error.push('El código ingresado no es válido')
                } else if (afiliacion.user_id_user || afiliacion.asignada == 0) {
                    error.push('El código se encuentra asignado a un usuario');
                }
            })
    }
    if (validator.isEmpty(usuario.email, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo')
    } else if (!validator.isEmail(usuario.email)) {
        error.push('No ha ingresado un correo válido')
    } else {
        await User.findOne({ where: { email: usuario.email } })
            .then(user => {
                if (user) {
                    error.push('El correo ingresado ya se encuentra registrado')
                }
            })
    }
    if (validator.isEmpty(usuario.password, { ignore_whitespace: true })) {
        error.push('No ha ingresado la contraseña')
    } else if (!validator.isByteLength(usuario.password, { min: 8 })) {
        error.push('La contraseña debe tener mínimo 8 caracteres')
    }
    if (validator.isEmpty(usuario.numero_celular, { ignore_whitespace: true })) {
        error.push('No ha ingresado un número celular')
    } else if (!validator.isMobilePhone(usuario.numero_celular, "es-CO")) {
        error.push('El número celular no es válido')
    }
    if (validator.isEmpty(usuario.nombre_usuario, { ignore_whitespace: true })) {
        error.push('No ha ingresado el nombre')
    }
    if (validator.isEmpty(usuario.numero_identificacion, { ignore_whitespace: true })) {
        error.push('No ha ingresado el número de identificación')
    }else{
        if(!validator.isInt(usuario.numero_identificacion)){
            error.push('El número de identificación ingresado no es válido')
        }
    }
    if (error.length == 0) {
        error = null;
    }
    return error;
};

module.exports = async (req, res) => {
    let user_req={
        nombre_usuario: req.body.nombre_usuario,
        email: req.body.email,
        numero_celular: req.body.numero_celular,
        password: req.body.password,
        codigo: req.body.codigo,
        numero_identificacion: req.body.numero_identificacion
    }
    let error = await validacionNuevoUsuarioFinal(user_req);



    if (!error) {
        let dias_vencimiento;

        await Util.findOne({ where: { id_param: 1 } }).
            then(util => { dias_vencimiento = util.valor_param })

        let salt = bcrypt.genSaltSync(10);

        let user = {
            nombre_usuario: user_req.nombre_usuario,
            numero_identificacion:user_req.numero_identificacion,
            email: user_req.email,
            numero_celular: user_req.numero_celular,
            password: bcrypt.hashSync(user_req.password, salt),
            rol_id_rol:2
        }
        let v_usuario;

        await User.create(user).then(usuario => {
            v_usuario=usuario;
            console.log(v_usuario)
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
                    codigo_afiliacion: user_req.codigo
                }
            })

            let periodo = {
                afiliacion_codigo_afiliacion: user_req.codigo,
                periodo_afiliacion: 1,
                fecha_afiliacion: new Date()
            }
            Periodo_Afiliacion.create(periodo)


        });
            const token = jwt.sign(
            { id_user: v_usuario.id_user},
            process.env.JWT_TOKEN);
            return res.status(200).json({token:
                {header_id_user: v_usuario.id_user,
                token: token,
                rol: v_usuario.rol_id_rol}
            });
    } else {
        return res.json({ error })
    }

}