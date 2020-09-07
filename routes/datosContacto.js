const express = require('express')
const router = express.Router()
const DatosContactoController = require('../controllers/DatosContactoController');

/*Permite obtener link de contacto por Whatsapp*/
router.get('/linkWhatsapp', DatosContactoController.obtenerLinkWhatsapp);



module.exports = router