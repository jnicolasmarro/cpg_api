module.exports= (sequelize, type) => {
    const Custormer_sq = sequelize.define('customer_sq',{
        customer_id: {
            type: type.STRING,
            primaryKey: true,
            unique: true,
            autoIncrement: false
        },
        establecimiento_nit: {
            type: type.BIGINT(20)
        }
    }
        , {
            tableName: 'customer_sq',
            timestamps: false    
      });
    return Custormer_sq;
}