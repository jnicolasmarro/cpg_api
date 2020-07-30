const express = require('express')
const router = express.Router()
const ExperienciaController = require('../controllers/ExperienciaController');

/*Creacion de una experiencia*/
router.post('/creacionExperiencia', ExperienciaController.crearExperiencia)

module.exports = router