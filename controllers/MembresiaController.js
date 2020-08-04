const { Membresia, User, Util, Experiencia_Usada } = require('../db');
const validator = require('validator');
const membresia = require('../models/membresia');


async function validacionMembresia(p_membresia) {
    let error = [];
    if (validator.isEmpty(p_membresia, { ignore_whitespace: true })) {
        error.push('No ha ingresado una membresía!')
    } else {
        await Membresia.findOne({ where: { codigo_membresia: p_membresia } }).
            then(membresia => {
                if (!membresia) {
                    error.push('No existe la membresía ingresada!')
                } else {
                    if (membresia.asignada == 1) {
                        error.push('La membresía ya se encuentra asignada!')
                    }
                }
            })
    }



    if (error.length == 0)
        error = null
    return error
}

async function validarCorreo(p_correo) {
    let error = [];
    if (validator.isEmpty(p_correo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo!')
    } else {
        await User.findOne({ where: { email: p_correo } }).
            then(user => {
                if (!user) {
                    error.push('El correo ingresado no existe!')
                }
            })
    }
    if (error.length == 0)
        error = null
    return error
}

async function actualizarFecha_Vto(p_membresia) {
    let dias_vencimiento;
    await Util.findOne({ where: { id_param: 1 } }).
        then(util => { dias_vencimiento = util.valor_param })
    let fecha_vencimiento = new Date();
    
    fecha_vencimiento.setDate(fecha_vencimiento.getDate() + parseInt(dias_vencimiento));
    
    let membresia = {
        fecha_vencimiento: fecha_vencimiento
    }
    await Membresia.update(membresia, { where: { codigo_membresia: p_membresia } })
}

async function eliminaHistorialUso(p_id_usuario) {

    await Experiencia_Usada.destroy({where:{user_id_user:p_id_usuario}})

}
module.exports = {
    async asignarMembresia(req, res) {

        let error = await validacionMembresia(req.body.membresia)

        if (error) {
            return res.json({ error })
        } else {
            await Membresia.update({ asignada: 1 }, { where: { codigo_membresia: req.body.membresia } }).
                then(res.json({ success: "Membresía asignada!" }))
        }
    },
    async renovarMembresia(req, res) {

        let error= await validarCorreo(req.body.correo)

        if(error){
            return res.json({error})
        }else{
            let v_membresia;
            let v_id_user;
            await User.findOne({where:{email:req.body.correo}}).
            then(user=>{
                if(user){
                    v_id_user=user.id_user
                }
            })
            await Membresia.findOne({where:{user_id_user:v_id_user}}).
            then(membresia=>{
                if(membresia){
                    v_membresia=membresia.codigo_membresia
                }
            })
            await actualizarFecha_Vto(v_membresia)
            await eliminaHistorialUso(v_id_user)
            return res.json({success:"Afiliación renovada!"})
        }

    }
}