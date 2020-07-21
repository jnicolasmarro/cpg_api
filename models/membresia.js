module.exports = (sequelize, type) => {
    const Membresia = sequelize.define('membresia',{
        codigo_membresia: {
            type: type.STRING,
            primaryKey: true,
            unique: true
        },
        fecha_uso: {
            type: type.DATE
        },
        fecha_vencimiento: {
            type: type.DATE
        },
        user_id_user: {
            type: type.INTEGER,
            unique: true
        }
    }
        , {
            tableName: 'membresia',
            timestamps: true
            
      });
    return Membresia;
 }