const { Afiliacion, User, Util, Experiencia_Usada, Periodo_Afiliacion } = require('../db');
const validator = require('validator');
const moment = require('moment');


// Funcion que permite validar el código de una afiliación antes de ser asignada//
async function validacionAfiliacion(p_afiliacion) {
    let error = [];

    //Se valida que se haya ingresado un código
    if (validator.isEmpty(p_afiliacion, { ignore_whitespace: true })) {
        error.push('No ha ingresado una afiliación!')
    } else {

        //Se valida si existe el código en la tabla de afiliaciones
        await Afiliacion.findOne({ where: { codigo_afiliacion: p_afiliacion } }).
            then(afiliacion => {
                if (!afiliacion) {
                    error.push('No existe la afiliación ingresada!')
                } else {

                    // Se valida si la afiliación ya se encuentra asignada a alguien
                    if (afiliacion.codigo_asignado == 1) {
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

    // Se valida que el correo se haya indicado
    if (validator.isEmpty(p_correo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo!')
    } else {

        // Se valida si el correo ingresado existe para algun usuario
        await User.findOne({ where: { email: p_correo } }).
            then(user => {
                if (!user) {
                    // Sino existe se genera el error
                    error.push('El correo ingresado no existe!')
                } else {
                    if (user.rol_id_rol != 2) {
                        // Si el correo del usuario no corresponde al de un usuario final se genera error
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
    Experiencia_Usada.update({ renovado_experiencia_usada: 1 }, { where: { id_user_experiencia_usada: p_id_usuario } })
}

//Funcion que permite registrar un nuevo periodo de afiliacion
async function actualizaPeriodo(p_id_usuario) {

    let afiliacion = await Afiliacion.findOne({ where: { id_user_afiliacion: p_id_usuario } })

    let periodo_actual = await Periodo_Afiliacion.findAndCountAll({ where: { afiliacion_codigo_afiliacion: afiliacion.codigo_afiliacion } })

    let nuevo_periodo = {
        afiliacion_codigo_afiliacion: afiliacion.codigo_afiliacion,
        periodo_afiliacion: periodo_actual.count + 1,
        fecha_afiliacion: new Date()
    }

    Periodo_Afiliacion.create(nuevo_periodo)
}

module.exports = {

    // Funcion que permite marcar una afiliación como asignada
    async asignarAfiliacion(req, res) {
        // Se valida el código de afiliación ingresado
        let errores = await validacionAfiliacion(req.body.afiliacion)

        // Si existen errores se retornan
        if (errores) {
            return res.json({ errores })
        } else {

            // Si no existen errores se marca la afiliación como asignada
            Afiliacion.update({ codigo_asignado: 1 }, { where: { codigo_afiliacion: req.body.afiliacion } })
            return res.json({ success: "Afiliación asignada!" })
        }
    },
    // Funcion que permite renovar una afiliación por medio del correo de un usuario final
    async renovarAfiliacion(req, res) {

        //Se valida el correo ingresado
        let errores = await validarCorreo(req.body.correo)

        if (errores) {
            // Si existen errores se envian a la interfaz web
            return res.json({ errores })
        } else {
            let v_afiliacion;
            let v_id_user;

            // Se obtiene el usuario correspondiente al correo electrónico
            await User.findOne({ where: { email: req.body.correo } }).
                then(user => {
                    if (user) {
                        // Se guarda el id del usuario
                        v_id_user = user.id_user
                    }
                })
            // Se obtiene la afiliación del usuario
            await Afiliacion.findOne({ where: { id_user_afiliacion: v_id_user } }).
                then(afiliacion => {
                    if (afiliacion) {
                        //Se guarda el código de afiliación del usuario
                        v_afiliacion = afiliacion.codigo_afiliacion
                    }
                })
            // Se actualiza la fecha de vencimiento de la afiliación del usuario
            actualizarFecha_Vto(v_afiliacion)
            // Se actualiza el historial del experiencias usadas para poder usarlas nuevamente
            actualizaHistorialUso(v_id_user)
            // Se actualiza el periodo de afiliación del usuario
            actualizaPeriodo(v_id_user)

            return res.json({ success: "Afiliación renovada!" })
        }

    },
    async generarCodigos(req,res){
        let cantidad=req.body.cantidad

        let longitud=8;
        let caracteres = "0123456789abcdefghijklmnopqrstuvwxyz";

        for (let index = 0; index < cantidad; index++) {
            let cadena = "";
            let max = caracteres.length-1;
            for (let i = 0; i<longitud; i++) {
                cadena += caracteres[ Math.floor(Math.random() * (max+1)) ];
            }

            cadena=cadena.toUpperCase();

            await Afiliacion.findOne({where:{codigo_afiliacion:cadena}})
            .then(async afiliacion=>{
                if(afiliacion){
                    index=index--;
                }else{
                    await Afiliacion.create({codigo_afiliacion:cadena});
                }
            })

        }

        return res.json({ success: `Se han generado ${cantidad} códigos nuevos.` });

    }
}