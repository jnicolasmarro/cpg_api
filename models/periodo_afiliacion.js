module.exports = (sequelize, type) => {
    const Periodo_Afiliacion = sequelize.define('periodo_afiliacion', {
        periodo_afiliacion: {
            type: type.INTEGER,
            primaryKey: true
        },
        afiliacion_codigo_afiliacion: {
            type: type.STRING(8),
            primaryKey: true
        },
        fecha_afiliacion: {
            type: type.DATE
        }
    }
        , {
            tableName: 'periodo_afiliacion',
            timestamps: false
        });
    return Periodo_Afiliacion;
}