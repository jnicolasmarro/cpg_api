module.exports= (sequelize, type) => {
    const Experiencia_Usada = sequelize.define('experiencia_usada',{
        id_experiencia_usada: {
            type: type.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        experiencia_usada_id_user: {
            type: type.INTEGER,
            primaryKey: true
        },
        experiencia_usada_id_experiencia: {
            type: type.INTEGER,
            primaryKey: true
        },
        valor_comision:{
            type: type.DECIMAL(10,2)
        },
        fecha_uso_experiencia_usada: {
            type: type.DATE
        },
        renovado_experiencia_usada: {
            type: type.BOOLEAN
        },
        experiencia_usada_id_pago: {
            type: type.BIGINT(10)
        }
    }
        , {
            tableName: 'experiencia_usada',
            timestamps: true    
      });
    return Experiencia_Usada;
}