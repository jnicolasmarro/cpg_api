const {Experiencia_Usada,Establecimiento,Experiencia,FuentePago,Tarjeta,Sequelize,Pago,Factura,sequelize, FacturaEstadoFactura,EstadoFactura, TipoFuentePago, PagoEstadoPago, EstadoPago} = require('../db');
const {generarTransaccion,consultarTransaccion} = require('./PasarelaController')
const {obtenerIDEstablecimientoXFactura} = require('./EstablecimientoController')
const {obtenerFuentePagoXEstablecimieto} = require('./FuentePagoController')

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

async function asociarExperienciasUsadasConIDFactura(id_establecimiento,id_factura){

    await Establecimiento.findAll({

        raw:false,    
        attributes: [
          ],
        include:{
            model:Experiencia,
            attributes: ['id_experiencia'
              ],
            include:{
                model:Experiencia_Usada,
                where:{
                    experiencia_usada_id_factura:{
                        [Sequelize.Op.eq]:null
                    }
                },attributes: ['id_experiencia_usada' 
                  ]
            }
        },
        where:{
            id_establecimiento:id_establecimiento
        }
    })
    .then(establecimientos=>{
        establecimientos.forEach(establecimiento => {
            establecimiento.experiencia.forEach(experiencia => {
                experiencia.experiencia_usadas.forEach(async experiencia_usada => {
                    
                    await Experiencia_Usada.update({
                        experiencia_usada_id_factura:id_factura
                    },{
                        where:{
                            id_experiencia_usada:experiencia_usada.id_experiencia_usada
                        }
                    })
                });
            });
        });
    })

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

async function generarFacturaPorEstablecimiento(establecimiento){
    let total_comision = parseFloat(establecimiento.total_comision).toFixed(2)

    let factura = {
        total_monto:total_comision
    }

    let id_factura;
    await Factura.create(factura)
    .then(factura=>{
        id_factura=factura.id_factura
    })

    await asociarExperienciasUsadasConIDFactura(establecimiento.id_establecimiento,id_factura)
    await nuevoEstadoFactura(4,id_factura)
      
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

    await totales.forEach(async establecimiento => {
        
        try {
            await generarFacturaPorEstablecimiento(establecimiento);
        } catch (error) {
            console.log(error.toString())
        }
        
    });

}

async function validarPagos(){
    await Pago.findAll({
        raw:true,
        where:{
            pago_enviado:true,
            pago_aceptado:{
                [Sequelize.Op.ne]:null
            }
        }
    })
    .then(pagos=>{

        pagos.forEach(async pago => {
            let estado = await consultarTransaccion(pago.id_pago)
            let pagoUpdate;
            switch (estado.status) {
                case 'PENDING':
                    pagoUpdate = {
                        observacion_pago:'La transacción se encuentra pendiende'
                    }
                    break;
                case 'APPROVED':
                    pagoUpdate = {
                        observacion_pago:'La transacción fue realizada con éxito',
                        pago_aceptado:true
                    }

                    await marcarExperienciasCobrada()

                    break;
                case 'DECLINED':
                    pagoUpdate = {
                        observacion_pago:estado.statusMessage,
                        pago_aceptado:false
                    }
                    break;
                case 'ERROR':
                    pagoUpdate = {
                        observacion_pago:estado.statusMessage,
                        pago_aceptado:false
                    }
                    break;
                case 'VOIDED ':
                    pagoUpdate = {
                        observacion_pago:estado.statusMessage,
                        pago_aceptado:false
                    }
                    break;
                default:
                    pagoUpdate = {
                        observacion_pago:`No se pudo validar el pago ${pago.id_pago}`,
                        pago_aceptado:false
                    }

                    
                    break;
            }
        });
       
    })
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
        console.log(pago);
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
        let actual = true;

        try {
            pago_fuente_pago = await obtenerFuentePagoXEstablecimieto(id_establecimiento,id_tipo_fuente_pago)
        } catch (error) {
            pago_fuente_pago=null
        }

        let pago = {
            pago_fuente_pago,
            pago_id_factura,
            actual:true
        }

        await Pago.update({
            actual:false
        },{
            where:{
                pago_id_factura
            }
        })

        await Pago.create(pago)
        .then(async pago=>{
            await nuevoEstadoPago(1,pago.id_pago)
        })

        await nuevoEstadoFactura(2,pago_id_factura)

    }

    
    


    
    

    
    
    

}

async function generarPagos(){

    await Factura.findAll({
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
    })
    .then(facturas=>{
        console.log(facturas)
        facturas.forEach(async factura => {
            console.log(factura)
            await generarPagoXEstablecimiento(factura.id_factura,1);
        });
    })
    

}


module.exports={
    async realizarPagoManual(req,res){
      /*  let totales = await generarTotales();
        await generarFacturas(totales);
        return res.json({success:'Se han realizado los cobros a los establecimientos'})*/

        let totales = await generarTotales();
        await generarFacturas(totales);
        await generarPagos();
    },
    async realizarPagoJob(){
        

    },
    async validarPagoJob(){

    }
}