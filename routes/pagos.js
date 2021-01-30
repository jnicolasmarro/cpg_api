const express = require('express')
const router = express.Router()
const PagoController = require('../controllers/PagoController');
const PasarelaController = require('../controllers/PasarelaController')

/*Ejecutar pago*/
router.post('/ejecutarpago', PagoController.realizarPagoManual);

/*Ejecutar pago*/
router.post('/registrarTarjeta', PasarelaController.RegistrarTarjeta);


module.exports = router

