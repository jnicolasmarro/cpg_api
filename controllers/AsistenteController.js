const { User, Establecimiento } = require('../db');
const validator = require('validator');
const bcrypt = require('bcryptjs');


//Funcion que permite traer el Nit de un establecimiento mediante su administrador//
async function traeNitEstablecimiento(admin) {
  let nit;
  await User.findOne({ where: { id_user: admin } }).
    then(usuario => {
      if (usuario) {
        nit = usuario.establecimiento_nit_user;
      }
    })
  return nit;
}
// Funcion que permite validar los datos de un asistente antes de su creacion
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
  let asistentes = await User.findAll({where: { establecimiento_nit_user: establecimiento,estado_user:1,rol_id_rol:4 }});

  if (asistentes == null) {
    return null
  } else {
    return asistentes
  }
}


module.exports = {

  // Funcion para la creación de un asistente (Primera funcion al realizar la petición sin validaciones) //
  async crearAsistente(req, res) {
    // Se obtiene el id del usuario del administrador del establecimiento
    let admin = req.headers.id_user;
    // Por medio del id se obtiene el NIT del establecimiento
    let establecimiento = await traeNitEstablecimiento(admin);
    
    if (establecimiento) {
      // Si se encuentra el NIT del establecimiento se obtienen los datos suministrados en el front
      let asistente = {
        nombre_usuario: req.body.nombre_usuario,
        email: req.body.email,
        numero_celular: req.body.numero_celular,
        password: req.body.password,
        establecimiento_nit_user: establecimiento
      }
      // Se validan los datos 
      let error = await validacionDatosAsistente(asistente);

      if (error) {
        // Si existen errores se retornan
        return res.json({ error })
      } else {
        // Si no existen errores se pasa a su creación
        await añadirAsistente(asistente);
        return res.json({ success: 'Asistente creado!' })
      }
    } else {
      // Si no se puede obtener el NIT se retorna el error
      return res.json({ error: 'Error administrador de establecimiento!' })
    }

  },

  // Funcion para listar los asistentes activos de un establecimiento (Primera funcion al realizar la petición sin validaciones) //
  async listarAsistentesActivos(req, res) {
    let admin = req.headers.id_user;
    let establecimiento = await traeNitEstablecimiento(admin);
    if (establecimiento) {
      let asistentes = await listarAsistentes(establecimiento);
      if (asistentes == null) {
        res.json({ error: 'El establecimiento no tiene asistentes!' })
      } else {
        res.json({ asistentes })
      }
    } else {
      res.json({ error: 'Error administrador de establecimiento!' })
    }
  },
  // Funcion que permite inactivar a un asistente
  async inactivarAsistente(req,res){
    let id_asistente=req.params.id_asistente
    return await User.update({estado_user:0},{where:{
      id_user:id_asistente
    }})
    .then(res.json({success:'Asistente inactivado'}))
    .catch((error)=>{
      throw error
    })
  }

}