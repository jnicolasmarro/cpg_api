const { Establecimiento, User, Ciudad, Historico_Establecimiento } = require('../db');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');


// Permite validar los datos del establecimiento antes de agregarlo//
async function validacionDatosEstablecimiento(establecimiento,files) {
  let error = [];
  if (validator.isEmpty(establecimiento.nit, { ignore_whitespace: true })) {
    error.push('No ha ingresado el NIT del establecimiento')
  } else if (!validator.isInt(establecimiento.nit)) {
    error.push('El NIT ingresado no es valido')
  } else {
    await Establecimiento.findOne({ where: { nit: establecimiento.nit } })
      .then(establecimiento => {
        if (establecimiento)
          error.push('Ya existe un establecimiento con el NIT ingresado')
      })
  }
  if (validator.isEmpty(establecimiento.nombre_empresa, { ignore_whitespace: true })) {
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

  if (validator.isEmpty(establecimiento.ciudad_id_ciudad, { ignore_whitespace: true })) {
    error.push('No ha ingresado la ciudad del establecimiento')
  }else{
    await Ciudad.findOne({where:{id_ciudad:establecimiento.ciudad_id_ciudad}}).
    then(ciudad=>{
      if(!ciudad){
        error.push('La ciudad ingresada no existe')
      }
    })
  }

  if (validator.isEmpty(establecimiento.cantidad_lote, { ignore_whitespace: true })) {
    error.push('No ha ingresado la cantidad del lote de experiencias!')
  } else if (!validator.isInt(establecimiento.cantidad_lote)) {
    error.push('La cantidad del lote de experiencias debe de ser un número entero!')
  } else if (parseInt(establecimiento.cantidad_lote) <= 0) {
    error.push('La cantidad del lote de experiencias debe de ser mayor a cero!')
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
function añadirEstablecimiento(establecimiento, hd, admin,files) {
  Establecimiento.create(Object.assign(establecimiento, hd)).
    then(establecimiento => {

      files.logo_establecimiento.mv(`./publico/establecimiento/${establecimiento.nit}.${files.logo_establecimiento.mimetype.split('/')[1]}`, err => {
        if (err) return res.json({error:['Error al guardar la imagen']})

        Establecimiento.update({logo_establecimiento:`/establecimiento/${establecimiento.nit}.${files.logo_establecimiento.mimetype.split('/')[1]}`},
                    {where:{nit:establecimiento.nit}})

        
    })


      añadirAdminEstablecimiento(admin, establecimiento.nit);
      let historico_cero = {
        establecimiento_nit_historico: establecimiento.nit
      }
      Historico_Establecimiento.create(historico_cero);
    })
}
// Permite añadir al administrador del establecimiento luego de las validaciones//
function añadirAdminEstablecimiento(admin, nit) {
  let salt = bcrypt.genSaltSync(10);
  let user = {
    nombre_usuario: admin.nombre_usuario,
    email: admin.email,
    numero_celular: admin.numero_celular,
    password: bcrypt.hashSync(admin.password, salt),
    establecimiento_nit_user: nit,
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


async function registroTarjeta(req, res) {

  let establecimiento;
  let token_card_epayco;
  let customer_id;

  Establecimiento.belongsTo(Ciudad, { foreignKey: 'ciudad_id_ciudad' });
  await Establecimiento.findOne({
    where: { nit: req.body.nit },
    include: {
      model: Ciudad,
      as: 'ciudad'
    }
  }).
    then(e => {
      establecimiento = e;
    })

  let credit_info = {
    "card[number]": req.body.number,
    "card[exp_year]": req.body.exp_year,
    "card[exp_month]": req.body.exp_month,
    "card[cvc]": req.body.cvc
  }

  await epayco.token.create(credit_info)
    .then(function (token) {
      token_card_epayco = token.id;
    })
    .catch(function (err) {
      console.log("err: " + err);
    });
  console.log(token_card_epayco)
  let customer_info = {
    token_card: token_card_epayco,
    name: establecimiento.nombre_empresa,
    email: establecimiento.correo_establecimiento,
    default: true,
    //Optional parameters: These parameters are important when validating the credit card transaction
    city: establecimiento.ciudad.nombre_ciudad,
    address: establecimiento.direccion_establecimiento,
    phone: establecimiento.celular_establecimiento,
    cell_phone: establecimiento.celular_establecimiento
  }

  await epayco.customers.create(customer_info)
    .then(function (customer) {
      customer_id = customer.data.customerId
    })
    .catch(function (err) {
      console.log("err: " + err);
    });


  await Custormer_ePayco.create({
    establecimiento_nit: req.body.nit,
    customer_id: customer_id,
    token_card: token_card_epayco
  }).
    then(customer_epayco => {
      if (customer_epayco) {
        res.json({ success: 'Tarjeta vinculada al establecimiento' })
      } else {
        res.json({ error: 'Falló al agregar el establecimiento con la pasarela!' })
      }
    }
    )
}

module.exports = {
  async creaEstablecimiento(req, res) {

    let files = req.files;

    let establecimiento = {
      nit: req.body.nit,
      nombre_empresa: req.body.nombre_empresa,
      establecimiento_comercial: req.body.establecimiento_comercial,
      correo_establecimiento: req.body.correo_establecimiento,
      celular_establecimiento: req.body.celular_establecimiento,
      direccion_establecimiento: req.body.direccion_establecimiento,
      cantidad_lote: req.body.cantidad_lote,
      ciudad_id_ciudad: req.body.ciudad
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
  async realizarPago(req, res) {
    let nit_establecimiento = req.body.nit;
    let errores = await validaNit(req.body.nit);

    if (errores) {
      res.json({ errores })
    } else {



      var payment_info = {
        token_card: "token_id",
        customer_id: "customer_id",
        doc_type: "NIT",
        doc_number: "1035851980",
        name: "John",
        last_name: "Doe",
        email: "example@email.com",
        bill: "OR-1234",
        description: "Test Payment",
        value: "116000",
        tax: "16000",
        tax_base: "100000",
        currency: "COP",
        dues: "12"
      }
      epayco.charge.create(payment_info)
        .then(function (charge) {
          console.log(charge);
        })
        .catch(function (err) {
          console.log("err: " + err);
        });



















      await epayco.customers.get("ewmfsybmXuoq7ySCo")
        .then(function (customer) {
          /*console.log(customer)*/
        })
        .catch(function (err) {
          console.log("err: " + err);
        });
    }
    console.log(epayco.customers)
    /*  epayco.customers.delete("ewmfsybmXuoq7ySCo")
       .then(function(customer) {
               console.log(customer);
       })
       .catch(function(err) {
               console.log('err: ' + err);
       })
      /* let token_card_p;
   
       await epayco.customers.get("ewmfsybmXuoq7ySCo")
         .then(function (customer) {
           token_card_p = customer.data.cards[0].token;
         })
         .catch(function (err) {
           console.log("err: " + err);
         });
   
       console.log(token_card_p)
       let payment_info = {
         token_card: "GX2XusxefAX3juXZr",
         customer_id: "EaA7Z5ZatzzuQ39dm",
         doc_type: "CC",
         doc_number: "1035851980",
         name: "John",
         last_name: "Doe",
         email: "example@email.com",
         bill: "OR-1234",
         description: "Test Payment",
         value: "456",
         tax: "16000",
         tax_base: "100000",
         currency: "COP",
         dues: "12",
         ip: "190.000.000.000", /*This is the client's IP, it is required */
    /* url_response: "https://ejemplo.com/respuesta.html",
     url_confirmation: "https://ejemplo.com/confirmacion",
     method_confirmation: "GET"
   }
   await epayco.charge.create(payment_info)
     .then(function (charge) {
       console.log(charge.data);
     })
     .catch(function (err) {

       console.log(err.data.errors)
     });*/

  },
  async pruebamercadopago(req, res) {

    var customer_data = { "email": "test@test.com" }

    mercadopago.customers.create(customer_data).then(function (customer) {

      var card_data = {
        "token": "9b2d63e00d66a8c721607214cedaecda",
        "customer": customer.id
      }

      mercadopago.cards.create(card_data).then(function (card) {
        console.log(card);
      });

    });



  }
}