const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController');



/*Obtener un usuario*/
router.get('/obtenerUsuario/:id', UserController.obtenerUsuario)

/*Obtener todos los usuarios*/
router.get('/obtenerUsuarios', UserController.obtenerUsuarios)

/*Actualizar Usuario*/
router.put('/actualizarUsuarioFinalMovil/:id', UserController.actualizarUsuario)

/*Actualizar Usuario por medio del administrador*/
router.put('/actualizarUsuario/:id', UserController.actualizarDatosUsuario)

/*Inactivar usuario*/
//router.delete('/:id',UserController.inactivarUsuario)

module.exports = router