const express = require('express')
const router = express.Router()
const AsistenteController = require('../controllers/AsistenteController');

/*Creación de un asistente*/
router.post('/creacion', AsistenteController.crearAsistente);

module.exports = router;