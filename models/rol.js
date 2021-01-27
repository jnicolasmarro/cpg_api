module.exports= (sequelize, type) => {
    const Rol = sequelize.define('rol',{
        id_rol: {
            type: type.INTEGER,
            primaryKey: true
        },
        nombre_rol: {
            type: type.STRING(45)
        },
        interfaz_movil: {
            type: type.BOOLEAN
        },
        interfaz_web:{
            type: type.BOOLEAN
        }
    }
        , {
            tableName: 'rol',
            timestamps: false    
      });
    return Rol;
}