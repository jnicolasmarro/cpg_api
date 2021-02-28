const {Factura, EstadoPago, PagoEstadoPago,Sequelize} = require('../db');
const {obtenerIDEstadoPagoXNombre,nuevoEstadoPago, obtenerPagoActualXFactura,nuevoEstadoFactura,insertarErrorEnPago} = require('./PagoController')
const crypto = require("crypto");
const fs = require('fs');
const nodemailer = require("nodemailer");
var handlebars = require('handlebars');
const { obtenerIDEstablecimientoXFactura, obtenerCorreoAdminYEstablecimiento } = require('./EstablecimientoController');

async function notificarXCorreo(id_factura){

    let id_establecimiento = await obtenerIDEstablecimientoXFactura(id_factura)

    let correos = await obtenerCorreoAdminYEstablecimiento(id_establecimiento)
    let factura = await Factura.findOne({
        where:{
            id_factura
        },
        attributes:['total_monto','total_iva','total_sin_iva','porcentaje_iva']
    })

    const readHTMLFile = function (path, callback) {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            } else {
                callback(null, html);
            }
        });
    };

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_APP, 
            pass: process.env.PASSWORD_EMAIL_APP, 
        },
    });

    let htmlToSend;
    readHTMLFile('./views/factura_pago.html', async function (err, html) {
        let template = handlebars.compile(html);
        let replacements = {
            // Se genera link para enviar en la plantilla
            id_factura: id_factura,
            total_monto:factura.total_monto,
            iva:factura.porcentaje_iva,
            total_iva:factura.total_iva,
            total_sin_iva:factura.total_sin_iva
        };
        htmlToSend = template(replacements);

        // Se envia correo
        let info = await transporter.sendMail({
            from: '"CPG" <servicioalcliente@clubdeprivilegios.com>', // sender address
            to: correos, // list of receivers
            subject: "Pago de factura", // Subject line
            html: htmlToSend, // html body
        });
        
    });

}

async function requiereNuevoEstado(id_pago){
    let estado_pago = await PagoEstadoPago.findOne({
        where:{
            pago_id_pago:id_pago,
            pago_estado_pago_actual:true
        },
        include:{
            required:true,
            model:EstadoPago,
            attributes:[],
            where:{
                nombre_estado_pago:{
                    [Sequelize.Op.eq]:['APPROVED']
                }
            }
        }
    })

    if (estado_pago)
    return false
    else
    return true
}

async function nuevoEstadoPasarela(evento){

    let id_estado_pago = await obtenerIDEstadoPagoXNombre(evento.status)
    let id_pago = await obtenerPagoActualXFactura(parseInt(evento.reference))
    let requiere_estado = await requiereNuevoEstado(id_pago)
    if(requiere_estado){

        await nuevoEstadoPago(id_estado_pago,id_pago)
    
        switch (evento.status) {
            case "APPROVED":
                 await nuevoEstadoFactura(1,parseInt(evento.reference))
                // await notificarXCorreo(parseInt(evento.reference))
                break;
             case "VOIDED":
                 await insertarErrorEnPago(id_pago,parseInt(evento.reference),id_estado_pago)
                 break;
             case "DECLINED":
                 await insertarErrorEnPago(id_pago,parseInt(evento.reference),id_estado_pago)
                 break;
             case "ERROR":
                 await insertarErrorEnPago(id_pago,parseInt(evento.reference),id_estado_pago)
                 break;
            default:
                break;
        }
    }
    
 
}

module.exports={
    async recibirEventos(request){

        await notificarXCorreo(311);

        if(request.body.event){
            let mi_secreto = process.env.MI_SECRETO
        
        let evento ={
            event:request.body.event,
            id:request.body.data.transaction.id,
            amount_in_cents:request.body.data.transaction.amount_in_cents,
            reference:request.body.data.transaction.reference,
            status:request.body.data.transaction.status,
            timestamp:request.body.timestamp
        }
    
        let properties = request.body.signature.properties
        let checksum = request.body.signature.checksum
        let concatenacion='';
        properties.forEach(propertie => {
            let propiedad = propertie.split('.')
            let valor = request.body.data.transaction[propiedad[1]]
            concatenacion=`${concatenacion}${valor}`
        });
        
        concatenacion=`${concatenacion}${evento.timestamp}${mi_secreto}`
        
        let hash = crypto.createHash('sha256').update(concatenacion).digest('hex');
    
        hash=hash.toUpperCase();
        checksum=checksum.toUpperCase();
        if(hash==checksum){
            await nuevoEstadoPasarela(evento)
        }
        }
        
    }
}
