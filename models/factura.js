module.exports= (sequelize, type) => {
    const Factura = sequelize.define('factura',{
        id_factura: {
            type: type.BIGINT(10),
            primaryKey: true,
            autoIncrement: true
        },
        total_monto: {
            type: type.DECIMAL(10,2)
        }
    }
        , {
            tableName: 'factura',
            timestamps: true    
      });
    return Factura;
}