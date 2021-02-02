module.exports= (sequelize, type) => {
    const EstadoFactura = sequelize.define('estado_factura',{
        id_estado_factura: {
            type: type.INTEGER,
            primaryKey: true
        },
        nombre_estado_factura: {
            type: type.STRING(45)
        }
    }
        , {
            tableName: 'estado_factura',
            timestamps: false    
      });
    return EstadoFactura;
}