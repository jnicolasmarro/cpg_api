const express = require('express')
const router = express.Router()
const MembresiaController = require('../controllers/MembresiaController');

/*Creación de un item de una experiencia*/
router.put('/asignar', MembresiaController.asignarMembresia);

module.exports = router