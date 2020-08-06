const { Afiliacion, User, Util, Experiencia_Usada } = require('../db');
const validator = require('validator');

// Funcion que permite validar el código de una afiliación antes de ser asignada//
async function validacionAfiliacion(p_afiliacion) {
    let error = [];
    if (validator.isEmpty(p_afiliacion, { ignore_whitespace: true })) {
        error.push('No ha ingresado una afiliación!')
    } else {
        await Afiliacion.findOne({ where: { codigo_afiliacion: p_afiliacion } }).
            then(afiliacion => {
                if (!afiliacion) {
                    error.push('No existe la afiliación ingresada!')
                } else {
                    if (afiliacion.asignada == 1) {
                        error.push('La afiliación ya se encuentra asignada!')
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
    await Afiliacion.update(membresia, { where: { codigo_membresia: p_membresia } })
}

async function eliminaHistorialUso(p_id_usuario) {

    await Experiencia_Usada.destroy({ where: { user_id_user: p_id_usuario } })

}
module.exports = {
    async asignarAfiliacion(req, res) {

        let error = await validacionAfiliacion(req.body.afiliacion)
        if (error) {
            return res.json({ error })
        } else {
            Afiliacion.update({ asignada: 1 }, { where: { codigo_afiliacion: req.body.afiliacion } })
            return res.json({ success: "Afiliación asignada!" })
        }
    },

    async renovarAfiliacion(req, res) {

        let error = await validarCorreo(req.body.correo)

        if (error) {
            return res.json({ error })
        } else {
            let v_membresia;
            let v_id_user;
            await User.findOne({ where: { email: req.body.correo } }).
                then(user => {
                    if (user) {
                        v_id_user = user.id_user
                    }
                })
            await Afiliacion.findOne({ where: { user_id_user: v_id_user } }).
                then(membresia => {
                    if (membresia) {
                        v_membresia = membresia.codigo_membresia
                    }
                })
            await actualizarFecha_Vto(v_membresia)
            await eliminaHistorialUso(v_id_user)
            return res.json({ success: "Afiliación renovada!" })
        }

    }
}