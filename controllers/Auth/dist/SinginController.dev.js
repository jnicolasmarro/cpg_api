"use strict";

var validator = require('validator');

var _require = require('../../db'),
    User = _require.User,
    Afiliacion = _require.Afiliacion,
    Util = _require.Util;

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var moment = require('moment');

function validacionUsuarioContraseña(req, res) {
  if (validator.isEmpty(req.body.email, {
    ignore_whitespace: true
  })) {
    return res.json({
      error: "No has ingresado el correo de ingreso"
    });
  }

  if (validator.isEmpty(req.body.password, {
    ignore_whitespace: true
  })) {
    return res.json({
      error: "No has ingresado la contraseña de ingreso"
    });
  }
}

module.exports = function _callee2(req, res) {
  var validacionDatos;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          validacionDatos = validacionUsuarioContraseña(req, res);

          if (!validacionDatos) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", validacionDatos);

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: req.body.email
            }
          }).then(function _callee(user) {
            var validacionPassword, token;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (user) {
                      _context.next = 4;
                      break;
                    }

                    return _context.abrupt("return", res.json({
                      error: 'Usuario no existe'
                    }));

                  case 4:
                    if (!(user.estado_user == 0)) {
                      _context.next = 8;
                      break;
                    }

                    return _context.abrupt("return", res.json({
                      error: 'Usuario bloqueado'
                    }));

                  case 8:
                    _context.next = 10;
                    return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

                  case 10:
                    validacionPassword = _context.sent;

                    if (!validacionPassword) {
                      _context.next = 16;
                      break;
                    }

                    /* if (user.rol_id_rol == 2) {
                         let afiliacion_vencida = false;
                         await Afiliacion.findOne({ where: { user_id_user: user.id_user } }).
                             then(afiliacion => {
                                 let fecha_actual = new Date();
                                 let fecha_venc = new Date(afiliacion.fecha_vencimiento); 
                                 
                                 if (fecha_actual > fecha_venc) {
                                     afiliacion_vencida = true;
                                 }
                             })
                         if (afiliacion_vencida) {
                             let whatsapp = "";
                             await Util.findOne({ where: { id_param: 2 } }).
                                 then(r_whatsapp => {
                                     if (r_whatsapp) {
                                         whatsapp = r_whatsapp.valor_param;
                                     }
                                 })
                             return res.json({ error: "Tu afiliación se ha vencido, por favor comunícate a nuestra línea de WhatsApp: " + whatsapp + " para reactivarla" })
                         }
                     }*/
                    token = jwt.sign({
                      id_user: user.id_user
                    }, process.env.JWT_TOKEN);
                    return _context.abrupt("return", res.status(200).json({
                      token: {
                        header_id_user: user.id_user,
                        token: token,
                        rol: user.rol_id_rol
                      }
                    }));

                  case 16:
                    return _context.abrupt("return", res.json({
                      error: 'Contraseña incorrecta'
                    }));

                  case 17:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};