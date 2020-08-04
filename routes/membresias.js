const express = require('express')
const router = express.Router()
const MembresiaController = require('../controllers/MembresiaController');

/*Permite marca una membresía como asignada*/
router.put('/asignar', MembresiaController.asignarMembresia);

/*Permite renovar una membresía que se encuentre vencida*/
router.put('/renovar', MembresiaController.renovarMembresia);

module.exports = router