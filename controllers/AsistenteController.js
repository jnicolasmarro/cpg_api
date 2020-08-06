const { User, Establecimiento } = require('../db');
const validator = require('validator');
const bcrypt = require('bcryptjs');


//Funcion que permite traer el Nit de un establecimiento mediante su administrador//
async function traeNitEstablecimiento(admin) {
  let nit;
  await User.findOne({ where: { id_user: admin } }).
    then(usuario => {
      if (usuario) {
        nit = user.establecimiento_nit_user;
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

//Funcion que permite añadir un usuario con rol de asistente de un establecimiento//
async function añadirAsistente(asistente) {

  let salt = bcrypt.genSaltSync(10);

  let user = {
    nombre_usuario: asistente.nombre_usuario,
    email: asistente.email,
    numero_celular: asistente.numero_celular,
    password: bcrypt.hashSync(asistente.password, salt),
    establecimiento_nit_user: asistente.establecimiento_nit_user,
    rol_id_rol: 4
  }

  await User.create(user)
}

async function listarAsistentes(establecimiento) {
  let asistentes = await User.findAll({where: { establecimiento_nit_user: establecimiento,estado_user:1 }});

  if (asistentes == null) {
    return null
  } else {
    return asistentes
  }
}


module.exports = {

  // Funcion para la creación de un asistente (Primera funcion al realizar la petición sin validaciones) //
  async crearAsistente(req, res) {
    let admin = req.body.admin;
    let establecimiento = await traeNitEstablecimiento(admin);

    if (establecimiento) {
      let asistente = {
        nombre_usuario: req.body.nombre_usuario,
        email: req.body.email,
        numero_celular: req.body.numero_celular,
        password: req.body.password,
        establecimiento_nit_user: establecimiento
      }

      let error = await validacionDatosAsistente(asistente);

      if (error) {
        return res.json({ error })
      } else {
        await añadirAsistente(asistente);
        return res.json({ success: 'Asistente creado!' })
      }
    } else {
      return res.json({ error: 'Error administrador de establecimiento!' })
    }

  },

  // Funcion para listar los asistentes activos de un establecimiento (Primera funcion al realizar la petición sin validaciones) //
  async listarAsistentesActivos(req, res) {
    let admin = req.body.admin;
    let establecimiento = await traeNitEstablecimiento(admin);
    if (establecimiento) {
      let asistentes = await listarAsistentes(establecimiento);
      if (asistentes == null) {
        res.json({ error: 'El establecimiento no tiene asistentes!' })
      } else {
        res.json({ asistentesEstablecimiento: asistentes })
      }
    } else {
      res.json({ error: 'Error administrador de establecimiento!' })
    }
  }

}