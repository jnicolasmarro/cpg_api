module.exports= (sequelize, type) => {
    const Ciudad = sequelize.define('ciudad',{
        id_ciudad: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_ciudad: {
            type: type.STRING(20),
            unique: true
        }
    }
        , {
            tableName: 'ciudad',
            timestamps: false    
      });
    return Ciudad;
}