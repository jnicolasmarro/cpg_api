const { Item, Experiencia } = require('../db');
const validator = require('validator');

async function validacionItem(item) {
    let error = [];
    if (validator.isEmpty(item.titulo_item, { ignore_whitespace: true })) {
        error.push('No ha ingresado un título para el item!')
    }
    if (validator.isEmpty(item.descripcion_item, { ignore_whitespace: true })) {
        error.push('No ha ingresado una descripción para el item!')
    }
    if (validator.isEmpty(item.experiencia_id_experiencia_item, { ignore_whitespace: true })) {
        error.push('No se ha ingresado el id de la experiencia correspondiente al item!')
    } else {
        await Experiencia.findOne({ where: { id_experiencia: item.experiencia_id_experiencia_item } }).
            then(experiencia => {
                if (!experiencia) {
                    error.push('No existe la experiencia!')
                }
            })
    }
    if (error.length == 0)
        error = null
    return error
}

module.exports = {
    async crearItem(req, res) {

        let item = {
            titulo_item: req.body.titulo_item,
            descripcion_item: req.body.descripcion_item,
            experiencia_id_experiencia_item: req.body.id_experiencia
        }

        let error = await validacionItem(item)

        if (error) {
            return res.json({ error })
        } else {
            Item.create(item)
            return res.json({ success: 'Item creado exitosamente!' })
        }

    }
}