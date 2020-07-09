const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController');

/*Obtener un usuario*/
router.get('/:id', UserController.obtenerUsuario)

/*Crear nuevo usuario*/
router.post('/',UserController.crearUsuario)

module.exports = router