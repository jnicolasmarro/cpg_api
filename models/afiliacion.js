module.exports = (sequelize, type) => {
    const Afiliacion = sequelize.define('afiliacion',{
        codigo_afiliacion: {
            type: type.STRING(8),
            primaryKey: true,
            unique: true
        },
        afiliacion_asignada:{
            type: type.BOOLEAN
        },
        afiliacion_id_user: {
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