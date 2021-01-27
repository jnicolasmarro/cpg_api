const express = require('express')
const router = express.Router()
const ExperienciaController = require('../controllers/ExperienciaController');
const {upload} = require('../middleware/upload');

/*Creacion de una experiencia*/
router.post('/creacionExperiencia', ExperienciaController.crearExperiencia)

/*Obtener todas las experiencias cenas especiales*/
router.get('/disponibles/:tipo_experiencia', ExperienciaController.obtenerExperienciasDisponibles)

/*Obtener todas las experiencias cenas especiales*/
router.get('/gastronomicas', ExperienciaController.obtenerGastronomicas)

/*Obtener todas las experiencias de seleccion de productos*/
router.get('/seleccion', ExperienciaController.obtenerSeleccion)

/*Obtener todas las experiencias de seleccion de productos*/
router.get('/bienestar', ExperienciaController.obtenerBienestar)

/*Activación de una experiencia*/
router.put('/activacion', ExperienciaController.activacionExperiencia)

/*Inactivación de una experiencia*/
router.put('/inactivacion', ExperienciaController.inactivacionExperiencia)

/*Subir logo de establecimiento*/
router.put('/subirImagenExp',upload.single('file'),ExperienciaController.añadirImagen)

/*Encripta datos*/
router.get('/encriptar/:id_user/:id_exp',ExperienciaController.encriptaDatos)

/*Procesa la información leida de un QR*/
router.put('/procesarQR',ExperienciaController.procesaQR)

/*Obtiene la información de una experiencia*/
router.get('/obtener/:id',ExperienciaController.obtenerInfoExperiencia)

/*Obtiene la información de una experiencia*/
router.get('/escuchandoRespuesta/:id_user/:id_exp',ExperienciaController.esperaRespuesta)

/*Genera busqueda*/
router.get('/busqueda/:tipo/:search',ExperienciaController.busquedaExperiencias)

module.exports = router