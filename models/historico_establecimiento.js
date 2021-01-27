module.exports= (sequelize, type) => {
    const Historico_Establecimiento = sequelize.define('historico_establecimiento',{
        id_establecimiento_historico: {
            type: type.INTEGER,
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