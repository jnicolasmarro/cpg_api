const express = require('express')
const router = express.Router()
const VersionController = require('../controllers/VersionController');



/*Obtener version actual de la app movil*/
router.get('/obtenerVersionAppMovil', VersionController.obtenerVersionAppMovil)

module.exports = router