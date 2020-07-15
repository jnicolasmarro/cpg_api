const express = require('express')
const router = express.Router()
const EstablecimientoController = require('../controllers/EstablecimientoController');

/*Creación de un cliente*/
router.post('/creacion', EstablecimientoController.creaEstablecimiento)

module.exports = router