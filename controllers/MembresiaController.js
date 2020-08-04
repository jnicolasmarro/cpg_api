const { Membresia } = require('../db');
const validator = require('validator');


async function validacionMembresia(p_membresia){
    let error = [];
    if (validator.isEmpty(p_membresia, { ignore_whitespace: true })) {
        error.push('No ha ingresado una membresía!')
    }else{
        await Membresia.findOne({where:{codigo_membresia:p_membresia}}).
    then(membresia=>{
        if(!membresia){
            error.push('No existe la membresía ingresada!')
        }else{
            if(membresia.asignada==1){
                error.push('La membresía ya se encuentra asignada!')
            }
        }
    })
    }

    

    if (error.length == 0)
        error = null
    return error
}

module.exports={
    async asignarMembresia(req,res){
        
        let error = await validacionMembresia(req.body.membresia)

        if(error){
            return res.json({error})
        }else{
            await Membresia.update({asignada:1},{where:{codigo_membresia:req.body.membresia}}).
            then(res.json({success:"Membresía asignada!"}))
        }
    }
}