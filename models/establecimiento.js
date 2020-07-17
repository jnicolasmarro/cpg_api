module.exports= (sequelize, type) => {
    const Establecimiento = sequelize.define('establecimiento',{
        nit: {
            type: type.BIGINT(20),
            primaryKey: true,
            unique: true,
            autoIncrement: false
        },
        nombre_empresa: {
            type: type.STRING
        },
        establecimiento_comercial: {
            type: type.STRING
        },
        correo_establecimiento: {
            type: type.STRING,
            unique:true
        },
        celular_establecimiento: {
            type: type.STRING
        },
        direccion_establecimiento: {
            type: type.STRING
        },
        autorizacion_datos: {
            type: type.BOOLEAN
        },
        autorizacion_debito: {
            type: type.BOOLEAN
        },
        logo_establecimiento: {
            type: type.STRING
        },
        estado_establecimiento: {
            type: type.BOOLEAN
        }
    }
        , {
            tableName: 'establecimiento',
            timestamps: true    
      });
    return Establecimiento;
}