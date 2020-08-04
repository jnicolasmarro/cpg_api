const Sequelize = require('sequelize');
require('dotenv').config();
const UsuarioModel  = require('./models/user')
const MembresiaModel = require('./models/membresia')
const EstablecimientoModel = require('./models/establecimiento')
const Customer_ePaycoModel = require('./models/custormer_ePayco')
const User_EstablecimientoModel = require('./models/user_has_establecimiento')
const ExperienciaModel = require('./models/experiencia')
const ItemModel = require('./models/item')
const CiudadModel = require('./models/ciudad')
const UtilModel = require('./models/util')

const URL = process.env.URL_DB
const sequelize = new Sequelize(URL);


const User = UsuarioModel(sequelize, Sequelize)
const Membresia = MembresiaModel(sequelize, Sequelize)
const Establecimiento = EstablecimientoModel(sequelize, Sequelize)
const Custormer_ePayco = Customer_ePaycoModel(sequelize, Sequelize)
const User_Establecimiento = User_EstablecimientoModel(sequelize, Sequelize)
const Experiencia = ExperienciaModel(sequelize, Sequelize)
const Item = ItemModel(sequelize, Sequelize)
const Ciudad = CiudadModel(sequelize, Sequelize)
const Util = UtilModel(sequelize, Sequelize)

module.exports = {
    User,
    Membresia,
    Establecimiento,
    Custormer_ePayco,
    User_Establecimiento,
    Experiencia,
    Item,
    Ciudad,
    Util
}