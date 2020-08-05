module.exports = (sequelize, type) => {
    const Util = sequelize.define('util',{
        id_param: {
            type: type.INTEGER,
            primaryKey: true
        },
        nombre_param:{
            type: type.STRING(45)
        },
        valor_param: {
            type: type.STRING(45)
        }
    }
        , {
            tableName: 'util',
            timestamps: false
      });
    return Util;
 }