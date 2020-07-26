const { User, User_Establecimiento, Establecimiento } = require('../db');
const validator = require('validator');
const bcrypt = require('bcryptjs');

async function traeEstablecimiento(admin) {

  let nit;

  await User_Establecimiento.findOne({ where: { user_id_user: admin } }).
    then(establecimiento => {
      if (establecimiento) {
        nit = establecimiento.establecimiento_nit;
      }
    })

  return nit;

}

async function validacionDatosAsistente(asistente) {
  let error = [];

  if (validator.isEmpty(asistente.email, { ignore_whitespace: true })) {
    error.push('No ha ingresado el correo del asistente')
  } else if (!validator.isEmail(asistente.email)) {
    error.push('No ha ingresado un correo válido')
  } else {
    await User.findOne({ where: { email: asistente.email } })
      .then(user => {
        if (user) {
          error.push('El correo del asistente ingresado ya se encuentra registrado')
        }
      })
  }
  if (validator.isEmpty(asistente.password, { ignore_whitespace: true })) {
    error.push('No ha ingresado la contraseña del asistente')
  } else if (!validator.isByteLength(asistente.password, { min: 8 })) {
    error.push('La contraseña del asistente debe tener mínimo 8 caracteres')
  }
  if (validator.isEmpty(asistente.numero_celular, { ignore_whitespace: true })) {
    error.push('No ha ingresado un número celular del asistente')
  } else if (!validator.isMobilePhone(asistente.numero_celular, "es-CO")) {
    error.push('El número celular del asistente no es válido')
  }
  if (validator.isEmpty(asistente.nombre_usuario, { ignore_whitespace: true })) {
    error.push('No ha ingresado el nombre del asistente')
  }
  if (error.length == 0) {
    error = null;
  }
  return error
}

async function añadirAsistente(asistente, establecimiento) {

  let salt = bcrypt.genSaltSync(10);

  let user = {
    nombre_usuario: asistente.nombre_usuario,
    email: asistente.email,
    numero_celular: asistente.numero_celular,
    password: bcrypt.hashSync(asistente.password, salt),
    rol_id_rol: 4
  }

  await User.create(user).
    then(async usuario => {
      let userEstablecimiento = {
        user_id_user: usuario.id_user,
        establecimiento_nit: establecimiento
      }
      await User_Establecimiento.create(userEstablecimiento)
    })

}

async function listarAsistentes(establecimiento) {
  User.belongsToMany(Establecimiento, { through: User_Establecimiento, foreignKey: 'user_id_user' });
  Establecimiento.belongsToMany(User, { through: User_Establecimiento, foreignKey: 'establecimiento_nit' });
  let establecimientos = await Establecimiento.findOne({
    where: { nit: establecimiento }, include: {
      model: User,
      as: 'users',
      where: {
        rol_id_rol: 4
      }
    }
  });

  if (establecimientos == null) {
    return null
  } else {
    return establecimientos.users
  }


}


module.exports = {

  async crearAsistente(req, res) {
    let admin = req.body.admin;
    let establecimiento = await traeEstablecimiento(admin);
    if (establecimiento) {
      let asistente = {
        nombre_usuario: req.body.nombre_usuario,
        email: req.body.email,
        numero_celular: req.body.numero_celular,
        password: req.body.password
      }

      let errores = await validacionDatosAsistente(asistente);

      if (errores) {
        res.json(errores)
      } else {
        await añadirAsistente(asistente, establecimiento);
        res.json({ success: 'Asistente creado!' })
      }
    } else {
      res.json({ error: 'Error administrador de establecimiento!' })
    }

  },
  async listarAsistentesActivos(req, res) {
    let admin = req.body.admin;
    let establecimiento = await traeEstablecimiento(admin);
    if (establecimiento) {
      let asistentes = await listarAsistentes(establecimiento);
      if (asistentes==null) {
        res.json({ error: 'El establecimiento no tiene asistentes!' })
      } else {
        res.json({ asistentesEstablecimiento: asistentes })
      }
    } else {
      res.json({ error: 'Error administrador de establecimiento!' })
    }
  }

}