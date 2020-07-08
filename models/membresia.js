module.exports = (sequelize, type) => {
    const Membresia = sequelize.define('membresia',{
        id_membresia: {
            type: type.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        codigo: {
            type: type.STRING,
            unique: true
        },
        user_id_user: {
            type: type.INTEGER,
            unique: true
        }
    }
        , {
            tableName: 'membresia',
            timestamps: true
            
      });
    return Membresia;
 }