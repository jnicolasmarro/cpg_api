const validator = require('validator');
const { User, Afiliacion, Util, Periodo_Afiliacion } = require('../../db');
const {generarToken} = require ('../Auth/AuthToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Funcion que permite validar datos de un nuevo usuario final devuelve errores si los hay
async function validacionNuevoUsuarioFinal(usuario) {

    let errores = [];

    // Valida codigo de afiliación
    if (validator.isEmpty(usuario.codigo, { ignore_whitespace: true })) {
        errores.push('No ha ingresado el código de la afiliación')
    } else {
        await Afiliacion.findOne({ where: { codigo_afiliacion: usuario.codigo } })
            .then(afiliacion => {
                if (!afiliacion) {
                    errores.push('El código ingresado no es válido')
                } else if (afiliacion.afiliacion_id_user || afiliacion.afiliacion_asignada == 0) {
                    errores.push('El código se encuentra asignado a un usuario');
                }
            })
    }

    // Valida correo del usuario
    if (validator.isEmpty(usuario.email, { ignore_whitespace: true })) {
        errores.push('No ha ingresado el correo')
    } else if (!validator.isEmail(usuario.email)) {
        errores.push('No ha ingresado un correo válido')
    } else {
        await User.findOne({ where: { email: usuario.email } })
            .then(user => {
                if (user) {
                    errores.push('El correo ingresado ya se encuentra registrado')
                }
            })
    }

    // Valida contraseña del usuario
    if (validator.isEmpty(usuario.password, { ignore_whitespace: true })) {
        errores.push('No ha ingresado la contraseña')
    } else if (!validator.isByteLength(usuario.password, { min: 8 })) {
        errores.push('La contraseña debe tener mínimo 8 caracteres')
    }

    //Valida teléfono celular del usuario
    if (validator.isEmpty(usuario.numero_celular, { ignore_whitespace: true })) {
        errores.push('No ha ingresado un número celular')
    } else if (!validator.isMobilePhone(usuario.numero_celular, "es-CO")) {
        errores.push('El número celular no es válido')
    }

    //Valida nombre del usuario
    if (validator.isEmpty(usuario.nombre_usuario, { ignore_whitespace: true })) {
        errores.push('No ha ingresado el nombre')
    }

    //Valida número de identificación del usuario
    if (validator.isEmpty(usuario.numero_identificacion, { ignore_whitespace: true })) {
        errores.push('No ha ingresado el número de identificación')
    }else{
        if(!validator.isInt(usuario.numero_identificacion)){
            errores.push('El número de identificación ingresado no es válido')
        }
    }

    // Si no hay errores se retorna nulo
    if (errores.length == 0) {
        return null;
    }
    return errores;
};

module.exports = async (req, res) => {

    // Se obtienen los datos desde la intefaz móvil 
    let user_req={
        nombre_usuario: req.body.nombre_usuario,
        email: req.body.email,
        numero_celular: req.body.numero_celular,
        password: req.body.password,
        codigo: req.body.codigo,
        numero_identificacion: req.body.numero_identificacion
    }
    // Se realiza validación de los datos del usuario final y se guarda en la variable error el resultado
    let errores = await validacionNuevoUsuarioFinal(user_req);

    // Si no existen errores se continua la ejecución
    if (!errores) {

        // Se obtienen los días de vencimiento establecidos para una afiliación
        let dias_vencimiento;
        await Util.findOne({ where: { id_param: 1 } }).
            then(util => { dias_vencimiento = util.valor_param })

        // Se genera usuario que será almacenado en la base de datos
        let user = {
            nombre_usuario: user_req.nombre_usuario,
            numero_identificacion:user_req.numero_identificacion,
            email: user_req.email,
            numero_celular: user_req.numero_celular,
            password: bcrypt.hashSync(user_req.password, bcrypt.genSaltSync(10)),
            rol_id_rol:2
        }

         return await User.create(user)
        .then(async usuario => {

            // Se establece fecha de vencimiento de la afiliación sumando los días de vencimiento a la fecha actual
            let fecha_vencimiento = new Date();
            fecha_vencimiento.setDate(fecha_vencimiento.getDate() + parseInt(dias_vencimiento));
            fecha_vencimiento.setHours(23)
            fecha_vencimiento.setMinutes(59)
            fecha_vencimiento.setSeconds(59)

            // Se genera afiliación para almacenar en la base de datos
            let afiliacion = {
                afiliacion_id_user: usuario.id_user,
                fecha_activacion: new Date(),
                fecha_vencimiento: fecha_vencimiento
            }
            Afiliacion.update(afiliacion, {
                where: {
                    codigo_afiliacion: user_req.codigo
                }
            })

            // Se genera periodo para almacenar en la base de datos
            let periodo = {
                afiliacion_codigo_afiliacion: user_req.codigo,
                periodo_afiliacion: 1,
                fecha_afiliacion: new Date()
            }
            Periodo_Afiliacion.create(periodo)

            // Se genera token para la autenticación en el cliente móvil
            let authToken = await generarToken({email:user_req.email,password:user_req.password});
            let token=authToken.token;
            return res.status(200).json({token}
            );
                        
        });
    } else {

        // Si existen errores se retorna al cliente móvil o web
        return res.json({ errores })
    }

}