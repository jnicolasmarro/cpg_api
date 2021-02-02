module.exports= (sequelize, type) => {
    const ExperienciaTipo = sequelize.define('experiencia_tipo',{
        id_tipo: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        nombre_estado_pago: {
            type: type.STRING(45)
        }
    }
        , {
            tableName: 'experiencia_tipo',
            timestamps: false    
      });
    return ExperienciaTipo;
}