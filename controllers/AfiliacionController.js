const { Afiliacion, User, Util, Experiencia_Usada, Periodo_Afiliacion } = require('../db');
const validator = require('validator');
const moment = require('moment');


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

//Funcion que permite validar el correo ingresado de un usuario antes de que se realice la reactivación//
async function validarCorreo(p_correo) {
    let error = [];
    if (validator.isEmpty(p_correo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo!')
    } else {
        await User.findOne({ where: { email: p_correo } }).
            then(user => {
                if (!user) {
                    error.push('El correo ingresado no existe!')
                } else {
                    if (user.rol_id_rol != 2) {
                        error.push('El correo ingresado no corresponde al de un usuario final!')
                    }
                }
            })
    }
    if (error.length == 0)
        error = null
    return error
}

//Funcion que permite actualizar la fecha de vencimiento de una  afiliación//
async function actualizarFecha_Vto(p_afiliacion) {
    let dias_vencimiento;
    await Util.findOne({ where: { id_param: 1 } }).
        then(util => { dias_vencimiento = util.valor_param })
    let fecha_vencimiento = new Date();
    fecha_vencimiento.setDate(fecha_vencimiento.getDate() + parseInt(dias_vencimiento));
    fecha_vencimiento.setHours(23)
    fecha_vencimiento.setMinutes(59)
    fecha_vencimiento.setSeconds(59)

    let afiliacion = {
        fecha_vencimiento: fecha_vencimiento
    }
    Afiliacion.update(afiliacion, { where: { codigo_afiliacion: p_afiliacion } })

}
// Funcion que permite cambiar el estado de las experiencias usadas a renovadas//
function actualizaHistorialUso(p_id_usuario) {
    Experiencia_Usada.update({ renovado_experiencia_usada: 1 }, { where: { user_id_user_usada: p_id_usuario } })
}

//Funcion que permite registrar un nuevo periodo de afiliacion
async function actualizaPeriodo(p_id_usuario) {

    let afiliacion = await Afiliacion.findOne({ where: { user_id_user: p_id_usuario } })

    let periodo_actual = await Periodo_Afiliacion.findAndCountAll({ where: { afiliacion_codigo_afiliacion: afiliacion.codigo_afiliacion } })

    let nuevo_periodo = {
        afiliacion_codigo_afiliacion: afiliacion.codigo_afiliacion,
        periodo_afiliacion: periodo_actual.count + 1,
        fecha_afiliacion: new Date()
    }

    Periodo_Afiliacion.create(nuevo_periodo)
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
            let v_afiliacion;
            let v_id_user;
            await User.findOne({ where: { email: req.body.correo } }).
                then(user => {
                    if (user) {
                        v_id_user = user.id_user
                    }
                })
            await Afiliacion.findOne({ where: { user_id_user: v_id_user } }).
                then(afiliacion => {
                    if (afiliacion) {
                        v_afiliacion = afiliacion.codigo_afiliacion
                    }
                })
            actualizarFecha_Vto(v_afiliacion)
            actualizaHistorialUso(v_id_user)
            actualizaPeriodo(v_id_user)

            return res.json({ success: "Afiliación renovada!" })
        }

    }
}