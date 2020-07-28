module.exports= (sequelize, type) => {
    const Experiencia = sequelize.define('experiencia',{
        id_experiencia: {
            type: type.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        titulo_experiencia: {
            type: type.STRING
        },
        descripcion_experiencia: {
            type: type.STRING
        },
        precio_experiencia: {
            type: type.BIGINT(15)
        },
        precio_publico: {
            type: type.BIGINT(15)
        },
        estado_experiencia:{
            type: type.BOOLEAN
        },
        comision:{
            type: type.INTEGER
        },
        imagen_experiencia: {
            type: type.STRING
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