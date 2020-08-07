const { Experiencia, Establecimiento, Item, User, Experiencia_Usada, sequelize } = require('../db');
const validator = require('validator');
const fs = require('fs');
const CryptoJS = require("crypto-js");
const Sequelize = require('sequelize');

//Validaciones antes de agregar una experiencia//
async function validacionExperiencia(experiencia) {
    let error = [];
    if (validator.isEmpty(experiencia.titulo_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado un título para la experiencia!')
    }
    if (validator.isEmpty(experiencia.descripcion_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado una descripción para la experiencia!')
    }
    if (validator.isEmpty(experiencia.precio_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado un precio PG a la experiencia!')
    } else if (!validator.isInt(experiencia.precio_experiencia)) {
        error.push('El precio PG debe de ser un número entero!')
    } else if (parseInt(experiencia.precio_experiencia) <= 0) {
        error.push('El precio PG debe de ser mayor a cero!')
    }
    if (validator.isEmpty(experiencia.precio_publico, { ignore_whitespace: true })) {
        error.push('No ha ingresado un precio de establecimiento a la experiencia!')
    } else if (!validator.isInt(experiencia.precio_publico)) {
        error.push('El precio de establecimiento debe de ser un número entero!')
    } else if (parseInt(experiencia.precio_publico) <= 0) {
        error.push('El precio de establecimiento debe de ser mayor a cero!')
    }
    if (validator.isEmpty(experiencia.comision, { ignore_whitespace: true })) {
        error.push('No ha ingresado un porcentaje de comisión a la experiencia!')
    } else if (!validator.isDecimal(experiencia.comision, { force_decimal: false, decimal_digits: '0,2' })) {
        error.push('El porcentaje de comisión puede tener máximo 2 decimales!')
    } else if (parseFloat(experiencia.comision) <= 0) {
        error.push('El porcentaje de comisión debe de ser mayor a cero!')
    } else if (parseFloat(experiencia.comision) > 100) {
        error.push('El porcentaje de comisión debe de ser máximo 100!')
    }
    if (validator.isEmpty(experiencia.experiencia_tipo_id_tipo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el tipo de experiencia!')
    } else if (!(parseInt(experiencia.experiencia_tipo_id_tipo) == 1 || parseInt(experiencia.experiencia_tipo_id_tipo) == 2)) {
        error.push('Error tipo de experiencia!')
    }
    if (validator.isEmpty(experiencia.establecimiento_nit, { ignore_whitespace: true })) {
        error.push('No ha ingresado el establecimiento!')
    } else if (!validator.isInt(experiencia.establecimiento_nit)) {
        error.push('El NIT de establecimiento no es válido!')
    } else {
        await Establecimiento.findOne({ where: { nit: experiencia.establecimiento_nit } })
            .then(establecimiento => {
                if (!establecimiento) {
                    error.push('El establecimiento no existe')
                } else {
                    if (!establecimiento.estado_establecimiento) {
                        error.push('El establecimiento no está activo')
                    }
                }
            })
    }

    if (error.length == 0)
        error = null
    return error

}

async function validacionActivacionExperiencia(experiencia) {
    let error = [];
    if (validator.isEmpty(experiencia.id_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado el ID de la experiencia!')
    } else {
        await Experiencia.findOne({ where: { id_experiencia: experiencia.id_experiencia } }).
            then(exp => {
                if (!exp) {
                    error.push('La experiencia no existe!')
                } else {
                    if (exp.estado_experiencia == 1) {
                        error.push('La experiencia ya se encuentra activa!')
                    }
                }
            })
    }
    if (error.length == 0)
        error = null
    return error
}

async function validacionInactivacionExperiencia(experiencia) {
    let error = [];
    if (validator.isEmpty(experiencia.id_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado el ID de la experiencia!')
    } else {
        await Experiencia.findOne({ where: { id_experiencia: experiencia.id_experiencia } }).
            then(exp => {
                if (!exp) {
                    error.push('La experiencia no existe!')
                } else {
                    if (exp.estado_experiencia == 0) {
                        error.push('La experiencia ya se encuentra inactiva!')
                    }
                }
            })
    }
    if (error.length == 0)
        error = null
    return error
}

async function validaImagenExperiencia(id_experiencia) {
    let error = [];

    await Experiencia.findOne({ where: { id_experiencia: id_experiencia } }).
        then(experiencia => {
            if (!experiencia) {
                error.push("No existe la experiencia!")
            }
        })
    if (error.length == 0) {
        error = null;
    }
    return error
}

module.exports = {
    async crearExperiencia(req, res) {
        let experiencia = {
            titulo_experiencia: req.body.titulo,
            descripcion_experiencia: req.body.descripcion,
            precio_experiencia: req.body.precio_experiencia,
            precio_publico: req.body.precio_publico,
            comision: req.body.comision,
            experiencia_tipo_id_tipo: req.body.tipo_experiencia,
            establecimiento_nit: req.body.establecimiento_nit
        }

        let error = await validacionExperiencia(experiencia);

        if (error) {
            return res.json({ error })
        } else {
            Experiencia.create(experiencia)
            return res.json({ success: 'Experiencia creada!' })
        }
    },
    async obtenerGastronomicas(req, res) {

        let usados = [];
        await Experiencia_Usada.findAll({ raw: true, attributes: ['experiencia_id_experiencia_usada'], where: { user_id_user_usada: req.headers.id_user,renovado_experiencia_usada:0 } }).
            then(usado => {
                usado.forEach(e => {
                    usados.push(e.experiencia_id_experiencia_usada)
                });
            })

        await Experiencia.findAll({
            where: {
                id_experiencia: {
                    [Sequelize.Op.notIn]: usados
                },
                estado_experiencia: 1
            }
        }).
            then(result => { res.json(result) })

    },
    async obtenerEntretenimiento(req, res) {
        await Experiencia.findAll({ where: { experiencia_tipo_id_tipo: 2, estado_experiencia: 1 } }).
            then(experienciasEntretenimiento => {
                if (experienciasEntretenimiento.length > 0) {
                    res.json(experienciasEntretenimiento)
                } else {
                    res.json({ error: 'No existen experiencias de entretenimiento aún!' })
                }
            })
    },
    async activacionExperiencia(req, res) {
        let experiencia = {
            id_experiencia: req.body.id_experiencia
        }

        let error = await validacionActivacionExperiencia(experiencia)

        if (error) {
            return res.json({ error })
        } else {
            Experiencia.update({ estado_experiencia: 1 },
                { where: { id_experiencia: req.body.id_experiencia } })
            return res.json({ success: 'Experiencia activada!' })
        }

    },
    async inactivacionExperiencia(req, res) {
        let experiencia = {
            id_experiencia: req.body.id_experiencia
        }

        let error = await validacionInactivacionExperiencia(experiencia)

        if (error) {
           return  res.json({ error })
        } else {
            Experiencia.update({ estado_experiencia: 0 },
                { where: { id_experiencia: req.body.id_experiencia } })
            return res.json({ success: 'Experiencia inactivada!' })
        }

    },
    async añadirImagen(req, res) {
        if (req.file == undefined) {
            res.json({ error: 'Error al subir imagen!' })
        } else {
            let errores = await validaImagenExperiencia(req.body.id_imagen)
            if (errores) {
                let path = req.file.path
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }

                })
                res.json({ errores })
            } else {
                await Experiencia.update({ imagen_experiencia: '/experiencias/' + req.file.filename },
                    { where: { id_experiencia: req.body.id_imagen } })
                res.json({ success: 'Imagen de experiencia subida con éxito!' })
            }

        }
    },
    async encriptaDatos(req, res) {
        let id_usuario = CryptoJS.AES.encrypt(req.body.id_usuario, process.env.KEY_AES).toString();
        let id_experiencia = CryptoJS.AES.encrypt(req.body.id_experiencia, process.env.KEY_AES).toString();
        return res.json({ id_usuario, id_experiencia })
    },
    async desencriptaDatos(req, res) {
        let bytes_id_usuario = CryptoJS.AES.decrypt(req.body.id_usuario, process.env.KEY_AES);
        let originalText_id_usuario = bytes_id_usuario.toString(CryptoJS.enc.Utf8);
        let bytes_id_experiencia = CryptoJS.AES.decrypt(req.body.id_experiencia, process.env.KEY_AES);
        let originalText_id_experiencia = bytes_id_experiencia.toString(CryptoJS.enc.Utf8);
        return res.json({ originalText_id_usuario, originalText_id_experiencia })
    },
    async obtenerInfoExperiencia(req, res) {

        Experiencia.hasMany(Item, { foreignKey: 'experiencia_id_experiencia_item' })

        await Experiencia.findOne({
            where: { id_experiencia: req.body.id_experiencia },
            include: [{
                model: Item
            }]
        }).
            then(experiencia => {
                res.json(experiencia)
            })

    }

}