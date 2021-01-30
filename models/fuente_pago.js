module.exports= (sequelize, type) => {
    const FuentePago = sequelize.define('fuente_pago',{
        id_fuente_pago: {
            type: type.BIGINT(10),
            primaryKey: true
        },
        acceptance_token: {
            type: type.STRING(1000)
        },
        customer_email: {
            type: type.STRING(500)
        },
        type: {
            type: type.STRING(45)
        },
        id_tarjeta_fuente_pago: {
            type: type.STRING(200)
        }
        
    }
        , {
            tableName: 'fuente_pago',
            timestamps: false    
      });
    return FuentePago;
}