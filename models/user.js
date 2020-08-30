module.exports= (sequelize, type) => {
    const Usuario = sequelize.define('user',{
        id_user: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_usuario: {
            type: type.STRING(100)
        },
        numero_identificacion:{
            type: type.BIGINT(15)
        },
        email: {
            type: type.STRING(50),
            unique: true
        },
        numero_celular: {
            type: type.STRING(10)
        },
        password: {
            type: type.STRING(1000)
        },
        estado_user: {
            type: type.BOOLEAN
        },
        rol_id_rol: {
            type: type.INTEGER
        },
        establecimiento_nit_user: {
            type: type.BIGINT(20)
        }
    }
        , {
            tableName: 'user',
            timestamps: true
            
      });
    return Usuario;
}
 


