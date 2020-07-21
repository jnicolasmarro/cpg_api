const express = require('express')
const router = express.Router()
const SingupController = require('../../controllers/Auth/RegisterController');
const SinginController = require('../../controllers/Auth/SinginController');

/*Crear nuevo usuario*/
router.post('/singup', SingupController)

/*Autenticación de usuario*/
router.get('/singin', SinginController)

module.exports = router