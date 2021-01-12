"use strict";

var _require = require('../../db'),
    User = _require.User;

var CryptoJS = require("crypto-js");

var nodemailer = require("nodemailer");

var handlebars = require('handlebars');

var fs = require('fs');

var validarEmail = function validarEmail(email) {
  return regeneratorRuntime.async(function validarEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }).then(function (user) {
            if (!user) {
              return {
                validacion: false,
                error: 'El correo ingresado no se encuentra registrado'
              };
            } else {
              if (!user.estado_user) {
                return {
                  validacion: false,
                  error: 'El usuario se encuentra inactivo'
                };
              } else {
                return {
                  validacion: true,
                  id_user: user.id_user,
                  password: user.password
                };
              }
            }
          }));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

var readHTMLFile = function readHTMLFile(path, callback) {
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

module.exports = function _callee2(req, res) {
  var email, validacion_email, today, emailEncode, id_userEncode, timestamp_today, password, hash, transporter, htmlToSend;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.params.email;
          _context3.next = 3;
          return regeneratorRuntime.awrap(validarEmail(email));

        case 3:
          validacion_email = _context3.sent;

          if (validacion_email.validacion) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.json({
            error: validacion_email.error
          }));

        case 6:
          today = new Date().toISOString();
          _context3.next = 9;
          return regeneratorRuntime.awrap(CryptoJS.AES.encrypt(email, process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH"));

        case 9:
          emailEncode = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(CryptoJS.AES.encrypt(validacion_email.id_user.toString(), process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH"));

        case 12:
          id_userEncode = _context3.sent;
          _context3.next = 15;
          return regeneratorRuntime.awrap(CryptoJS.AES.encrypt(today, process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH"));

        case 15:
          timestamp_today = _context3.sent;
          _context3.next = 18;
          return regeneratorRuntime.awrap(CryptoJS.AES.encrypt(validacion_email.password, process.env.KEY_AES).toString().replace(/[/]/gi, "SLASH"));

        case 18:
          password = _context3.sent;
          hash = timestamp_today + '&' + id_userEncode + '&' + emailEncode + '&' + password;
          console.log({
            hash: hash
          });
          transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            // true for 465, false for other ports
            auth: {
              user: 'jnicolas.marro@gmail.com',
              // generated ethereal user
              pass: 'Tuv267mato' // generated ethereal password

            }
          });
          readHTMLFile(__dirname + '/index.html', function _callee(err, html) {
            var template, replacements, info;
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    template = handlebars.compile(html);
                    replacements = {
                      v_link: "http://192.168.1.100:3000/api/auth/cambio_contrasena/".concat(id_userEncode, "/").concat(timestamp_today, "/").concat(hash)
                    };
                    htmlToSend = template(replacements);
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(transporter.sendMail({
                      from: '"CPG" <info@cpg.com>',
                      // sender address
                      to: email,
                      // list of receivers
                      subject: "Restablecimiento de contraseña",
                      // Subject line
                      html: htmlToSend // html body

                    }));

                  case 5:
                    info = _context2.sent;
                    console.log("Message sent: %s", info.messageId); // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview only available when sending through an Ethereal account

                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          return _context3.abrupt("return", res.json({
            success: 'Se ha enviado un email a tu correo para el restablecimiento de la contraseña'
          }));

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  });
};