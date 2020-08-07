const { User } = require('../db');

const checkRole = roles => (req, res, next) => {
    let rol;
    await User.findOne({where:{id_user:req.headers.id_user}}).
    then(usuario=>{
        rol=usuario.rol_id_rol
    })

    !roles.includes(rol)
        ? res.status(401).json("Unauthorized")
        : next();
}

module.exports={
    checkRole
}