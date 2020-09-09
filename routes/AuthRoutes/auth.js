const express = require('express')
const router = express.Router()
const SingupController = require('../../controllers/Auth/RegisterController');
const SinginController = require('../../controllers/Auth/SinginController');
const RememberController = require('../../controllers/Auth/RememberController');
const ChangeController = require('../../controllers/Auth/CambiarContraseñaController');

/*Crear nuevo usuario*/
router.post('/singup', SingupController)

/*Autenticación de usuario*/
router.post('/singin', SinginController)

/*Recordar contraseña*/
router.get('/remember/:email', RememberController)

/*Cambiar contraseña*/
router.get('/cambio_contrasena/:id_user/:time/:hash', ChangeController)

module.exports = router