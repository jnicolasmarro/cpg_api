const {obtenerIDEstadoPagoXNombre,nuevoEstadoPago, obtenerPagoActualXFactura,nuevoEstadoFactura,insertarErrorEnPago} = require('./PagoController')
const crypto = require("crypto");

async function nuevoEstadoPasarela(evento){

    let id_estado_pago = await obtenerIDEstadoPagoXNombre(evento.status)
    let id_pago = await obtenerPagoActualXFactura(parseInt(evento.reference))
    await nuevoEstadoPago(id_estado_pago,id_pago)
    
    switch (evento.status) {
        case "APPROVED":
             await nuevoEstadoFactura(1,parseInt(evento.reference))
            break;
         case "VOIDED":
             await insertarErrorEnPago(id_pago,parseInt(evento.reference),4)
             break;
         case "DECLINED":
             await insertarErrorEnPago(id_pago,parseInt(evento.reference),5)
             break;
         case "ERROR":
             await insertarErrorEnPago(id_pago,parseInt(evento.reference),6)
             break;
        default:
            break;
    }
 
}

module.exports={
    async recibirEventos(request){

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
