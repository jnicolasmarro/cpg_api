const express = require('express')
const router = express.Router()
const RegisterController = require('../../controllers/Auth/RegisterController');

/*Crear nuevo usuario*/
router.post('/singup', RegisterController)

module.exports = router