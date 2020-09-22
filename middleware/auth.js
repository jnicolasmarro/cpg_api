const jwt = require('jsonwebtoken');
const { User, Afiliacion } = require('../db');
const moment = require('moment');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const header_id_user = req.headers.id_user
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        const id_user = decodedToken.id_user;
        if (parseInt(header_id_user) != NaN && parseInt(header_id_user) !== id_user) {
            throw 'Usuario ID invalido';
        } else {
            let permitido = true;
            let rol;
            
            await User.findOne({ where: { id_user: id_user } }).
                then(usuario => {
                    rol = usuario.rol_id_rol
                    if (usuario.estado_user == 0) {
                        permitido = false
                    }
                })
          /*  if (rol == 2) {
                await Afiliacion.findOne({ where: { user_id_user: id_user } }).
                    then(afiliacion => {
                        let fecha_actual = new Date();
                        let fecha_venc = new Date(afiliacion.fecha_vencimiento);
                        if (fecha_actual > fecha_venc) {
                            permitido = false;
                        }
                    })
            }*/
            if (permitido) { next() }
            else { throw 'Denegado'; }
        }
    } catch {
        res.status(401).json({
            error: new Error('Error Token!')
        });
    }
};