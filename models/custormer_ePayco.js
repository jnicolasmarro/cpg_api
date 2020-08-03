module.exports= (sequelize, type) => {
    const Custormer_ePayco = sequelize.define('customer_epayco',{
        establecimiento_nit: {
            type: type.BIGINT(20),
            unique: true,
            primaryKey: true
        },
        customer_id: {
            type: type.STRING,
            unique: true
        },
        token_card: {
            type: type.STRING,
            unique: true
        }

    }
        , {
            tableName: 'customer_epayco',
            timestamps: false    
      });
    return Custormer_ePayco;
}