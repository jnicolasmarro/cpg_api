module.exports = (sequelize, type) => {
    const Afiliacion = sequelize.define('afiliacion',{
        codigo_afiliacion: {
            type: type.STRING(8),
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
        }
    }
        , {
            tableName: 'afiliacion',
            timestamps: true
            
      });
    return Afiliacion;
 }