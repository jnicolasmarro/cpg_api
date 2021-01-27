module.exports = (sequelize, type) => {
    const Afiliacion = sequelize.define('afiliacion',{
        codigo_afiliacion: {
            type: type.STRING(8),
            primaryKey: true,
            unique: true
        },
        codigo_asignado:{
            type: type.BOOLEAN
        },
        id_user_afiliacion: {
            type: type.INTEGER
        },
        fecha_activacion: {
            type: type.DATE
        },
        fecha_vencimiento: {
            type: type.DATE
        },
        fecha_expiracion:{
            type: type.DATE
        }
    }
        , {
            tableName: 'afiliacion',
            timestamps: true
            
      });
    return Afiliacion;
 }