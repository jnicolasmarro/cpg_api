const Sequelize = require('sequelize');
require('dotenv').config();
const UsuarioModel  = require('./models/user')
const MembresiaModel = require('./models/membresia')
const EstablecimientoModel = require('./models/establecimiento')
const Customer_sqModel = require('./models/custormer_sq')
const User_EstablecimientoModel = require('./models/user_has_establecimiento')
const ExperienciaModel = require('./models/experiencia')

const URL = process.env.URL_DB
const sequelize = new Sequelize(URL);


const User = UsuarioModel(sequelize, Sequelize)
const Membresia = MembresiaModel(sequelize, Sequelize)
const Establecimiento = EstablecimientoModel(sequelize, Sequelize)
const Custormer_sq = Customer_sqModel(sequelize, Sequelize)
const User_Establecimiento = User_EstablecimientoModel(sequelize, Sequelize)
const Experiencia = ExperienciaModel(sequelize, Sequelize)

module.exports = {
    User,
    Membresia,
    Establecimiento,
    Custormer_sq,
    User_Establecimiento,
    Experiencia
}