module.exports = (sequelize, type) => {
    const Util = sequelize.define('util',{
        id_param: {
            type: type.INTEGER,
            primaryKey: true
        },
        nombre_param:{
            type: type.STRING
        },
        valor_param: {
            type: type.STRING
        }
    }
        , {
            tableName: 'util',
            timestamps: false
      });
    return Util;
 }