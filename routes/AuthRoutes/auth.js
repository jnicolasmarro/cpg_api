const express = require('express')
const router = express.Router()
const SignupController = require('../../controllers/Auth/RegisterController');
const SigninController = require('../../controllers/Auth/SigninController');
const RememberController = require('../../controllers/Auth/RememberController');
const {CambiarContraseña,RealizarCambioContraseña,SolicitarCambioContraseña} = require('../../controllers/Auth/CambiarContraseñaController');

/*Crear nuevo usuario final por medio del cliente móvil*/
router.post('/signup', SignupController)

/*Autenticación de usuario*/
router.post('/signin', SigninController)

/*Recordar contraseña*/
router.get('/remember/:email', RememberController)

/*Cambiar contraseña*/
router.get('/cambio_contrasena/:id_user/:time/:hash', CambiarContraseña)

/*Realizar cambio contraseña*/
router.post('/cambio_contrasena',RealizarCambioContraseña )

/*Solicitar cambio de contraseña*/
router.get('/solicitar_cambio',SolicitarCambioContraseña )

module.exports = router