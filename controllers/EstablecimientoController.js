const { Establecimiento, User, Ciudad, Experiencia_Usada, Experiencia, Factura,EstadoFactura } = require('../db');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');


async function obtenerIDEstablecimientoXFactura(id_factura){

  return await Establecimiento.findOne({
    attributes:['id_establecimiento'],
    include:{
      model:Experiencia,
      attributes:[],
      include:{
        model:Experiencia_Usada,
        attributes:[],
        include:{
          model:Factura,
          where:{
            id_factura
          },
          attributes:[]
        }
      }
    }

  })
  .then(establecimiento=>{
    return establecimiento.id_establecimiento
  })
    
}

// Permite validar los datos del establecimiento antes de agregarlo//
async function validacionDatosEstablecimiento(establecimiento,files) {
  let error = [];
  if (validator.isEmpty(establecimiento.nit_establecimiento, { ignore_whitespace: true })) {
    error.push('No ha ingresado el NIT del establecimiento')
  } else if (!validator.isInt(establecimiento.nit_establecimiento)) {
    error.push('El NIT ingresado no es valido')
  } else {
    await Establecimiento.findOne({ where: { nit_establecimiento: establecimiento.nit_establecimiento } })
      .then(establecimiento => {
        if (establecimiento)
          error.push('Ya existe un establecimiento con el NIT ingresado')
      })
  }
  if (validator.isEmpty(establecimiento.nombre_establecimiento, { ignore_whitespace: true })) {
    error.push('No ha ingresado el nombre del establecimiento')
  }
  if (validator.isEmpty(establecimiento.establecimiento_comercial, { ignore_whitespace: true })) {
    error.push('No ha ingresado la descripción del establecimiento')
  }

  if (validator.isEmpty(establecimiento.correo_establecimiento, { ignore_whitespace: true })) {
    error.push('No ha ingresado el correo del establecimiento')
  } else if (!validator.isEmail(establecimiento.correo_establecimiento)) {
    error.push('No ha ingresado un correo del establecimiento válido')
  } else {
    await Establecimiento.findOne({ where: { correo_establecimiento: establecimiento.correo_establecimiento } })
      .then(user => {
        if (user) {
          error.push('El correo ingresado ya se encuentra registrado')
        }
      })
  }

  if (validator.isEmpty(establecimiento.celular_establecimiento, { ignore_whitespace: true })) {
    error.push('No ha ingresado un número celular del establecimiento')
  } else if (!validator.isMobilePhone(establecimiento.celular_establecimiento, "es-CO")) {
    error.push('El número celular del establecimiento no es válido')
  }
  if (validator.isEmpty(establecimiento.direccion_establecimiento, { ignore_whitespace: true })) {
    error.push('No ha ingresado la dirección del establecimiento')
  }

  if (validator.isEmpty(establecimiento.establecimiento_id_ciudad, { ignore_whitespace: true })) {
    error.push('No ha ingresado la ciudad del establecimiento')
  }else{
    await Ciudad.findOne({where:{id_ciudad:establecimiento.establecimiento_id_ciudad}}).
    then(ciudad=>{
      if(!ciudad){
        error.push('La ciudad ingresada no existe')
      }
    })
  }

  if (!files || Object.keys(files).length === 0){
    error.push('No ha subido el logo del establecimiento!')
  }else{
    let mime = files.logo_establecimiento.mimetype.split('/')
    if (mime[0] != 'image') {
      error.push('El formato de la imagen no es válido!')
    }
  }

  if (error.length == 0)
    error = null
  return error
}
// Permite validar los datos del administrador de establecimiento antes de agregarlo//
async function validacionDatosAdministrador(admin) {
  let error = [];

  if (validator.isEmpty(admin.email, { ignore_whitespace: true })) {
    error.push('No ha ingresado el correo del administrador')
  } else if (!validator.isEmail(admin.email)) {
    error.push('No ha ingresado un correo de administrador válido')
  } else {
    await User.findOne({ where: { email: admin.email } })
      .then(user => {
        if (user) {
          error.push('El correo del administrador ingresado ya se encuentra registrado')
        }
      })
  }
  if (validator.isEmpty(admin.password, { ignore_whitespace: true })) {
    error.push('No ha ingresado la contraseña del administrador')
  } else if (!validator.isByteLength(admin.password, { min: 8 })) {
    error.push('La contraseña del administrador debe tener mínimo 8 caracteres')
  }
  if (validator.isEmpty(admin.numero_celular, { ignore_whitespace: true })) {
    error.push('No ha ingresado un número celular del administrador')
  } else if (!validator.isMobilePhone(admin.numero_celular, "es-CO")) {
    error.push('El número celular del administrador no es válido')
  }
  if (validator.isEmpty(admin.nombre_usuario, { ignore_whitespace: true })) {
    error.push('No ha ingresado el nombre del administrador')
  }
  if (error.length == 0) {
    error = null;
  }
  return error
}
// Permite validar los datos de autorización//
function validacionHD(hd) {
  let error = [];

  if (hd.autorizacion_datos == 0) {
    error.push("No se ha aceptado la autorización de manejo de datos")
  }
  if (hd.autorizacion_debito == 0) {
    error.push("No se ha aceptado la autorización de manejo de datos financieros")
  }
  if (error.length == 0) {
    error = null;
  }
  return error
}
// Permite añadir al establecimiento luego de las validaciones//
async function añadirEstablecimiento(establecimiento, hd, admin,files) {

 await Establecimiento.create(Object.assign(establecimiento, hd)).
    then((newEstablecimiento) => {

      files.logo_establecimiento.mv(`./publico/establecimiento/${newEstablecimiento.id_establecimiento}.${files.logo_establecimiento.mimetype.split('/')[1]}`, err => {
        if (err) return res.json({error:['Error al guardar la imagen']})

        Establecimiento.update({logo_establecimiento:`/establecimiento/${newEstablecimiento.id_establecimiento}.${files.logo_establecimiento.mimetype.split('/')[1]}`},
                    {where:{id_establecimiento:newEstablecimiento.id_establecimiento}})

        
    })


      añadirAdminEstablecimiento(admin, newEstablecimiento.id_establecimiento);
      
    })
}
// Permite añadir al administrador del establecimiento luego de las validaciones//
function añadirAdminEstablecimiento(admin, id_establecimiento) {
  let salt = bcrypt.genSaltSync(10);
  let user = {
    nombre_usuario: admin.nombre_usuario,
    email: admin.email,
    numero_celular: admin.numero_celular,
    password: bcrypt.hashSync(admin.password, salt),
    id_establecimiento_user: id_establecimiento,
    rol_id_rol: 3
  }
  User.create(user)
}

async function validaNit(nitEstablecimiento) {
  let error = [];

  await Establecimiento.findOne({ where: { nit: nitEstablecimiento } }).
    then(establecimiento => {
      if (!establecimiento) {
        error.push("No existe el establecimiento!")
      }
    })
  if (error.length == 0) {
    error = null;
  }
  return error
}


module.exports = {
  async creaEstablecimiento(req, res) {

    let files = req.files;

    let establecimiento = {
      nit_establecimiento: req.body.nit,
      nombre_establecimiento: req.body.nombre_empresa,
      establecimiento_comercial: req.body.establecimiento_comercial,
      correo_establecimiento: req.body.correo_establecimiento,
      celular_establecimiento: req.body.celular_establecimiento,
      direccion_establecimiento: req.body.direccion_establecimiento,
      establecimiento_id_ciudad: req.body.ciudad
    }

    let admin = {
      nombre_usuario: req.body.nombre_usuario,
      email: req.body.email,
      numero_celular: req.body.numero_celular,
      password: req.body.password
    }

    let hd = {
      autorizacion_datos: req.body.autorizacion_datos,
      autorizacion_debito: req.body.autorizacion_debito
    }

    let errorEstablecimiento = await validacionDatosEstablecimiento(establecimiento,files);
    let errorAdmin = await validacionDatosAdministrador(admin);
    let errorHD = await validacionHD(hd);

    let error = [];

    if (errorEstablecimiento != null)
      error = error.concat(errorEstablecimiento);
    if (errorAdmin != null)
      error = error.concat(errorAdmin);
    if (errorHD != null)
      error = error.concat(errorHD);

    if (error.length == 0) {
      error = null
    }

    if (error) {
      res.json({ error })
    } else {
      añadirEstablecimiento(establecimiento, hd, admin,files);
      return res.json({ success: 'Establecimiento y Administrador creados' })
    }

  },
  
  async añadirLogo(req, res) {
    if (req.file == undefined) {
      res.json({ error: 'Error al subir imagen!' })
    } else {
      let errores = await validaNit(req.body.id_imagen)
      if (errores) {
        let path = req.file.path
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err)
            return
          }

        })
        res.json({ errores })
      } else {
        await Establecimiento.update({ logo_establecimiento: '/establecimiento/' + req.file.filename },
          { where: { nit: req.body.id_imagen } })
        res.json({ success: 'Logo de establecimiento subido con éxito!' })
      }

    }
  },
  async vincularTarjeta(req, res) {
    let nit_establecimiento = req.body.nit;
    let errores = await validaNit(nit_establecimiento);

    if (errores) {
      res.json({ errores })
    } else {
      await registroTarjeta(req, res)
    }
  },
  async obtenerIDEstablecimientoXIDAdmin (id_usuario_admin){
    let id;
    await User.findOne({ where: { id_user: id_usuario_admin } }).
      then(usuario => {
        if (usuario) {
          
          id = usuario.id_establecimiento_user;
        }
      })
      
    return id;
  },
  async obtenerIDEstablecimientoXFactura(id_factura){
      return obtenerIDEstablecimientoXFactura(id_factura)
  }
}