const CryptoJS = require("crypto-js");
const {
    User
} = require('../../db');
const bcrypt = require('bcryptjs');

module.exports = {

    async CambiarContraseña(req, res) {
        let id_user = req.params.id_user
        let time = req.params.time
        let hash = req.params.hash

        id_user = id_user.replace(/SLASH/gi, '/');
        time = time.replace(/SLASH/gi, '/');
        hash = hash.replace(/SLASH/gi, '/');

        id_user = CryptoJS.AES.decrypt(id_user, process.env.KEY_AES);
        id_user = id_user.toString(CryptoJS.enc.Utf8);

        time = CryptoJS.AES.decrypt(time, process.env.KEY_AES);
        time = time.toString(CryptoJS.enc.Utf8);

        hash = hash.split('&')

        let time_hash = hash[0]
        let id_user_hash = hash[1]
        let email_hash = hash[2]
        let password_hash = hash[3]



        time_hash = CryptoJS.AES.decrypt(time_hash, process.env.KEY_AES);
        time_hash = time_hash.toString(CryptoJS.enc.Utf8);

        id_user_hash = CryptoJS.AES.decrypt(id_user_hash, process.env.KEY_AES);
        id_user_hash = id_user_hash.toString(CryptoJS.enc.Utf8);

        email_hash = CryptoJS.AES.decrypt(email_hash, process.env.KEY_AES);
        email_hash = email_hash.toString(CryptoJS.enc.Utf8);

        password_hash = CryptoJS.AES.decrypt(password_hash, process.env.KEY_AES);
        password_hash = password_hash.toString(CryptoJS.enc.Utf8);

        if (id_user != id_user_hash) {
            return res.json({
                error: 'ID USUARIO ERROR'
            })
        }

        if (time != time_hash) {
            return res.json({
                error: 'TIME ERROR'
            })
        }

        let now = new Date();
        let fecha_hash = new Date(time_hash);
        fecha_hash.setHours(fecha_hash.getHours() + 24)

        if (now > fecha_hash) {
            return res.render('error_contrasena', {
                titulo_error: 'Error',
                descripcion_error:'Enlace Caducado'
            })
        }

        let validacion = await User.findOne({
                where: {
                    email: email_hash
                }
            })
            .then((user) => {
                if (!user) {
                    return {
                        validacion: false,
                        error: 'No existe un usuario registrado con el correo indicado'
                    }
                } else {
                    if (!user.estado_user) {
                        return {
                            validacion: false,
                            error: 'El usuario se encuentra inactivo'
                        }
                    } else {
                        if (user.password != password_hash) {
                            console.log('error')
                            return {
                                validacion: false,
                                error: 'La contraseña ya ha sido cambiada'
                            }
                        } else {
                            return {
                                validacion: true
                            }
                        }
                    }
                }
            })

        if (!validacion.validacion) {
            return res.render('error_contrasena', {
                titulo_error: 'Error',
                descripcion_error:validacion.error
            })
        }

        res.render('cambio_contrasena', {
            correo_actual: email_hash
        })



    },
    async RealizarCambioContraseña(req, res) {
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(req.body.password, salt)
        return await User.update({password:password},{where:{email:req.body.email}})
        .then(res.json({success:'La contraseña se ha cambiado'}))
    },
    async SolicitarCambioContraseña(req,res){
         return res.render('solicitud_cambio')
    }
}