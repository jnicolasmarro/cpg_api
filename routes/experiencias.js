const express = require('express')
const router = express.Router()
const ExperienciaController = require('../controllers/ExperienciaController');
const {upload} = require('../middleware/upload');

/*Creacion de una experiencia*/
router.post('/creacionExperiencia', ExperienciaController.crearExperiencia)

/*Obtener todas las experiencias gastronómicas*/
router.get('/gastronomicas', ExperienciaController.obtenerGastronomicas)

/*Obtener todas las experiencias de entretenimiento*/
router.get('/entretenimiento', ExperienciaController.obtenerEntretenimiento)

/*Activación de una experiencia*/
router.put('/activacion', ExperienciaController.activacionExperiencia)

/*Inactivación de una experiencia*/
router.put('/inactivacion', ExperienciaController.inactivacionExperiencia)

/*Subir logo de establecimiento*/
router.put('/subirImagenExp',upload.single('file'),ExperienciaController.añadirImagen)

/*Encripta datos*/
router.get('/encriptar',ExperienciaController.encriptaDatos)

/*Desencripta datos*/
router.get('/desencriptar',ExperienciaController.desencriptaDatos)

/*Obtiene la información de una experiencia*/
router.get('/obtener',ExperienciaController.obtenerInfoExperiencia)

module.exports = router