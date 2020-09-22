module.exports = (sequelize, type) => {
    const Noticia = sequelize.define('noticia', {
        id_noticia: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo_noticia: {
            type: type.STRING(100)
        },
        contenido_noticia: {
            type: type.STRING(1000)
        },
        imagen_noticia: {
            type: type.STRING(100)
        },
        estado_noticia:{
            type: type.BOOLEAN
        }
    }
        , {
            tableName: 'noticia',
            timestamps: true
        });
    return Noticia;
}