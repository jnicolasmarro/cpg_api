const express = require('express')
const router = express.Router()
const ItemController = require('../controllers/ItemController');

/*Creación de un item de una experiencia*/
router.post('/creacionItem', ItemController.crearItem);

module.exports = router