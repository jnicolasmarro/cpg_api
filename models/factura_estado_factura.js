module.exports= (sequelize, type) => {
    const FacturaEstadoFactura = sequelize.define('factura_estado_factura',{
        factura_id_factura: {
            type: type.BIGINT(10),
            primaryKey: true,
            autoIncrement: true
        },
        estado_factura_id_estado_factura: {
            type: type.INTEGER
        },
        factura_estado_factura_actual:{
            type: type.BOOLEAN
        }
        
    }
        , {
            tableName: 'factura_estado_factura',
            timestamps: true    
      });
    return FacturaEstadoFactura;
}