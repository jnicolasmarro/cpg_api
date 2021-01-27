module.exports= (sequelize, type) => {
    const Establecimiento = sequelize.define('establecimiento',{
        id_establecimiento: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nit_establecimiento: {
            type: type.BIGINT(20),
            primaryKey: false
        },
        nombre_establecimiento: {
            type: type.STRING(50),
            unique:true
        },
        establecimiento_comercial: {
            type: type.STRING(60)
        },
        correo_establecimiento: {
            type: type.STRING(60),
            unique:true
        },
        celular_establecimiento: {
            type: type.STRING(10)
        },
        direccion_establecimiento: {
            type: type.STRING(100)
        },
        cantidad_lote:{
            type: type.INTEGER
        },
        autorizacion_datos: {
            type: type.BOOLEAN
        },
        autorizacion_debito: {
            type: type.BOOLEAN
        },
        logo_establecimiento: {
            type: type.STRING(150),
            unique:true
        },
        estado_establecimiento: {
            type: type.BOOLEAN
        },
        ciudad_id_ciudad:{
            type: type.INTEGER
        }
    }
        , {
            tableName: 'establecimiento',
            timestamps: true    
      });
    return Establecimiento;
}