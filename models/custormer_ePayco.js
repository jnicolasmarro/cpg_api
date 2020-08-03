module.exports= (sequelize, type) => {
    const Custormer_ePayco = sequelize.define('customer_epayco',{
        customer_id: {
            type: type.STRING,
            primaryKey: true,
            unique: true,
            autoIncrement: false
        },
        establecimiento_nit: {
            type: type.BIGINT(20),
            primaryKey: true,
            unique: true,
            autoIncrement: false
        }
    }
        , {
            tableName: 'customer_epayco',
            timestamps: false    
      });
    return Custormer_ePayco;
}