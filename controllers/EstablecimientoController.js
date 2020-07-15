const { Establecimiento,User } = require('../db');
const validator = require('validator');




var SquareConnect = require('square-connect');
var defaultClient = SquareConnect.ApiClient.instance;
// Set sandbox url
defaultClient.basePath = 'https://connect.squareupsandbox.com';
// Configure OAuth2 access token for authorization: oauth2
var oauth2 = defaultClient.authentications['oauth2'];
// Set sandbox access token
oauth2.accessToken = process.env.SANDBOX_TOKEN;
// Pass client to API
var api = new SquareConnect.LocationsApi();

async function validacionDatosEstablecimiento(establecimiento) {
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

  if (error.length == 0)
    error = null
  return error
}

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

module.exports = {
  async creaEstablecimiento(req, res) {


    let establecimiento = {
      nit: req.body.nit,
      nombre_empresa: req.body.nombre_empresa,
      establecimiento_comercial: req.body.establecimiento_comercial,
      correo_establecimiento: req.body.correo_establecimiento,
      celular_establecimiento: req.body.celular_establecimiento,
      direccion_establecimiento: req.body.direccion_establecimiento
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

    let errorEstablecimiento = await validacionDatosEstablecimiento(establecimiento);
    let errorAdmin = await validacionDatosAdministrador(admin);
    let errorHD = await validacionHD(hd);

    let errores = [];

    if (errorEstablecimiento != null)
      errores = errores.concat(errorEstablecimiento);
    if (errorAdmin != null)
      errores = errores.concat(errorAdmin);
    if (errorHD != null)
      errores = errores.concat(errorHD);
    
    if (errores.length == 0) {
      errores = null
    }

    if (errores) {
      res.json(errores)
    }


    var apiInstance = new SquareConnect.CustomersApi();

    /*var body = new SquareConnect.CreateCustomerRequest(); // CreateCustomerRequest | An object containing the fields to POST for the request.  See the corresponding object definition for field details.
    *//*
    apiInstance.createCustomer(req.body).then(function(data) {
      console.log('API called successfully. Returned data: ' + data);
    }, function(error) {
      console.error(error);
    });
        */
  },
  async vincularTarjeta(req, res) {
    let tok;

    await stripe.tokens.create(
      {
        card: {
          number: 5406910101410537,
          exp_month: 10,
          exp_year: 2024,
          cvc: 361,
        },
      },
      async function (err, token) {



        stripe.customers.createSource(
          'cus_HclfLlGlyAV3p4',
          { source: token.id },
          function (err, card) {
            res.json(err)
          }
        )

      }
    );


    /*await stripe.customers.createSource(
        'cus_HclfLlGlyAV3p4',
        {source: tok},
        function(err, card) {
          res.json(err)
        }
      )*/
  }
}