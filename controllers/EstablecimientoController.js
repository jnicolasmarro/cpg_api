const { Establecimiento, User, Custormer_sq, User_Establecimiento } = require('../db');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const crypto = require('crypto');




const SquareConnect = require('square-connect');
const defaultClient = SquareConnect.ApiClient.instance;
// Set sandbox url
defaultClient.basePath = 'https://connect.squareupsandbox.com';
// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
// Set sandbox access token
oauth2.accessToken = process.env.SANDBOX_TOKEN;


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

async function añadirEstablecimiento(establecimiento, hd, admin) {
  let apiInstance = new SquareConnect.CustomersApi();

  await Establecimiento.create(Object.assign(establecimiento, hd))

  let body = {
    given_name: admin.nombre_usuario,
    company_name: establecimiento.nombre_empresa,
    email_address: establecimiento.correo_establecimiento,
    phone_number: establecimiento.celular_establecimiento,
    reference_id: establecimiento.nit
  }

  apiInstance.createCustomer(JSON.stringify(body)).
    then(async function (data) {
      let customer_sq = {
        customer_id: data.customer.id,
        establecimiento_nit: establecimiento.nit
      }
      await Custormer_sq.create(customer_sq).
        then(await añadirAdminEstablecimiento(admin, establecimiento.nit))
    }, function (error) {
      console.error(error);
    });

}

async function añadirAdminEstablecimiento(admin, nit) {
  let salt = bcrypt.genSaltSync(10);
  let user = {
    nombre_usuario: admin.nombre_usuario,
    email: admin.email,
    numero_celular: admin.numero_celular,
    password: bcrypt.hashSync(admin.password, salt),
    rol_id_rol: 3
  }
  await User.create(user).
    then(async usuario => {
      let userEstablecimiento = {
        user_id_user: usuario.id_user,
        establecimiento_nit: nit
      }
      await User_Establecimiento.create(userEstablecimiento)
  })

}

async function validaNit(nitEstablecimiento){
  let error = [];

  await Establecimiento.findOne({where:{nit:nitEstablecimiento}}).
  then(establecimiento=>{
    if(!establecimiento){
      error.push("No existe el establecimiento!")
    }
  })
  if (error.length == 0) {
    error = null;
  }
  return error
}


async function registroTarjeta(nonce,id_customer){

  let apiInstance = new SquareConnect.CustomersApi();
  let data_result=null;
  let error_result=null;

  await apiInstance.createCustomerCard(id_customer, {card_nonce:nonce}).then(function(data) {
    data_result=data;
  }, function(error) {
    error_result=error;
  });
  
  return {data_result,error_result};
}

module.exports = {
  async creaEstablecimiento(req, res) {


    let establecimiento = {
      nit: req.body.nit,
      nombre_empresa: req.body.nombre_empresa,
      establecimiento_comercial: req.body.establecimiento_comercial,
      correo_establecimiento: req.body.correo_establecimiento,
      celular_establecimiento: req.body.celular_establecimiento,
      direccion_establecimiento: req.body.direccion_establecimiento,
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
    } else {
      await añadirEstablecimiento(establecimiento, hd, admin);
      res.json({ success: 'Establecimiento y Admin agregados' })
    }

  },
  async añadirLogo(req,res){
    if(req.file==undefined){
      res.json({error:'Error al subir imagen!'})
    }else{
      let errores = await validaNit(req.body.id_imagen)
      if(errores){
        let path = req.file.path
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err)
            return
          }
        
        })
        res.json({errores})
      }else{
        await Establecimiento.update({logo_establecimiento:'/establecimiento/'+req.file.filename},
          {where:{nit:req.body.id_imagen}})
        res.json({success:'Logo de establecimiento subido con éxito!'})
      }
      
    }
  },
  async vincularTarjeta(req, res){
    let nit_establecimiento=req.body.nit_establecimiento;
    let errores=await validaNit(nit_establecimiento);
    console.log(req.body.nonce);
    if(errores){
      res.json({errores})
    }else{
      await Custormer_sq.findOne({where:{establecimiento_nit:nit_establecimiento}}).
      then(async customer_sq=>{
        if(customer_sq){
          let vinculacion= await registroTarjeta(req.body.nonce,customer_sq.customer_id)

          if(vinculacion.data_result){
            res.json(vinculacion.data_result)
            
          }else{
            if(vinculacion.error_result){
              res.json(vinculacion.error_result)
            }
          }
        }else{
          res.json({error:'No se encuentra id de establecimiento en SquareUp'})
        }
      })
    }


  },
  async realizarPago(req,res){

    const idempotency_key = crypto.randomBytes(22).toString('hex');

    let body={
      query:
      {
        filter:{
          reference_id:{
            exact:req.body.nit_establecimiento
          }
        }
      }
    }

    let apiInstance = new SquareConnect.CustomersApi();

    let card;
    let customer_id;
    await apiInstance.searchCustomers(body).then(function(data) {
      card=data.customers[0].cards[0];
      customer_id=data.customers[0].id;
    }, function(error) {
      console.error(error);
    });

  
   
  

  const payments_api = new SquareConnect.PaymentsApi();
  const request_body = {
    source_id: card.id,
    amount_money: {
      amount: 100000, // $1.00 charge
      currency: 'COP'
    },
    idempotency_key: idempotency_key,
    customer_id:customer_id
  };

  try {
    const response = await payments_api.createPayment(request_body);
    res.status(200).json({
      'title': 'Payment Successful',
      'result': response
    });
  } catch(error) {
    res.status(500).json({
      'title': 'Payment Failure',
      'result': error.response.text
    });
  }

  }
}