"use strict";

var _require = require('../db'),
    Noticia = _require.Noticia;

var validator = require('validator');

var moment = require('moment');

moment.locale('es-es');

var validacionNoticia = function validacionNoticia(noticia) {
  var errores = [];
  var mimetype = null;

  if (validator.isEmpty(noticia.titulo_noticia, {
    ignore_whitespace: true
  })) {
    errores.push('No ha ingresado un título para la noticia!');
  }

  if (validator.isEmpty(noticia.contenido_noticia, {
    ignore_whitespace: true
  })) {
    errores.push('No ha ingresado un contenido para la noticia!');
  }

  if (noticia.files == null) {
    errores.push('No ha adjuntado una imagen para la noticia!');
  } else {
    var mime = noticia.files.imagen_noticia.mimetype.split('/');

    if (mime[0] != 'image') {
      errores.push('El formato de la imagen no es válido!');
    } else {
      mimetype = mime;
    }
  }

  return {
    errores: errores,
    mimetype: mimetype
  };
};

module.exports = {
  crearNoticia: function crearNoticia(req, res) {
    var files, titulo_noticia, contenido_noticia, noticia, validacion_Noticia;
    return regeneratorRuntime.async(function crearNoticia$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            files = req.files;
            titulo_noticia = req.body.titulo_noticia;
            contenido_noticia = req.body.contenido_noticia;
            noticia = {
              files: files,
              titulo_noticia: titulo_noticia,
              contenido_noticia: contenido_noticia
            };
            validacion_Noticia = validacionNoticia(noticia);

            if (!(validacion_Noticia.errores.length != 0)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.json({
              error: validacion_Noticia.errores
            }));

          case 7:
            _context.next = 9;
            return regeneratorRuntime.awrap(Noticia.create({
              titulo_noticia: titulo_noticia,
              contenido_noticia: contenido_noticia
            }).then(function (noticia) {
              files.imagen_noticia.mv("./publico/noticias/".concat(noticia.id_noticia, ".").concat(validacion_Noticia.mimetype[1]), function (err) {
                if (err) return res.json({
                  error: ['Error al guardar la imagen']
                });
                Noticia.update({
                  imagen_noticia: "/noticias/".concat(noticia.id_noticia, ".").concat(validacion_Noticia.mimetype[1])
                }, {
                  where: {
                    id_noticia: noticia.id_noticia
                  }
                });
                return res.json({
                  success: 'Noticia creada!'
                });
              });
            }));

          case 9:
            return _context.abrupt("return", _context.sent);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  obtenerNoticias: function obtenerNoticias(req, res) {
    var res_noticias;
    return regeneratorRuntime.async(function obtenerNoticias$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(Noticia.findAll({
              raw: true,
              attributes: ['id_noticia', 'titulo_noticia', 'createdAt', 'imagen_noticia'],
              where: {
                estado_noticia: true
              },
              order: [['createdAt', 'DESC']]
            }).then(function (noticias) {
              noticias.forEach(function (noticia) {
                noticia.createdAt = moment(noticia.createdAt).format("LL");
              });
              res_noticias = noticias;
            }));

          case 2:
            return _context2.abrupt("return", res.json({
              res_noticias: res_noticias
            }));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  obtenerNoticia: function obtenerNoticia(req, res) {
    var id_noticia, res_noticia;
    return regeneratorRuntime.async(function obtenerNoticia$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id_noticia = req.params.id_noticia;
            _context3.next = 3;
            return regeneratorRuntime.awrap(Noticia.findOne({
              where: {
                id_noticia: id_noticia
              }
            }).then(function (noticia) {
              res_noticia = noticia;
            }));

          case 3:
            return _context3.abrupt("return", res.json({
              res_noticia: res_noticia
            }));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};