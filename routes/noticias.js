const express = require('express')
const router = express.Router()
const NoticiaController = require('../controllers/NoticiaController');

/*Creación de una noticia*/
router.post('/creacion', NoticiaController.crearNoticia);

/*Obtener noticias ordenadas de mas reciente a mas antigua*/
router.get('/obtener', NoticiaController.obtenerNoticias);

/*Obtener una noticia*/ 
router.get('/obtener/:id_noticia', NoticiaController.obtenerNoticia);

module.exports = router