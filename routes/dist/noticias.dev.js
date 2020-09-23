"use strict";

var express = require('express');

var router = express.Router();

var NoticiaController = require('../controllers/NoticiaController');
/*Creación de una noticia*/


router.post('/creacion', NoticiaController.crearNoticia);
/*Obtener noticias ordenadas de mas reciente a mas antigua*/

router.get('/obtener', NoticiaController.obtenerNoticias);
/*Obtener una noticia*/

router.get('/obtener/:id_noticia', NoticiaController.obtenerNoticia);
module.exports = router;