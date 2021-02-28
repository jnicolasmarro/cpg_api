
const fetch = require('node-fetch');
const { Tarjeta,Establecimiento,User, FuentePago} = require('../db');
const {obtenerIDTipoFuentePago} = require('./FuentePagoController')
const validator = require('validator');


async function validarDatosTarjeta(id_establecimiento,tarjeta,cuotas){
    let error = [];

    await Tarjeta.findOne({
        where:{
            id_establecimiento_tarjeta:id_establecimiento,
            estado_tarjeta:true
        }
    })
    .then(tarjeta=>{
        if(tarjeta){
            error.push('El establecimiento ya tiene una tarjeta activa');
        }
    })

    await Establecimiento.findOne({
        where:{
            id_establecimiento:id_establecimiento,
            estado_establecimiento:false
        }
    })
    .then(establecimiento=>{
        if(establecimiento){
            error.push('El establecimiento se encuentra inactivo')
        }
    })

    if (validator.isEmpty(tarjeta.number, { ignore_whitespace: true })) {
        error.push('No ha ingresado el número de la tarjeta')
    }else if(!validator.isInt(tarjeta.number)){
        error.push('El número de tarjeta ingresado no es válido')
    }else if (!validator.isByteLength(tarjeta.number,{ min: 16,max:16 })) {
        error.push('El número de tarjeta ingresado debe de tener 16 números')
    }

    if (validator.isEmpty(tarjeta.cvc, { ignore_whitespace: true })) {
        error.push('No ha ingresado el número cvc')
    }else if(!validator.isInt(tarjeta.cvc)){
        error.push('El número cvc ingresado no es válido')
    }else if (!validator.isByteLength(tarjeta.cvc,{ min: 3,max:3 })) {
        error.push('El número cvc ingresado debe de tener 3 números')
    }

    if (validator.isEmpty(tarjeta.exp_month, { ignore_whitespace: true })) {
        error.push('No ha ingresado el mes de vencimiento de la tarjeta')
    }else if(!validator.isInt(tarjeta.exp_month)){
        error.push('El mes de vencimiento de la tarjeta no es válido')
    }else if (!validator.isByteLength(tarjeta.exp_month,{ min: 2,max:2 })) {
        error.push('El mes de vencimiento de la tarjeta ingresado debe de tener 2 números')
    }

    if (validator.isEmpty(tarjeta.exp_year, { ignore_whitespace: true })) {
        error.push('No ha ingresado el año de vencimiento de la tarjeta')
    }else if(!validator.isInt(tarjeta.exp_year)){
        error.push('El año de vencimiento de la tarjeta no es válido')
    }else if (!validator.isByteLength(tarjeta.exp_year,{ min: 2,max:2 })) {
        error.push('El año de vencimiento de la tarjeta ingresado debe de tener 2 números')
    }

    if (validator.isEmpty(tarjeta.card_holder, { ignore_whitespace: true })) {
        error.push('No ha ingresado el nombre registrado en la tarjeta')
    }
    if (validator.isEmpty(cuotas, { ignore_whitespace: true })) {
        error.push('No ha ingresado el número de cuotas')
    }else if(!validator.isInt(cuotas)){
        error.push('El número de cuotas ingresado no es válido')
    }else if(cuotas<1){
        error.push('El número de cuotas debe ser mayor a 0')
    }

    if (error.length == 0)
        error = null
    return error

}

async function tokenizarTarjeta(tarjeta){

    let error=[];
    let tokenTarjeta;

    await fetch(`${process.env.URL_WOMPI}/tokens/cards`, {
        method: 'post',
        body: JSON.stringify(tarjeta),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LLAVE_PUBLICA}`
        },
    })
        .then(res =>res.json())
        .then(res =>{
            if(res.error){
                if(res.error.messages.number){
                    throw res.error.messages.number
                }
                if(res.error.messages.number){
                    throw res.error.messages.cvc
                }
                if(res.error.messages.number){
                    throw res.error.messages.exp_month
                }
                if(res.error.messages.number){
                    throw res.error.messages.exp_year
                }
                if(res.error.messages.number){
                    throw res.error.messages.card_holder
                }
            }else{
                tokenTarjeta = res.data
            }
        })
        .catch(function(e){
            error=e;
        });
    if (error.length == 0)
        error = null

    return {error,tokenTarjeta}

}

async function almacenarTokenTarjeta(tokenizacion,id_establecimiento,tarjeta){

    let creado;

    let newTarjeta = {
        id_tarjeta:tokenizacion.id,
        numero_tarjeta:tarjeta.number,
        cvc:tarjeta.cvc,
        exp_month:tokenizacion.exp_month,
        exp_year:tokenizacion.exp_year,
        card_holder:tokenizacion.card_holder,
        created_at:tokenizacion.created_at,
        brand:tokenizacion.brand,
        name:tokenizacion.name,
        last_four:tokenizacion.last_four,
        bin:tokenizacion.bin,
        expires_at:tokenizacion.expires_at,
        id_establecimiento_tarjeta:id_establecimiento
    }

    await Tarjeta.create(newTarjeta)
    .then(tarjeta=>{
        if(tarjeta){
            creado=true;
        }else{
            creado=false;
        }
    })

    return creado;
}

async function generarFuentePago(fuentePago){

    let error=[];
    let registroFuentePago;

    await fetch(`${process.env.URL_WOMPI}/payment_sources`, {
        method: 'post',
        body: JSON.stringify(fuentePago),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LLAVE_PRIVADA}`
        },
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.error){

            if(res.error.messages.type){
                throw res.error.messages.type
            }
            if(res.error.messages.token){
                throw res.error.messages.token
            }
            if(res.error.messages.acceptance_token){
                throw res.error.messages.acceptance_token
            }
            if(res.error.messages.customer_email){
                throw res.error.messages.customer_email
            }

        }
        if(res.data){
            registroFuentePago=res.data
        }
    })
    .catch(function(e){
        error=e;
    });
    if (error.length == 0)
        error = null
    return {error,registroFuentePago}
}

async function generarTokenAceptacion(id_establecimiento){

   let error=[];
   let aceptacion;
   let acceptance_token;

    await Establecimiento.findOne({
        where:{
            id_establecimiento:id_establecimiento,
            autorizacion_debito:false
        }
    })
    .then(establecimiento=>{
        if(establecimiento){
            error.push('El establecimiento no ha aceptado el manejo de la tarjeta')
            aceptacion=false
        }else{
            aceptacion=true
        }
    })

    if(aceptacion){

        await fetch(`${process.env.URL_WOMPI}/merchants/${process.env.LLAVE_PUBLICA}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LLAVE_PUBLICA}`
            },
        })
        .then(res =>res.json())
        .then(res=>{

            if(res.error){
                error.push(res.error.reason)
            }else{
                acceptance_token=res.data.presigned_acceptance.acceptance_token
            }

        })

        if (error.length == 0)
            error = null

        return {error,acceptance_token}
    }
}

async function almacenarFuentePago(fuentePago){

    let error=[];
    
    await FuentePago.create(fuentePago)
    .then(fuentePago=>{
        if(!fuentePago){
            error.push('La fuente de pago fue generada en la pasarela pero no pudo ser almacenada')
        }
    })

    if (error.length == 0)
            error = null
    return error
}

function concatenarError(propiedad,errores){

    let errorConcat='';
    
    errores.forEach(error => {
        
        errorConcat = `${errorConcat}${error} ` ;
    });
    
    return `${propiedad}: ${errorConcat}`
}

async function procesarTransaccion(transaccion){

    let enviada;
    let error='';
    let id_transaction;

    await fetch(`${process.env.URL_WOMPI}/transactions`, {
        method: 'post',
        body: JSON.stringify(transaccion),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LLAVE_PRIVADA}`
        },
    })
    .then(res=>res.json())
    .then(res=>{

        if(res.data){
            enviada=true;
            id_transaction=res.data.id
        }
        if(res.error){
            if(res.error.messages){
                if(res.error.messages.amount_in_cents){
                        error=`${error}${concatenarError('Monto',res.error.messages.amount_in_cents)}`
                }
                if(res.error.messages.is_amount_in_cents_valid_for_currency){
                    error=`${error}${concatenarError('Monto válido para la moneda',res.error.messages.is_amount_in_cents_valid_for_currency)}`
                }
                if(res.error.messages.currency){
                        error=`${error}${concatenarError('Moneda',res.error.messages.currency)}`
                }
                if(res.error.messages.customer_email){
                    error=`${error}${concatenarError('Correo',res.error.messages.customer_email)}`
                }
                if(res.error.messages.payment_method){
                    error=`${error}${concatenarError('Metodo de pago',res.error.messages.payment_method)}`
                }
                if(res.error.messages.reference){
                    error=`${error}${concatenarError('Factura',res.error.messages.reference)}`
                }
                if(res.error.messages.payment_source_id){
                    error=`${error}${concatenarError('Fuente de pago',res.error.messages.payment_source_id)}`
                }
            }
            enviada=false;
        }

    })

    return {enviada,error,id_transaction}
}

async function RegistrarTarjeta(id_establecimiento,tarjeta,cuotas){

    
    let validacion = await validarDatosTarjeta(id_establecimiento,tarjeta,cuotas);

    if(validacion){
        let errores = validacion
        return {errores}
    }else{
        let tokenizacion = await tokenizarTarjeta(tarjeta)

        if(tokenizacion.error){
            let errores = tokenizacion.error
            return {errores}
        }else{

            let tarjetaGuardada = await almacenarTokenTarjeta(tokenizacion.tokenTarjeta,id_establecimiento,tarjeta)
            
            if(tarjetaGuardada){

                let aceptacion = await generarTokenAceptacion (id_establecimiento);
                if(aceptacion.error){
                    let errores=aceptacion.error
                    return {errores}
                }else{
                    let email;

                    await User.findOne({
                    where:{
                        id_establecimiento_user:id_establecimiento,
                        rol_id_rol:3
                    }
                    })
                    .then(user=>{
                    email=user.email;
                    })

                    let fuentePago = {
                    type:'CARD',
                    token:tokenizacion.tokenTarjeta.id,
                    customer_email:email,
                    acceptance_token:aceptacion.acceptance_token
                    }

                    let registroFuentePago = await generarFuentePago(fuentePago);
                    
                    if(registroFuentePago.error){

                        let errores=registroFuentePago.error
                        return {errores}
                    }else{

                        let newFuentePago = {
                            id_fuente_pago:registroFuentePago.registroFuentePago.id,
                            acceptance_token:aceptacion.acceptance_token,
                            customer_email:email,
                            fuente_pago_id_tipo_fuente_pago:await obtenerIDTipoFuentePago('CARD'),
                            id_tarjeta_fuente_pago:tokenizacion.tokenTarjeta.id,
                            cuotas_pago:cuotas
                        }
                        
                        let almacenadoFuentePago = await almacenarFuentePago(newFuentePago);
                        
                        if(almacenadoFuentePago){
                            let errores = almacenadoFuentePago
                            return {errores}
                        }else{
                            return {success:'La tarjeta y fuente de pago fueron registrados exitósamente'}
                        }


                    }



                }

                
            }else{
                return {errores:'La tarjeta pasó la pasarela pero no pudo ser almacenada'}
            }
        }
    }

}


module.exports={
async RegistrarTarjeta(req, res) {

    let id_establecimiento = req.body.id_establecimiento;

    let tarjeta = {
        number: req.body.number,
        cvc: req.body.cvc,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year,
        card_holder: req.body.card_holder
    };

    let cuotas = req.body.cuotas;
    
    try {
       let resultado = await RegistrarTarjeta(id_establecimiento,tarjeta,cuotas)
       return res.json(resultado)
    } catch (error) {
        return res.json({errores:error.toString()})
    }
    

},
async generarTransaccion(transaccion){
    return await procesarTransaccion(transaccion)
},
async consultarTransaccion(id_referencia){
    let status;
    let statusMessage;
    await fetch(`${process.env.URL_WOMPI}/transactions/${id_referencia}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LLAVE_PRIVADA}`
        },
    })
    .then(res=>res.json())
    .then(res=>{
        status=res.data[0].status
        statusMessage=res.data[0].status_message
    })

    return {status,statusMessage}
},


}
