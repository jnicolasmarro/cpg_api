const {
    User
} = require('../../db');
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
var handlebars = require('handlebars');
var fs = require('fs');

// Funcion que permite validar un correo ingresado
const validarEmail = async (email) => {

    // Se obtiene la validación mediante un correo indicado 
    return await User.findOne({
            where: {
                email: email
            }
        })
        .then((user) => {
            if (!user) {
                return {
                    validacion: false,
                    error: 'El correo ingresado no se encuentra registrado'
                }
            } else {
                if (!user.estado_user) {
                    return {
                        validacion: false,
                        error: 'El usuario se encuentra inactivo'
                    }
                } else {
                    return {
                        validacion: true,
                        id_user: user.id_user,
                        password: user.password
                    }
                }
            }
        })
}

const readHTMLFile = function (path, callback) {
    fs.readFile(path, {
        encoding: 'utf-8'
    }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};





module.exports = async (req, res) => {

    // Se obtiene el correo ingresado para restablecer la contraseña
    let email = req.params.email;
    // Se valida el correo ingresado
    let validacion_email = await validarEmail(email)

    // Si la validación no fue correcta se envia el error
    if (!validacion_email.validacion) {
        return res.json({
            error: validacion_email.error
        })
    }

    // Se obtiene la fecha actual
    let today = new Date().toISOString()
    // Se encripta el correo del usuario
    let emailEncode = await CryptoJS.AES.encrypt(email, process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH");
    // Se encripta el id del usuario
    let id_userEncode = await CryptoJS.AES.encrypt(validacion_email.id_user.toString(), process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH");
    // Se encripta la fecha 
    let timestamp_today = await CryptoJS.AES.encrypt(today, process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH");
    // Se encripta la contraseña actual del usuario
    let password = await CryptoJS.AES.encrypt(validacion_email.password, process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH");
    // Se genera una cadena de texto con las anteriores variables
    let hash = timestamp_today + '&' + id_userEncode + '&' + emailEncode + '&' + password;
    
    // Se genera objeto para poder realizar envio de correo
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_APP, 
            pass: process.env.PASSWORD_EMAIL_APP, 
        },
    });

    // Se establece la plantilla a enviar
    let htmlToSend;
    readHTMLFile(__dirname + '/index.html', async function (err, html) {
        let template = handlebars.compile(html);
        let replacements = {
            // Se genera link para enviar en la plantilla
            v_link: `${process.env.API_URL}/auth/cambio_contrasena/${id_userEncode}/${timestamp_today}/${hash}`
        };
        htmlToSend = template(replacements);

        // Se envia correo
        let info = await transporter.sendMail({
            from: '"CPG" <info@cpg.com>', // sender address
            to: email, // list of receivers
            subject: "Restablecimiento de contraseña", // Subject line
            html: htmlToSend, // html body
        });
        
    });

    return res.json({
        success: 'Se ha enviado un email a tu correo para el restablecimiento de la contraseña'
    })




}