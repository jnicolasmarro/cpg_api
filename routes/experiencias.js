const express = require('express')
const router = express.Router()
const ExperienciaController = require('../controllers/ExperienciaController');

/*Creacion de una experiencia*/
router.post('/creacionExperiencia', ExperienciaController.crearExperiencia)

/*Obtener todas las experiencias gastronómicas*/
router.get('/gastronomicas', ExperienciaController.obtenerGastronomicas)

/*Obtener todas las experiencias de entretenimiento*/
router.get('/entretenimiento', ExperienciaController.obtenerEntretenimiento)

module.exports = router