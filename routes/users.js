const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
    res.json('g')
})

router.post('/',UserController.crearUsuario)

module.exports = router