const validator = require('validator');
const { User, Afiliacion, Util } = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función que permite validar usuario y contraseña de un usuario
async function validacionUsuarioContraseña(datosIngreso) {

    let errores = []
    let token;

    if (validator.isEmpty(datosIngreso.email, { ignore_whitespace: true })) {
        errores.push('No has ingresado el correo de ingreso')
    }
    if (validator.isEmpty(datosIngreso.password, { ignore_whitespace: true })) {
        errores.push('No has ingresado la contraseña de ingreso')
    }

    if (errores.length == 0) {

        await User.findOne({ where: { email: datosIngreso.email } }).
        then(async user => {
            if (!user) {
                errores.push('Usuario no existe')
            } else {
                if(user.estado_user==0){
                    errores.push('Usuario bloqueado')
                }else{
                    let validacionPassword = await bcrypt.compare(datosIngreso.password, user.password);
                    if (validacionPassword) {
                         token = jwt.sign(
                        { id_user: user.id_user },
                        process.env.JWT_TOKEN)
                        token =
                            {header_id_user: user.id_user,
                            token: token,
                            rol: user.rol_id_rol}
                    } else {
                        errores.push('Contraseña incorrecta')
                    }
                }
            }
        });
    }

    
    if (errores.length == 0) {
        errores = null;
    }

    return {
        errores,token
    }
}

module.exports = async (req, res) => {

    // Se toman los datos de correo y contraseña de ingreso
    let datosIngreso = {
        email:req.body.email,
        password:req.body.password
    }

    // Se realiza validación de los datos
    let validacion = await validacionUsuarioContraseña(datosIngreso)

    // Si generó errores se envian al cliente
    if(validacion.errores){
        let errores = validacion.errores
        return res.json(
            {errores}
        )
    }else{

        // Sino generó errores se envia token
        let token = validacion.token
        return res.status(200).json({token});
    }


}