const CryptoJS = require("crypto-js");
const { User } = require('../../db');

module.exports = async (req, res) => {
    let id_user = req.params.id_user
    let time = req.params.time
    let hash = req.params.hash

    id_user = id_user.replace('SLASH', '/');
    time = time.replace('SLASH', '/');
    hash = hash.replace('SLASH', '/');

    id_user = CryptoJS.AES.decrypt(id_user, process.env.KEY_AES);
    id_user = id_user.toString(CryptoJS.enc.Utf8);

    time = CryptoJS.AES.decrypt(time, process.env.KEY_AES);
    time = time.toString(CryptoJS.enc.Utf8);

    hash = hash.split('&')

    let time_hash = hash[0]
    let id_user_hash = hash[1]
    let email_hash = hash[2]
    let password_hash = hash[3]

    time_hash = time_hash.replace('SLASH', '/');
    id_user_hash = id_user_hash.replace('SLASH', '/');
    email_hash = email_hash.replace('SLASH', '/');
    password_hash = password_hash.replace('SLASH', '/');


    time_hash = CryptoJS.AES.decrypt(time_hash, process.env.KEY_AES);
    time_hash = time_hash.toString(CryptoJS.enc.Utf8);

    id_user_hash = CryptoJS.AES.decrypt(id_user_hash, process.env.KEY_AES);
    id_user_hash = id_user_hash.toString(CryptoJS.enc.Utf8);

    email_hash = CryptoJS.AES.decrypt(email_hash, process.env.KEY_AES);
    email_hash = email_hash.toString(CryptoJS.enc.Utf8);

    password_hash = CryptoJS.AES.decrypt(password_hash, process.env.KEY_AES);
    password_hash = password_hash.toString(CryptoJS.enc.Utf8);

    if (id_user != id_user_hash) {
        return res.json({ error: 'ID USUARIO ERROR' })
    }

    if (time != time_hash) {
        return res.json({ error: 'TIME ERROR' })
    }

    let now = new Date();
    let fecha_hash = new Date(time_hash);
    fecha_hash.setHours(fecha_hash.getHours() + 24)

    if (now > fecha_hash) {
        return res.json({ error: 'ENLACE CADUCADO' })
    }

    let validacion = await User.findOne({ where: { email: email_hash } })
        .then((user) => {
            if (!user) {
                return { validacion: false, error: 'No existe un usuario registrado con el correo indicado' }
            } else {
                if (!user.estado_user) {
                    return { validacion: false, error: 'El usuario se encuentra inactivo' }
                } else {
                    if (user.password != password_hash) {
                        return { validacion: false, error: 'La contraseña ya ha sido cambiada' }
                    }else{
                        return { validacion: true }
                    }
                }
            }
        })

        if(!validacion.validacion){
            return res.json({error:validacion.error})
        }
    
        



}