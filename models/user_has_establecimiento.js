module.exports= (sequelize, type) => {
    const User_Establecimiento = sequelize.define('user_has_establecimiento',{
        user_id_user: {
            type: type.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: false
        },
        establecimiento_nit: {
            type: type.BIGINT(20),
            primaryKey: true
        }
    }
        , {
            tableName: 'user_has_establecimiento',
            timestamps: true    
      });
    return User_Establecimiento;
}