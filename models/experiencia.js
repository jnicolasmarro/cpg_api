module.exports= (sequelize, type) => {
    const Experiencia = sequelize.define('experiencia',{
        id_experiencia: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo_experiencia: {
            type: type.STRING(150)
        },
        descripcion_experiencia: {
            type: type.STRING(200)
        },
        precio_experiencia: {
            type: type.BIGINT(7)
        },
        precio_publico: {
            type: type.BIGINT(7)
        },
        estado_experiencia:{
            type: type.BOOLEAN
        },
        comision:{
            type: type.DECIMAL(5, 2)
        },
        imagen_experiencia: {
            type: type.STRING(150),
            unique: true
        },
        experiencia_tipo_id_tipo: {
            type: type.INTEGER
        },
        establecimiento_nit: {
            type: type.BIGINT(20)
        }
    }
        , {
            tableName: 'experiencia',
            timestamps: true    
      });
    return Experiencia;
}