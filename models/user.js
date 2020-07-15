module.exports= (sequelize, type) => {
    const Usuario = sequelize.define('user',{
        id_user: {
            type: type.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        nombre_usuario: {
            type: type.STRING
        },
        email: {
            type: type.STRING,
            unique: true
        },
        numero_celular: {
            type: type.STRING
        },
        password: {
            type: type.STRING
        },
        estado_user: {
            type: type.BOOLEAN
        },
        rol_id_rol: {
            type: type.INTEGER
        }
    }
        , {
            tableName: 'user',
            timestamps: true
            
      });
    return Usuario;
}
 


