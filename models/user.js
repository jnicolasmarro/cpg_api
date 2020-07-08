const bcrypt = require('bcryptjs');

const UsuarioModel = (sequelize, type) => {
    const Usuario = sequelize.define('user',{
        id_user: {
            type: type.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        nombre_usuario: {
            type: type.STRING
        },
        email: {
            type: type.STRING,
            unique: true
        },
        numero_celular: {
            type: type.STRING
        },
        password: {
            type: type.STRING
        },
        rol_id_rol: {
            type: type.INTEGER
        }
    }
        , {
            hooks: {
                beforeCreate: function (user) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(user.password, salt);
                    user.password = hash;
                    
                }
            },
            tableName: 'user',
            timestamps: true
            
      });
    return Usuario;
}
 
const validarHash = (password,hash) => {
    return bcrypt.compareSync(password, hash);
}

module.exports={UsuarioModel,validarHash};