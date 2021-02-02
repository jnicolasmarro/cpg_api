module.exports = (sequelize, type) => {
    const Pago = sequelize.define('pago_estado_pago', {
        pago_id_pago: {
            type: type.INTEGER,
            primaryKey: true
        },
        estado_pago_id_estado_pago: {
            type: type.INTEGER
        },
        pago_estado_pago_actual: {
            type: type.BOOLEAN
        },
        observacion: {
            type: type.STRING(200)
        }
    }
        , {
            tableName: 'pago_estado_pago',
            timestamps: true
        });
    return Pago;
}