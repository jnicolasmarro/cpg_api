const Sequelize = require('sequelize');
require('dotenv').config();
const UsuarioModel  = require('./models/user')
const MembresiaModel = require('./models/membresia')

const URL = process.env.URL_DB
const sequelize = new Sequelize(URL);


const UserModel = UsuarioModel(sequelize, Sequelize)
const Membresia = MembresiaModel(sequelize, Sequelize)

module.exports = {
    UserModel,
    Membresia
}