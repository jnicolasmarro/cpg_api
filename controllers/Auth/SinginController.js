const validator = require('validator');
const { User, Afiliacion, Util } = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');


function validacionUsuarioContraseña(req, res) {
    if (validator.isEmpty(req.body.email, { ignore_whitespace: true })) {
        return res.json({ error: "No has ingresado el correo de ingreso" })
    }
    if (validator.isEmpty(req.body.password, { ignore_whitespace: true })) {
        return res.json({ error: "No has ingresado la contraseña de ingreso" })
    }
}

module.exports = async (req, res) => {

    let validacionDatos = validacionUsuarioContraseña(req, res)

    if (validacionDatos)
        return validacionDatos

    await User.findOne({ where: { email: req.body.email } }).
        then(async user => {
            if (!user) {
                return res.json({ error: 'Usuario no existe' })
            } else {

                if(user.estado_user==0){
                    return res.json({ error: 'Usuario bloqueado' })
                }else{

                    let validacionPassword = await bcrypt.compare(req.body.password, user.password);

                if (validacionPassword) {
                    if (user.rol_id_rol == 2) {
                        let afiliacion_vencida = false;
                        await Afiliacion.findOne({ where: { user_id_user: user.id_user } }).
                            then(afiliacion => {
                                let fecha_actual = new Date();
                                let fecha_venc = new Date(afiliacion.fecha_vencimiento); 
                                
                                if (fecha_actual > fecha_venc) {
                                    afiliacion_vencida = true;
                                }
                            })
                        if (afiliacion_vencida) {
                            let whatsapp = "";
                            await Util.findOne({ where: { id_param: 2 } }).
                                then(r_whatsapp => {
                                    if (r_whatsapp) {
                                        whatsapp = r_whatsapp.valor_param;
                                    }
                                })
                            return res.json({ error: "Tu afiliación se ha vencido, por favor comunícate a nuestra línea de WhatsApp: " + whatsapp + " para reactivarla" })
                        }
                    }
                    const token = jwt.sign(
                        { id_user: user.id_user },
                        process.env.JWT_TOKEN);
                    return res.status(200).json({token:
                        {header_id_user: user.id_user,
                        token: token,
                        rol: user.rol_id_rol}
                    });
                } else {
                    return res.json({ error: 'Contraseña incorrecta' })
                }

                }

                

            }
        });





}