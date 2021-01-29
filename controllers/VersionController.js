/*Controlador de Usuario*/
const validator = require('validator');
const {Util} = require('../db');
const bcrypt = require('bcryptjs');





module.exports = {
    // Funcion que permite obtener los datos de un usuario por su Id
   async obtenerVersionAppMovil(req, res) {
        let version;

        await Util.findOne({where:{id_param:4}})
        .then(util=>{
            version = util.valor_param
        })

        return res.json({version})
    }
}