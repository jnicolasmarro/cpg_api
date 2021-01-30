const {Experiencia_Usada,Establecimiento,Experiencia,FuentePago,Tarjeta,Sequelize,Pago,sequelize} = require('../db');
const {generarTransaccion} = require('./PasarelaController')


async function generarTotales(){

    return await Establecimiento.findAll({

        raw:true,    
        attributes: [
            'id_establecimiento',
            [Sequelize.fn('sum', Sequelize.col('valor_comision')), 'total_comision'],
          ],
        include:{
            model:Experiencia,
            attributes: [
              ],
            include:{
                model:Experiencia_Usada,
                where:{
                    cobrada_experiencia_usada:false
                },attributes: [
                  ]
            }
        },
        group: ['id_establecimiento'],
        having :{
            '$total_comision$':{
                [Sequelize.Op.ne]:null
            }
        }
    })
    .then(establecimientos=>{
        return establecimientos
    })

}

async function marcarExperienciasCobrada(id_establecimiento){

    await Experiencia_Usada.findAll({
        raw:true,
        include:{
            model:Experiencia,
            where:{
                id_establecimiento_experiencia:id_establecimiento
            }
        }
    })
    .then(async experiencias=>{
        experiencias.forEach(async experiencia => {
            await Experiencia_Usada.update({cobrada_experiencia_usada:true},{
                where:{
                    id_experiencia_usada:experiencia.id_experiencia_usada
                }
            })
        });
    })

}

async function generarPagos(totales){

    await totales.forEach(async establecimiento => {
        let id_fuentePago;
        let email;
        await FuentePago.findOne({
            include:{
                model:Tarjeta,
                where:{
                    id_establecimiento_tarjeta:establecimiento.id_establecimiento,
                    estado_tarjeta:true
                }
            }
        })
        .then(fuentePago=>{
            id_fuentePago=fuentePago.id_fuente_pago
            email=fuentePago.customer_email
        })

        
        let pago ={
            total_monto:establecimiento.total_comision,
            id_establecimiento_pago:establecimiento.id_establecimiento,
            fuente_pago_id_fuente_pago:id_fuentePago
        }

        
        await Pago.create(pago)
        .then(async pago=>{

            let transaccion={
                amount_in_cents:parseInt(establecimiento.total_comision)*100,
                currency:'COP',
                customer_email:email,
                payment_method:{
                    installments:1
                },
                reference:pago.id_pago.toString(),
                payment_source_id:id_fuentePago
            }

            let procesoTransaccion = await generarTransaccion(transaccion);
            let observacion_pago;
            let id_transaction;
            if(!procesoTransaccion.realizada){
                observacion_pago=procesoTransaccion.error
            }else{
                id_transaction=procesoTransaccion.id_transaction
                observacion_pago='PAGO REALIZADO CORRECTAMENTE'
                await marcarExperienciasCobrada(establecimiento.id_establecimiento);
            }

            let updatePago={
                pago_aceptado:procesoTransaccion.realizada,
                id_transaction:id_transaction,
                observacion_pago:observacion_pago
            }
            
            await Pago.update(updatePago,{
                where:{
                    id_pago:pago.id_pago
                }
            })



        })
        
        
    });

}


module.exports={
    async realizarPagoManual(req,res){
        let totales = await generarTotales();
        await generarPagos(totales);
        return res.json({success:'Se han realizado los cobros a los establecimientos'})
    },
    async realizarPagoJob(){
        let totales = await generarTotales();
        await generarPagos(totales);
    }
}