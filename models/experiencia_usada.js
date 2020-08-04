module.exports= (sequelize, type) => {
    const Experiencia_Usada = sequelize.define('experiencia_usada',{
        user_id_user: {
            type: type.INTEGER,
            primaryKey: true
        },
        experiencia_id_experiencia: {
            type: type.INTEGER,
            primaryKey: true
        },
        fecha_uso_experiencia: {
            type: type.DATE
        }
    }
        , {
            tableName: 'experiencia_usada',
            timestamps: false    
      });
    return Experiencia_Usada;
}