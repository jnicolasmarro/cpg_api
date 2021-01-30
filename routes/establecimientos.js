const express = require('express')
const router = express.Router()
const EstablecimientoController = require('../controllers/EstablecimientoController');
const PasarelaController = require('../controllers/PasarelaController')
const {upload} = require('../middleware/upload');

/*Creación de un cliente*/
router.post('/creacion', EstablecimientoController.creaEstablecimiento)

/*Subir logo de establecimiento*/
router.put('/subirLogo',upload.single('file'),EstablecimientoController.añadirLogo)

/*Vincular tarjeta a establecimiento*/
router.post('/vincularTarjeta',PasarelaController.RegistrarTarjeta)

/*GenerarPagos*/
router.post('/generarPagos',PasarelaController.RegistrarTarjeta)


module.exports = router