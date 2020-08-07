
const Sequelize = require('sequelize');
require('dotenv').config();
const URL = process.env.URL_DB
const sequelize = new Sequelize(URL,{timezone:'-05:00'});


const UsuarioModel  = require('./models/user')
const AfiliacionModel = require('./models/afiliacion')
const EstablecimientoModel = require('./models/establecimiento')
const ExperienciaModel = require('./models/experiencia')
const ItemModel = require('./models/item')
const CiudadModel = require('./models/ciudad')
const UtilModel = require('./models/util')
const Experiencia_Usada_Model = require('./models/experiencia_usada')
const Historico_Establecimiento_Model = require('./models/historico_establecimiento')
const Periodo_AfiliacionModel = require('./models/periodo_afiliacion')

const User = UsuarioModel(sequelize, Sequelize)
const Afiliacion = AfiliacionModel(sequelize, Sequelize)
const Establecimiento = EstablecimientoModel(sequelize, Sequelize)
const Experiencia = ExperienciaModel(sequelize, Sequelize)
const Item = ItemModel(sequelize, Sequelize)
const Ciudad = CiudadModel(sequelize, Sequelize)
const Util = UtilModel(sequelize, Sequelize)
const Experiencia_Usada = Experiencia_Usada_Model(sequelize, Sequelize)
const Historico_Establecimiento = Historico_Establecimiento_Model(sequelize, Sequelize)
const Periodo_Afiliacion = Periodo_AfiliacionModel(sequelize, Sequelize)

module.exports = {
    User,
    Afiliacion,
    Establecimiento,
    Experiencia,
    Item,
    Ciudad,
    Util,
    Experiencia_Usada,
    Historico_Establecimiento,
    Periodo_Afiliacion,
    Sequelize
}