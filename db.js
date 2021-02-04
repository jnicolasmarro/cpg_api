
// Conexión a la base de datos
const Sequelize = require('sequelize');
require('dotenv').config();
const URL = process.env.URL_DB
const sequelize = new Sequelize(URL,{timezone:'-05:00',logging:true});

// Modelos de la base de datos
const AfiliacionModel = require('./models/afiliacion')
const CiudadModel = require('./models/ciudad')
const EstablecimientoModel = require('./models/establecimiento')
const EstadoFacturaModel = require('./models/estado_factura')
const EstadoPagoModel = require('./models/estado_pago')
const ExperienciaTipoModel = require('./models/experiencia_tipo')
const Experiencia_Usada_Model = require('./models/experiencia_usada')
const ExperienciaModel = require('./models/experiencia')
const FacturaEstadoFacturaModel = require('./models/factura_estado_factura')
const FacturaModel = require('./models/factura')
const FuentePagoModel = require('./models/fuente_pago')
const ItemModel = require('./models/item')
const NoticiaModel = require('./models/noticia')
const PagoEstadoPagoModel = require('./models/pago_estado_pago')
const PagoModel = require('./models/pago')
const Periodo_AfiliacionModel = require('./models/periodo_afiliacion')
const RolModel = require('./models/rol')
const TarjetaModel = require('./models/tarjeta')
const TipoFuentePagoModel = require('./models/tipo_fuente_pago')
const UsuarioModel  = require('./models/user')
const UtilModel = require('./models/util');

// Objetos Sequelize
const Afiliacion = AfiliacionModel(sequelize, Sequelize)
const Ciudad = CiudadModel(sequelize, Sequelize)
const Establecimiento = EstablecimientoModel(sequelize, Sequelize)
const EstadoFactura = EstadoFacturaModel(sequelize, Sequelize)
const EstadoPago = EstadoPagoModel(sequelize, Sequelize)
const ExperienciaTipo = ExperienciaTipoModel(sequelize, Sequelize)
const Experiencia_Usada = Experiencia_Usada_Model(sequelize, Sequelize)
const Experiencia = ExperienciaModel(sequelize, Sequelize)
const FacturaEstadoFactura = FacturaEstadoFacturaModel(sequelize, Sequelize)
const Factura = FacturaModel(sequelize, Sequelize)
const FuentePago = FuentePagoModel(sequelize, Sequelize)
const Item = ItemModel(sequelize, Sequelize)
const Noticia = NoticiaModel(sequelize, Sequelize)
const PagoEstadoPago = PagoEstadoPagoModel(sequelize, Sequelize)
const Pago = PagoModel(sequelize, Sequelize)
const Periodo_Afiliacion = Periodo_AfiliacionModel(sequelize, Sequelize)
const Rol = RolModel(sequelize, Sequelize)
const Tarjeta = TarjetaModel(sequelize, Sequelize)
const TipoFuentePago = TipoFuentePagoModel(sequelize, Sequelize)
const User = UsuarioModel(sequelize, Sequelize)
const Util = UtilModel(sequelize, Sequelize)

// Relaciones entre tablas

Afiliacion.hasMany(Periodo_Afiliacion, { foreignKey: 'afiliacion_codigo_afiliacion' })
Periodo_Afiliacion.belongsTo(Afiliacion, { foreignKey: 'afiliacion_codigo_afiliacion' })

Afiliacion.belongsTo(User, { foreignKey: 'afiliacion_id_user' })
User.hasOne(Afiliacion, { foreignKey: 'afiliacion_id_user' })

Ciudad.hasMany(User, { foreignKey: 'user_id_ciudad' })
User.belongsTo(Ciudad,{foreignKey:'user_id_ciudad'})

Ciudad.hasMany(Establecimiento, { foreignKey: 'establecimiento_id_ciudad' })
Establecimiento.belongsTo(Ciudad, { foreignKey: 'establecimiento_id_ciudad' })

Establecimiento.hasMany(Tarjeta, { foreignKey: 'id_establecimiento_tarjeta' })
Tarjeta.belongsTo(Establecimiento, { foreignKey: 'id_establecimiento_tarjeta' })

Establecimiento.hasMany(Experiencia, { foreignKey: 'id_establecimiento_experiencia' })
Experiencia.belongsTo(Establecimiento, { foreignKey: 'id_establecimiento_experiencia' })

Establecimiento.hasMany(User, { foreignKey: 'id_establecimiento_user' })
User.belongsTo(Establecimiento, { foreignKey: 'id_establecimiento_user' })

EstadoFactura.hasMany(FacturaEstadoFactura, { foreignKey: 'estado_factura_id_estado_factura' })
FacturaEstadoFactura.belongsTo(EstadoFactura, { foreignKey: 'estado_factura_id_estado_factura' })

EstadoPago.hasMany(PagoEstadoPago, { foreignKey: 'estado_pago_id_estado_pago' })
PagoEstadoPago.belongsTo(EstadoPago, { foreignKey: 'estado_pago_id_estado_pago' })

ExperienciaTipo.hasMany(Experiencia, { foreignKey: 'experiencia_tipo_id_tipo' })
Experiencia.belongsTo(ExperienciaTipo, { foreignKey: 'experiencia_tipo_id_tipo' })

Experiencia_Usada.belongsTo(Experiencia,{foreignKey:'experiencia_usada_id_experiencia'})
Experiencia.hasMany(Experiencia_Usada, { foreignKey: 'experiencia_usada_id_experiencia' })

Experiencia_Usada.belongsTo(User, { foreignKey: 'experiencia_usada_id_user' })
User.hasMany(Experiencia_Usada,{foreignKey:'experiencia_usada_id_user'})

Experiencia_Usada.belongsTo(Factura, { foreignKey: 'experiencia_usada_id_factura' })
Factura.hasMany(Experiencia_Usada,{foreignKey:'experiencia_usada_id_factura'})

Experiencia.hasMany(Item, { foreignKey: 'experiencia_id_experiencia_item' })
Item.belongsTo(Experiencia, { foreignKey: 'experiencia_id_experiencia_item' })

FacturaEstadoFactura.belongsTo(Factura, { foreignKey: 'factura_id_factura' })
Factura.hasMany(FacturaEstadoFactura, { foreignKey: 'factura_id_factura' })

Factura.hasMany(Pago, { foreignKey: 'pago_id_factura' })
Pago.belongsTo(Factura, { foreignKey: 'pago_id_factura' })

Tarjeta.hasOne(FuentePago, { foreignKey: 'id_tarjeta_fuente_pago' })
FuentePago.belongsTo(Tarjeta,{ foreignKey: 'id_tarjeta_fuente_pago' })

PagoEstadoPago.belongsTo(Pago,{ foreignKey: 'pago_id_pago' })
Pago.hasMany(PagoEstadoPago,{ foreignKey: 'pago_id_pago' })

Pago.belongsTo(FuentePago,{ foreignKey: 'pago_fuente_pago' })
FuentePago.hasMany(Pago,{ foreignKey: 'pago_fuente_pago' })

User.belongsTo(Rol,{foreignKey:'rol_id_rol'})
Rol.hasMany(User,{foreignKey:'rol_id_rol'})

FuentePago.belongsTo(TipoFuentePago,{foreignKey:'fuente_pago_id_tipo_fuente_pago'})
TipoFuentePago.hasMany(FuentePago,{foreignKey:'fuente_pago_id_tipo_fuente_pago'})

module.exports = {
    Afiliacion,
    Ciudad,
    Establecimiento,
    EstadoFactura,
    EstadoPago,
    ExperienciaTipo,
    Experiencia_Usada,
    Experiencia,
    FacturaEstadoFactura,
    Factura,
    FuentePago,
    Item,
    Noticia,
    PagoEstadoPago,
    Pago,
    Periodo_Afiliacion,
    Rol,
    Tarjeta,
    TipoFuentePago,
    User,
    Util,
    sequelize,
    Sequelize
}