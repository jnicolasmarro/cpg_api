const validator = require('validator');
const { User,Membresia } = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = async (req, res) => {

    await User.findOne({ where: { email: req.body.email } }).
        then(async user => {
            if (!user) {
                return res.json({ error: 'Usuario no existe' })
            } else {
                let validacionPassword = await bcrypt.compare(req.body.password, user.password);

                if (validacionPassword) {

                    if(user.rol_id_rol==2 ){
                        let membresia_vencida=false;
                        await Membresia.findOne({where:{user_id_user:user.id_user}}).
                        then(membresia=>{
                           
                            let fecha_actual= new Date(moment().utc(0).format('YYYY-MM-DD'));
                            let fecha_venc= new Date(membresia.fecha_vencimiento);          
                            if(fecha_actual>fecha_venc){
                                membresia_vencida=true;
                            }
                        })
                        if(membresia_vencida){
                            return res.json({error:"Membresía vencida"})
                        }
                        
                    }

                    const token = jwt.sign(
                        { userId: user.id_user },
                        process.env.JWT_TOKEN);
                    return res.status(200).json({
                        userId: user.id_user,
                        rol:user.rol_id_rol,
                        token: token
                    });
                } else {
                    return res.json({ error: 'Contraseña incorrecta' })
                }

            }
        });





}