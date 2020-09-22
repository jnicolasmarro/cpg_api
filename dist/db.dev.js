"use strict";

var Sequelize = require('sequelize');

require('dotenv').config();

var URL = process.env.URL_DB;
var sequelize = new Sequelize(URL, {
  timezone: '-05:00'
});

var UsuarioModel = require('./models/user');

var AfiliacionModel = require('./models/afiliacion');

var EstablecimientoModel = require('./models/establecimiento');

var ExperienciaModel = require('./models/experiencia');

var ItemModel = require('./models/item');

var CiudadModel = require('./models/ciudad');

var UtilModel = require('./models/util');

var Experiencia_Usada_Model = require('./models/experiencia_usada');

var Historico_Establecimiento_Model = require('./models/historico_establecimiento');

var Periodo_AfiliacionModel = require('./models/periodo_afiliacion');

var NoticiaModel = require('./models/noticia');

var User = UsuarioModel(sequelize, Sequelize);
var Afiliacion = AfiliacionModel(sequelize, Sequelize);
var Establecimiento = EstablecimientoModel(sequelize, Sequelize);
var Experiencia = ExperienciaModel(sequelize, Sequelize);
var Item = ItemModel(sequelize, Sequelize);
var Ciudad = CiudadModel(sequelize, Sequelize);
var Util = UtilModel(sequelize, Sequelize);
var Experiencia_Usada = Experiencia_Usada_Model(sequelize, Sequelize);
var Historico_Establecimiento = Historico_Establecimiento_Model(sequelize, Sequelize);
var Periodo_Afiliacion = Periodo_AfiliacionModel(sequelize, Sequelize);
var Noticia = NoticiaModel(sequelize, Sequelize);
module.exports = {
  User: User,
  Afiliacion: Afiliacion,
  Establecimiento: Establecimiento,
  Experiencia: Experiencia,
  Item: Item,
  Ciudad: Ciudad,
  Util: Util,
  Experiencia_Usada: Experiencia_Usada,
  Historico_Establecimiento: Historico_Establecimiento,
  Periodo_Afiliacion: Periodo_Afiliacion,
  Noticia: Noticia,
  Sequelize: Sequelize
};