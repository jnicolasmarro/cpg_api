const express = require('express')
const router = express.Router()
const AsistenteController = require('../controllers/AsistenteController');

/*Creación de un asistente*/
router.post('/creacion', AsistenteController.crearAsistente);

/*Listar asistentes de un establecimiento*/
router.get('/asistentes', AsistenteController.listarAsistentesActivos);

module.exports = router;