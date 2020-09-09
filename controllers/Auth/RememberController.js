const { User } = require('../../db');
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
var handlebars = require('handlebars');
var fs = require('fs');

const validarEmail = async (email) => {
    return await User.findOne({ where: { email: email } })
        .then((user) => {
            if (!user) {
                return { validacion: false, error: 'El correo ingresado no se encuentra registrado' }
            } else {
                if (!user.estado_user) {
                    return { validacion: false, error: 'El usuario se encuentra inactivo' }
                }else{
                    return { validacion: true,id_user:user.id_user,password:user.password}
                }
            }
        })
}

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};





module.exports = async (req,res) => {
    let email = req.params.email;
    let validacion_email = await validarEmail(email)

    if(!validacion_email.validacion){
        return res.json({error:validacion_email.error})
    }
    let today = new Date().toISOString()
    let emailEncode = CryptoJS.AES.encrypt(email, process.env.KEY_AES).toString().replace('/','SLASH');
    let id_userEncode = CryptoJS.AES.encrypt(validacion_email.id_user.toString(), process.env.KEY_AES).toString().replace('/','SLASH');
    let timestamp_today = CryptoJS.AES.encrypt(today, process.env.KEY_AES).toString().replace('/','SLASH');
    let password = CryptoJS.AES.encrypt(validacion_email.password, process.env.KEY_AES).toString().replace('/','SLASH');
    let hash = timestamp_today+'&'+id_userEncode+'&'+emailEncode+'&'+password;
    console.log(hash)

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'jnicolas.marro@gmail.com', // generated ethereal user
          pass: 'Tuv267mato', // generated ethereal password
        },
      });

      let htmlToSend;
      readHTMLFile(__dirname + '/index.html', async function(err, html) {
        let template = handlebars.compile(html);
        let replacements = {
            v_link: `http://192.168.1.100:3000/api/auth/cambio_contrasena/${id_userEncode}/${timestamp_today}/${hash}`
        };
        htmlToSend = template(replacements);

        let info = await transporter.sendMail({
            from: '"CPG" <foo@example.com>', // sender address
            to: "jnicolas.marro@gmail.com", // list of receivers
            subject: "Restablecimiento de contraseña", // Subject line
            html: htmlToSend, // html body
          });
          console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });

        return res.json({success:'Se ha enviado un email a tu correo para el restablecimiento de la contraseña'})

      
    

}