const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController');



/*Obtener un usuario*/
router.get('/:id', UserController.obtenerUsuario)

/*Obtener todos los usuarios*/
router.get('/', UserController.obtenerUsuarios)

/*Crear nuevo usuario*/
router.post('/singup', UserController.crearUsuario)

/*Actualizar Usuario*/
router.put('/:id', UserController.actualizarUsuario)

/*Inactivar usuario*/
router.delete('/:id',UserController.inactivarUsuario)

module.exports = router