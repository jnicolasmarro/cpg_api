const express = require('express')
const router = express.Router()
const EstablecimientoController = require('../controllers/EstablecimientoController');

/*Prueba creación cliente*/
router.post('/creacion', EstablecimientoController.creaEstablecimiento)

module.exports = router