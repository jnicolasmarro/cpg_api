const {Experiencia_Usada,Establecimiento,Experiencia,FuentePago,Tarjeta,Sequelize,Pago,Factura,sequelize, FacturaEstadoFactura,EstadoFactura, TipoFuentePago, PagoEstadoPago, EstadoPago} = require('../db');
const {generarTransaccion,consultarTransaccion} = require('./PasarelaController')
const {obtenerIDEstablecimientoXFactura} = require('./EstablecimientoController')
const {obtenerFuentePagoXEstablecimieto,obtenerCuotas} = require('./FuentePagoController')

async function generarTotales(){
    
    let totales=await Establecimiento.findAll({

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
                    experiencia_usada_id_factura:{
                        [Sequelize.Op.eq]:null
                    }
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
    });
    return totales;
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

async function asociarExperienciasUsadasConIDFactura(id_establecimiento,id_factura){
    let experiencias = await Experiencia_Usada.findAll({
        where:{
            experiencia_usada_id_factura:{
                [Sequelize.Op.eq]:null
            }},attributes: ['id_experiencia_usada' 
        ],
        include:{
           model:Experiencia,
           attributes:[],
           include:{
               model:Establecimiento,
               attributes:[],
               where:{
                id_establecimiento
            }
           } 
        }
    })
        for (const experiencia_usada of experiencias) {
            await Experiencia_Usada.update({
                experiencia_usada_id_factura:id_factura
            },{
                where:{
                    id_experiencia_usada:experiencia_usada.id_experiencia_usada
                }
            })
        }
}

async function nuevoEstadoFactura(id_estado,id_factura){
    
        await FacturaEstadoFactura.update({
            factura_estado_factura_actual:false
        },{
            where:{
                factura_id_factura:id_factura
            }
        })
    
        let nuevoEstado = {
            factura_id_factura:id_factura,
            estado_factura_id_estado_factura:id_estado,
            factura_estado_factura_actual:true
        }
    
        await FacturaEstadoFactura.create(nuevoEstado) 
}

async function guardaFactura(total_monto,id_establecimiento){
    let factura = await Factura.create({total_monto});
    await nuevoEstadoFactura(4,factura.id_factura);
    await asociarExperienciasUsadasConIDFactura(id_establecimiento,factura.id_factura);
}

async function nuevoEstadoPago(id_estado,id_pago){
    
        await PagoEstadoPago.update({
            pago_estado_pago_actual:false
        },{
            where:{
                pago_id_pago:id_pago
            }
        })
    
        let nuevoEstado = {
            pago_id_pago:id_pago,
            estado_pago_id_estado_pago:id_estado,
            pago_estado_pago_actual:true
        }
    
        await PagoEstadoPago.create(nuevoEstado)
}

async function generarFacturas(totales){
        for (const total of totales) {
            await guardaFactura(total.total_comision,total.id_establecimiento);
        }
}


async function validaSiGeneraPagoNuevo(id_factura){

    return await Factura.findOne({
        where:{
            id_factura
        },
        include:[{
            model:FacturaEstadoFactura,
            where:{
                factura_estado_factura_actual:true
            },
            include:{
                model:EstadoFactura,
                where:{
                    id_estado_factura:{
                        [Sequelize.Op.in]:[1,3]
                    }
                }
            }
        },{
            model:Pago,
            where:{
                actual:true
            },
            include:{
                model:PagoEstadoPago,
                where:{
                    pago_estado_pago_actual:true
                },
                include:{
                    model:EstadoPago,
                    where:{
                        id_estado_pago:{
                            [Sequelize.Op.in]:[1,2]
                        }
                    }
                }
            }
        }]
    })
    .then(pago=>{
        if(pago)
        return false;
        else
        return true;
    })

}

async function generarPagoXEstablecimiento(pago_id_factura,id_tipo_fuente_pago){
    let generaNuevoPago = await validaSiGeneraPagoNuevo(pago_id_factura);
    if(generaNuevoPago){
        let id_establecimiento = await obtenerIDEstablecimientoXFactura(pago_id_factura);
        let pago_fuente_pago;
        try {
            pago_fuente_pago = await obtenerFuentePagoXEstablecimieto(id_establecimiento,id_tipo_fuente_pago)
        } catch (error) {
            pago_fuente_pago = null;
        }
        let pago = {
            pago_fuente_pago,
            pago_id_factura,
            actual:true
        }
            await Pago.create(pago)
             .then(async pago=>{
            await nuevoEstadoPago(1,pago.id_pago)
            })
            await nuevoEstadoFactura(2,pago_id_factura)
            
    }

}

async function generarPagos(){
    let facturas=await Factura.findAll({
        include:{
            model:FacturaEstadoFactura,
            where:{
                factura_estado_factura_actual:true
            },
            include:{
                model:EstadoFactura,
                where:{
                    id_estado_factura:4
                }
            }
        }
    });

    for (const factura of facturas) {
        await generarPagoXEstablecimiento(factura.id_factura,1);
    };
    

}

async function obtenerValorXPago(id_pago){
    let factura=await Factura.findOne({
        attributes:['total_monto'],
        include:{
            model:Pago,
            where:{
                id_pago
            },
            attributes:[]
        }
    })
    return factura.total_monto
}

async function obtenerFacturaXPago(id_pago){
    let factura=await Factura.findOne({
        attributes:['id_factura'],
        include:{
            model:Pago,
            where:{
                id_pago
            },
            attributes:[]
        }
    })
    return factura.id_factura
}

async function obtenerFuentePagoXPago(id_pago){
    let pago = await Pago.findOne({
        attributes:['pago_fuente_pago'],
        where:{
            id_pago
        }
    })
    return pago.pago_fuente_pago
}



async function debitarPagoIndividual(id_pago){
    
    let fuente_pago=await obtenerFuentePagoXPago(id_pago)
    let factura=await obtenerFacturaXPago(id_pago);
    let transaccion = {
        amount_in_cents: parseInt(await obtenerValorXPago(id_pago)*100),
        currency:'COP',
        customer_email:'jnicolas.marro@gmail.com',
        payment_method:{
            installments:await obtenerCuotas(fuente_pago)
        },
        reference:factura.toString(),
        payment_source_id: fuente_pago
    }

    console.log(transaccion)

    let transaccionGenerada = await generarTransaccion(transaccion)

    if(transaccionGenerada.enviada){
        await nuevoEstadoPago(2,id_pago)
        await Pago.update({
            id_transaction:transaccionGenerada.id_transaction
        },{where:{
            id_pago
        }})
    }else{
        await nuevoEstadoPago(5,id_pago);
        await PagoEstadoPago.update({
            observacion:transaccionGenerada.error.toString()
        },{
            where:{
                pago_id_pago:id_pago,
                estado_pago_id_estado_pago:5
            }
        })
    }

}

async function debitarPagos(){

    let pagos=await Pago.findAll({
        attributes:['id_pago'],
        where:{
            actual:true
        },
        include:{
            model:PagoEstadoPago,
            where:{
                pago_estado_pago_actual:true
            },
            attributes:[],
            include:{
                model:EstadoPago,
                where:{
                    nombre_estado_pago:{
                        [Sequelize.Op.eq]:['GENERADO']
                    }
                },
                attributes:[]
            }
        }
    });

    for (const pago of pagos) {
        await debitarPagoIndividual(pago.id_pago);
    }


}

async function obtenerIDEstadoPagoXNombre(nombre_estado){
    let estado_pago=await EstadoPago.findOne({
        attributes:['id_estado_pago'],
        where:{
            nombre_estado_pago:{
                [Sequelize.Op.like]:nombre_estado
            }
        }
    })

    return estado_pago.id_estado_pago
}

async function obtenerPagoActualXFactura(id_factura){
    let pago=await Pago.findOne({
        where:{
            actual:true
        },
        attributes:['id_pago'],
        include:{
            model:Factura,
            where:{
                id_factura
            },
            attributes:[]
        }
    })

    return pago.id_pago
}

async function insertarErrorEnPago(id_pago,id_factura,id_estado){
    let info_transaction = await consultarTransaccion(id_factura);
    await PagoEstadoPago.update({
        observacion:`${info_transaction.status} : ${info_transaction.statusMessage}`
    },{
        where:{
            pago_id_pago:id_pago,
            estado_pago_id_estado_pago:id_estado,
            pago_estado_pago_actual:true
        }
    })
}


module.exports={
    async realizarPagoManual(){
        

    },
    async realizarPagoJob(){
        
        console.log('antes de generar t')
        let totales  =  await generarTotales();
        console.log('despues de generar t')
        console.log('antes de generar f')
        await generarFacturas(totales);
        console.log('despues de generar f')
        console.log('antes de genera pagos')
        await generarPagos();
        console.log('antes de genera pagos') 
        console.log('antes de debitar pagos') 
        await debitarPagos();
        console.log('despues de debitar pagos') 

    },
    obtenerIDEstadoPagoXNombre,
    nuevoEstadoPago,
    obtenerPagoActualXFactura,
    nuevoEstadoFactura,
    insertarErrorEnPago
}