"use strict";

var CryptoJS = require("crypto-js");

var _require = require('../../db'),
    User = _require.User;

var bcrypt = require('bcryptjs');

module.exports = {
  CambiarContraseña: function CambiarContraseA(req, res) {
    var id_user, time, hash, id_user_token, time_hash, id_user_hash, email_hash, password_hash, email_token, password_token, now, fecha_hash, validacion;
    return regeneratorRuntime.async(function CambiarContraseA$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id_user = req.params.id_user;
            time = req.params.time;
            hash = req.params.hash;
            id_user = id_user.replace(/SLASH/gi, '/');
            time = time.replace(/SLASH/gi, '/');
            hash = hash.replace(/SLASH/gi, '/');
            id_user_token = id_user;
            id_user = CryptoJS.AES.decrypt(id_user, process.env.KEY_AES);
            id_user = id_user.toString(CryptoJS.enc.Utf8);
            time = CryptoJS.AES.decrypt(time, process.env.KEY_AES);
            time = time.toString(CryptoJS.enc.Utf8);
            hash = hash.split('&');
            time_hash = hash[0];
            id_user_hash = hash[1];
            email_hash = hash[2];
            password_hash = hash[3];
            email_token = email_hash;
            password_token = password_hash;
            time_hash = CryptoJS.AES.decrypt(time_hash, process.env.KEY_AES);
            time_hash = time_hash.toString(CryptoJS.enc.Utf8);
            id_user_hash = CryptoJS.AES.decrypt(id_user_hash, process.env.KEY_AES);
            id_user_hash = id_user_hash.toString(CryptoJS.enc.Utf8);
            email_hash = CryptoJS.AES.decrypt(email_hash, process.env.KEY_AES);
            email_hash = email_hash.toString(CryptoJS.enc.Utf8);
            password_hash = CryptoJS.AES.decrypt(password_hash, process.env.KEY_AES);
            password_hash = password_hash.toString(CryptoJS.enc.Utf8);

            if (!(id_user != id_user_hash)) {
              _context.next = 28;
              break;
            }

            return _context.abrupt("return", res.json({
              error: 'ID USUARIO ERROR'
            }));

          case 28:
            if (!(time != time_hash)) {
              _context.next = 30;
              break;
            }

            return _context.abrupt("return", res.json({
              error: 'TIME ERROR'
            }));

          case 30:
            now = new Date();
            fecha_hash = new Date(time_hash);
            fecha_hash.setHours(fecha_hash.getHours() + 24);

            if (!(now > fecha_hash)) {
              _context.next = 35;
              break;
            }

            return _context.abrupt("return", res.render('error_contrasena', {
              titulo_error: 'Error',
              descripcion_error: 'Enlace Caducado'
            }));

          case 35:
            _context.next = 37;
            return regeneratorRuntime.awrap(User.findOne({
              where: {
                email: email_hash
              }
            }).then(function (user) {
              if (!user) {
                return {
                  validacion: false,
                  error: 'No existe un usuario registrado con el correo indicado'
                };
              } else {
                if (!user.estado_user) {
                  return {
                    validacion: false,
                    error: 'El usuario se encuentra inactivo'
                  };
                } else {
                  if (user.password != password_hash) {
                    console.log('error');
                    return {
                      validacion: false,
                      error: 'La contraseña ya ha sido cambiada'
                    };
                  } else {
                    return {
                      validacion: true
                    };
                  }
                }
              }
            }));

          case 37:
            validacion = _context.sent;

            if (validacion.validacion) {
              _context.next = 40;
              break;
            }

            return _context.abrupt("return", res.render('error_contrasena', {
              titulo_error: 'Error',
              descripcion_error: validacion.error
            }));

          case 40:
            res.render('cambio_contrasena', {
              correo_actual: email_hash,
              token1: password_token,
              token2: email_token,
              token3: id_user_token
            });

          case 41:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  RealizarCambioContraseña: function RealizarCambioContraseA(req, res) {
    var salt, password, token1, token2, token3, validacion;
    return regeneratorRuntime.async(function RealizarCambioContraseA$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(req.body.password, salt);
            token1 = req.body.token1;
            token2 = req.body.token2;
            token3 = req.body.token3;
            token1 = CryptoJS.AES.decrypt(token1, process.env.KEY_AES);
            token1 = token1.toString(CryptoJS.enc.Utf8);
            token2 = CryptoJS.AES.decrypt(token2, process.env.KEY_AES);
            token2 = token2.toString(CryptoJS.enc.Utf8);
            token3 = CryptoJS.AES.decrypt(token3, process.env.KEY_AES);
            token3 = token3.toString(CryptoJS.enc.Utf8);
            _context2.next = 13;
            return regeneratorRuntime.awrap(User.findOne({
              where: {
                email: req.body.email
              }
            }).then(function (user) {
              if (user.email != token2) {
                return {
                  validacion: false,
                  error: 'Error'
                };
              } else {
                if (user.id_user != token3) {
                  return {
                    validacion: false,
                    error: 'Error'
                  };
                } else {
                  if (user.password != token1) {
                    return {
                      validacion: false,
                      error: 'Error'
                    };
                  } else {
                    return {
                      validacion: true
                    };
                  }
                }
              }
            }));

          case 13:
            validacion = _context2.sent;

            if (!validacion.validacion) {
              _context2.next = 20;
              break;
            }

            _context2.next = 17;
            return regeneratorRuntime.awrap(User.update({
              password: password
            }, {
              where: {
                email: req.body.email
              }
            }).then(res.json({
              success: 'La contraseña se ha cambiado'
            })));

          case 17:
            return _context2.abrupt("return", _context2.sent);

          case 20:
            return _context2.abrupt("return", res.json({
              error: 'Error'
            }));

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  SolicitarCambioContraseña: function SolicitarCambioContraseA(req, res) {
    return regeneratorRuntime.async(function SolicitarCambioContraseA$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", res.render('solicitud_cambio'));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};