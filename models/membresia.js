module.exports = (sequelize, type) => {
    const Membresia = sequelize.define('membresia',{
        codigo_membresia: {
            type: type.STRING,
            primaryKey: true,
            unique: true
        },
        asignada:{
            type: type.BOOLEAN
        },
        user_id_user: {
            type: type.INTEGER
        },
        fecha_uso: {
            type: type.DATE
        },
        fecha_vencimiento: {
            type: type.DATE
        },
        periodo_afiliacion:{
            type: type.INTEGER
        }
    }
        , {
            tableName: 'membresia',
            timestamps: true
            
      });
    return Membresia;
 }