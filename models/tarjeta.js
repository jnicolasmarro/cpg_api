module.exports= (sequelize, type) => {
    const Tarjeta = sequelize.define('tarjeta',{
        id_tarjeta: {
            type: type.STRING(200),
            primaryKey: true
        },
        numero_tarjeta: {
            type: type.STRING(16)
        },
        cvc: {
            type: type.STRING(3)
        },
        exp_month: {
            type: type.STRING(2)
        },
        exp_year: {
            type: type.STRING(2)
        },
        card_holder: {
            type: type.STRING(100)
        },
        created_at: {
            type: type.STRING(200)
        },
        brand:{
            type: type.STRING(45)
        },
        name:{
            type: type.STRING(45)
        },
        last_four:{
            type: type.STRING(4)
        },
        bin:{
            type: type.STRING(10)
        },
        expires_at:{
            type: type.STRING(100)
        },
        estado_tarjeta:{
            type: type.BOOLEAN
        },
        id_establecimiento_tarjeta:{
            type: type.INTEGER
        }
    }
        , {
            tableName: 'tarjeta',
            timestamps: false    
      });
    return Tarjeta;
}