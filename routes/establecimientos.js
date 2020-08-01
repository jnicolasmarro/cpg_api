const express = require('express')
const router = express.Router()
const EstablecimientoController = require('../controllers/EstablecimientoController');
const {upload} = require('../middleware/upload');

/*Creación de un cliente*/
router.post('/creacion', EstablecimientoController.creaEstablecimiento)

/*Subir logo de establecimiento*/
router.post('/subirLogo',upload.single('file'),EstablecimientoController.añadirLogo)

module.exports = router