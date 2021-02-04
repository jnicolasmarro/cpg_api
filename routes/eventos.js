const express = require('express')
const router = express.Router()
const EventosController = require('../controllers/EventosController')


/*Recibir eventos de la pasarela*/
router.post('/recibireventos', function(request){
   EventosController.recibirEventos(request)
});


module.exports = router

