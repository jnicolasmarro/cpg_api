
const {TipoFuentePago, FuentePago, Tarjeta, Establecimiento} = require('../db');

async function obtenerIDTipoFuentePago(tipo_fuente_pago){

    return await TipoFuentePago.findOne({
        attributes:['id_tipo_fuente_pago'],
        where:{
            nombre_tipo_fuente_pago:tipo_fuente_pago
        }
    })
    .then(tipo=>{
        if(!tipo){
            throw `El tipo de fuente de pago ${tipo_fuente_pago} no se encuentra parametrizado`
        }else{
            return tipo.id_tipo_fuente_pago
        }
    })
}

async function obtenerFuentePagoXEstablecimieto(id_establecimiento,id_tipo_fuente_pago){

    if(id_tipo_fuente_pago==1){
         return  await FuentePago.findOne({
            attributes:['id_fuente_pago'],
            include:[{
                model:Tarjeta,
                where:{
                    estado_tarjeta:true
                },
                attributes:[],
                include:{
                    model:Establecimiento,
                    where:{
                        id_establecimiento
                    },
                    attributes:[]
                }
            },{
                model:TipoFuentePago,
                attributes:[],
                where:{
                    id_tipo_fuente_pago
                }
            }]
        })
        .then(fuente_pago=>{
            return fuente_pago.id_fuente_pago
        })
    }else if(id_tipo_fuente_pago==2){
        return await FuentePago.findOne({
            attributes:['id_fuente_pago'],
            include:{
                model:TipoFuentePago,
                attributes:[],
                where:{
                    id_tipo_fuente_pago
                }
            }
        })
        .then(fuente_pago=>{
            return fuente_pago.id_fuente_pago
        })
    }
    

}
async function obtenerCuotas(id_fuente_pago){
    let fuente_pago=await FuentePago.findOne({
        attributes:['cuotas_pago'],
        where:{
            id_fuente_pago
        }
    })

    return fuente_pago.cuotas_pago
}

module.exports={
    async obtenerIDTipoFuentePago(tipo_fuente_pago){
        return await obtenerIDTipoFuentePago(tipo_fuente_pago)
    },
    obtenerFuentePagoXEstablecimieto,
    obtenerCuotas
}
