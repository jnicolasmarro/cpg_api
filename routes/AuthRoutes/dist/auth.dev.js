"use strict";

var express = require('express');

var router = express.Router();

var SingupController = require('../../controllers/Auth/RegisterController');

var SinginController = require('../../controllers/Auth/SinginController');

var RememberController = require('../../controllers/Auth/RememberController');

var _require = require('../../controllers/Auth/CambiarContraseñaController'),
    CambiarContraseña = _require.CambiarContraseña,
    RealizarCambioContraseña = _require.RealizarCambioContraseña,
    SolicitarCambioContraseña = _require.SolicitarCambioContraseña;
/*Crear nuevo usuario*/


router.post('/singup', SingupController);
/*Autenticación de usuario*/

router.post('/singin', SinginController);
/*Recordar contraseña*/

router.get('/remember/:email', RememberController);
/*Cambiar contraseña*/

router.get('/cambio_contrasena/:id_user/:time/:hash', CambiarContraseña);
/*Realizar cambio contraseña*/

router.post('/cambio_contrasena', RealizarCambioContraseña);
/*Solicitar cambio de contraseña*/

router.get('/solicitar_cambio', SolicitarCambioContraseña);
module.exports = router;