const Sequelize = require('sequelize');
const { UsuarioModel } = require('./models/user')
const User = require('./models/user')
const MembresiaModel = require('./models/membresia')

const URL = 'mysql://root:Tuv267mato@localhost:3306/cpg'
const sequelize = new Sequelize(URL);


const UserModel = UsuarioModel(sequelize, Sequelize)
const Membresia = MembresiaModel(sequelize, Sequelize)

module.exports = {
    UserModel,
    Membresia,
    User
}