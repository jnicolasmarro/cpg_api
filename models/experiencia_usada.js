module.exports= (sequelize, type) => {
    const Experiencia_Usada = sequelize.define('experiencia_usada',{
        id_experiencia_usada: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id_user_usada: {
            type: type.INTEGER,
            primaryKey: true
        },
        experiencia_id_experiencia_usada: {
            type: type.INTEGER,
            primaryKey: true
        },
        fecha_uso_experiencia_usada: {
            type: type.DATE
        },
        renovado_experiencia_usada: {
            type: type.BOOLEAN
        }
    }
        , {
            tableName: 'experiencia_usada',
            timestamps: true    
      });
    return Experiencia_Usada;
}