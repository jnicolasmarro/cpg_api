const Sequelize = require('sequelize');
require('dotenv').config();
const UsuarioModel  = require('./models/user')
const MembresiaModel = require('./models/membresia')
const EstablecimientoModel = require('./models/establecimiento')

const URL = process.env.URL_DB
const sequelize = new Sequelize(URL);


const User = UsuarioModel(sequelize, Sequelize)
const Membresia = MembresiaModel(sequelize, Sequelize)
const Establecimiento = EstablecimientoModel(sequelize, Sequelize)

module.exports = {
    User,
    Membresia,
    Establecimiento
}