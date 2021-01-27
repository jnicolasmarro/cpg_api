const express = require('express')
const router = express.Router()
const AfiliacionController = require('../controllers/AfiliacionController');
const { Afiliacion } = require('../db');

/*Permite marca una afiliación como asignada*/
router.put('/asignar', AfiliacionController.asignarAfiliacion);

/*Permite renovar una membresía que se encuentre vencida*/
router.put('/renovar', AfiliacionController.renovarAfiliacion);

/*Permite generar una cierta cantidad de códigos de afiliación*/
router.put('/generarNuevos', AfiliacionController.generarCodigos);

module.exports = router