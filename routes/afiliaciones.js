const express = require('express')
const router = express.Router()
const AfiliacionController = require('../controllers/AfiliacionController');

/*Permite marca una afiliación como asignada*/
router.put('/asignar', AfiliacionController.asignarAfiliacion);

/*Permite renovar una membresía que se encuentre vencida*/
router.put('/renovar', AfiliacionController.renovarAfiliacion);

module.exports = router