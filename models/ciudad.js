module.exports= (sequelize, type) => {
    const Ciudad = sequelize.define('ciudad',{
        id_ciudad: {
            type: type.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        nombre_ciudad: {
            type: type.STRING,
            primaryKey: false,
            unique: true
        }
    }
        , {
            tableName: 'ciudad',
            timestamps: false    
      });
    return Ciudad;
}