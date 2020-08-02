const express = require('express')
const router = express.Router()
const EstablecimientoController = require('../controllers/EstablecimientoController');
const {upload} = require('../middleware/upload');

/*Creación de un cliente*/
router.post('/creacion', EstablecimientoController.creaEstablecimiento)

/*Subir logo de establecimiento*/
router.put('/subirLogo',upload.single('file'),EstablecimientoController.añadirLogo)

/*Vincular tarjeta a establecimiento*/
router.post('/vincularTarjeta',EstablecimientoController.vincularTarjeta)

/*Realizar un pago por nit del establecimiento*/
router.get('/searchCustomer',EstablecimientoController.realizarPago)

module.exports = router