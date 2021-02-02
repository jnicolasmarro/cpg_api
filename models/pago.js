module.exports = (sequelize, type) => {
    const Pago = sequelize.define('pago', {
        id_pago: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pago_fuente_pago: {
            type: type.BIGINT(10)
        },
        pago_id_factura: {
            type: type.BIGINT(10)
        },
        id_transaction: {
            type: type.STRING(100)
        },
        actual:{
            type: type.BOOLEAN
        }
    }
        , {
            tableName: 'pago',
            timestamps: true
        });
    return Pago;
}