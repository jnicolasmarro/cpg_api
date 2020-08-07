module.exports= (sequelize, type) => {
    const Historico_Establecimiento = sequelize.define('historico_establecimiento',{
        establecimiento_nit_historico: {
            type: type.BIGINT(20),
            primaryKey: true
        },
        procesados_total: {
            type: type.INTEGER
        },
        procesados_lote: {
            type: type.INTEGER
        }
    }
        , {
            tableName: 'historico_establecimiento',
            timestamps: false    
      });
    return Historico_Establecimiento;
}