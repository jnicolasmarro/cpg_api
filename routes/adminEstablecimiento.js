const express = require('express')
const router = express.Router()
const AsistenteController = require('../controllers/AsistenteController');
const AdminEstablecimientoController = require('../controllers/AdminEstablecimientoController');
const ExperienciaController = require('../controllers/ExperienciaController')
const ReporteController = require ('../controllers/ReporteController')

/*Creación de un asistente*/
router.post('/creacionAsistente', AsistenteController.crearAsistente);

/*Listar asistentes de un establecimiento*/
router.get('/asistentes', AsistenteController.listarAsistentesActivos);

/*Inactivar asistente*/
router.put('/inactivar/:id_asistente', AsistenteController.inactivarAsistente);

/*Obtener datos del administrador de establecimiento*/
router.get('/adminEsta/:id', AdminEstablecimientoController.obtenerAdministradorAsistenteEstablecimiento);

/*Actualizar datos del administrador de establecimiento*/
router.put('/adminEsta/:id', AdminEstablecimientoController.updateAdminAsisEstablecimiento);

/*Obtener todas las experiencias de un establecimiento*/
router.get('/experiencias',ExperienciaController.listarExperiencias);

/*Obtener estadisticas de un establecimiento*/
router.get('/estadisticas',AdminEstablecimientoController.traeEstadisticas);

/*Obtener reporte usuarios*/
router.get('/reporteUsuarios',ReporteController.clientesEstablecimiento);

module.exports = router;