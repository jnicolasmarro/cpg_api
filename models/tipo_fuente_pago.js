module.exports= (sequelize, type) => {
    const TipoFuentePago = sequelize.define('tipo_fuente_pago',{
        id_tipo_fuente_pago: {
            type: type.INTEGER,
            primaryKey: true
        },
        nombre_tipo_fuente_pago: {
            type: type.STRING(45)
        }
    }
        , {
            tableName: 'tipo_fuente_pago',
            timestamps: false    
      });
    return TipoFuentePago;
}