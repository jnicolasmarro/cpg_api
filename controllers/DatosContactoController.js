const { Util } = require('../db');





module.exports={
    async obtenerLinkWhatsapp(req,res){
        let linkWhatsApp;
        return await Util.findOne({where:{id_param:3}})
        .then((dato)=>{
            linkWhatsApp=dato.valor_param
            res.json({linkWhatsApp})
        })
    }
}