module.exports= (sequelize, type) => {
    const Pago = sequelize.define('pago',{
        id_pago: {
            type: type.BIGINT(10),
            primaryKey: true,
            autoIncrement: true
        },
        total_monto: {
            type: type.DECIMAL(10,2)
        },
        id_establecimiento_pago: {
            type: type.INTEGER
        },
        pago_enviado: {
            type: type.BOOLEAN
        },
        pago_aceptado: {
            type: type.BOOLEAN
        },
        fuente_pago_id_fuente_pago: {
            type: type.BIGINT(10)
        },
        id_transaction:{
            type: type.STRING(100)
        },
        observacion_pago:{
            type: type.STRING(100)
        }
        
    }
        , {
            tableName: 'pago',
            timestamps: true    
      });
    return Pago;
}