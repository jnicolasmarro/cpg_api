module.exports= (sequelize, type) => {
    const EstadoPago = sequelize.define('estado_pago',{
        id_estado_pago: {
            type: type.INTEGER,
            primaryKey: true
        },
        nombre_estado_pago: {
            type: type.STRING(45)
        }
    }
        , {
            tableName: 'estado_pago',
            timestamps: false    
      });
    return EstadoPago;
}