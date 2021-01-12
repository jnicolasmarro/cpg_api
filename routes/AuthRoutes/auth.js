const express = require('express')
const router = express.Router()
const SingupController = require('../../controllers/Auth/RegisterController');
const SinginController = require('../../controllers/Auth/SinginController');
const RememberController = require('../../controllers/Auth/RememberController');
const {CambiarContraseña,RealizarCambioContraseña,SolicitarCambioContraseña} = require('../../controllers/Auth/CambiarContraseñaController');

/*Crear nuevo usuario*/
router.post('/signup', SingupController)

/*Autenticación de usuario*/
router.post('/signin', SinginController)

/*Recordar contraseña*/
router.get('/remember/:email', RememberController)

/*Cambiar contraseña*/
router.get('/cambio_contrasena/:id_user/:time/:hash', CambiarContraseña)

/*Realizar cambio contraseña*/
router.post('/cambio_contrasena',RealizarCambioContraseña )

/*Solicitar cambio de contraseña*/
router.get('/solicitar_cambio',SolicitarCambioContraseña )

module.exports = router