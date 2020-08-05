module.exports = (sequelize, type) => {
    const Item = sequelize.define('item', {
        id_item: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo_item: {
            type: type.STRING(100)
        },
        descripcion_item: {
            type: type.STRING(800)
        },
        estado_item: {
            type: type.BOOLEAN
        },
        experiencia_id_experiencia_item: {
            type: type.INTEGER
        }
    }
        , {
            tableName: 'item',
            timestamps: true
        });
    return Item;
}