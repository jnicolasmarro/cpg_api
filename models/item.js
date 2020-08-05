module.exports = (sequelize, type) => {
    const Item = sequelize.define('item',{
        id_item: {
            type: type.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        titulo_item: {
            type: type.STRING
        },
        descripcion_item: {
            type: type.STRING
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