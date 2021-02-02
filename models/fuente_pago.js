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
        id_tarjeta_fuente_pago: {
            type: type.STRING(200)
        },
        fuente_pago_id_tipo_fuente_pago: {
            type: type.INTEGER
        },
        cuotas_pago: {
            type: type.INTEGER
        }
        
    }
        , {
            tableName: 'fuente_pago',
            timestamps: false    
      });
    return FuentePago;
}