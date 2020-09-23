const {
    Noticia
} = require('../db');
const validator = require('validator');
const moment = require('moment');
moment.locale('es-es');

const validacionNoticia = (noticia) => {
    let errores = [];
    let mimetype = null;
    if (validator.isEmpty(noticia.titulo_noticia, {
            ignore_whitespace: true
        })) {
        errores.push('No ha ingresado un título para la noticia!')
    }

    if (validator.isEmpty(noticia.contenido_noticia, {
            ignore_whitespace: true
        })) {
        errores.push('No ha ingresado un contenido para la noticia!')
    }

    if (noticia.files == null) {
        errores.push('No ha adjuntado una imagen para la noticia!')
    } else {
        let mime = noticia.files.imagen_noticia.mimetype.split('/')
        if (mime[0] != 'image') {
            errores.push('El formato de la imagen no es válido!')
        }else{
            mimetype=mime;
        }
    }

    return {errores,mimetype}
}

module.exports = {
    async crearNoticia(req, res) {
        let files = req.files;
        let titulo_noticia = req.body.titulo_noticia;
        let contenido_noticia = req.body.contenido_noticia;

        let noticia = {
            files,
            titulo_noticia,
            contenido_noticia
        }

        let validacion_Noticia = validacionNoticia(noticia)

        if(validacion_Noticia.errores.length!=0){
            return res.json({error:validacion_Noticia.errores})
        }

        return await Noticia.create({titulo_noticia,contenido_noticia})
        .then((noticia)=>{
            files.imagen_noticia.mv(`./publico/noticias/${noticia.id_noticia}.${validacion_Noticia.mimetype[1]}`, err => {
                if (err) return res.json({error:['Error al guardar la imagen']})

                Noticia.update({imagen_noticia:`/noticias/${noticia.id_noticia}.${validacion_Noticia.mimetype[1]}`},
                            {where:{id_noticia:noticia.id_noticia}})

                return res.json({success:'Noticia creada!'})
            })

            
        })
    },
    async obtenerNoticias(req,res){
          let res_noticias;
          await Noticia.findAll({raw: true,attributes: ['id_noticia','titulo_noticia','createdAt','imagen_noticia'],
             where:{estado_noticia:true},
             order: [
            ['createdAt', 'DESC']
                ]})
                .then((noticias)=>{
                    
                    noticias.forEach(noticia => {
                        
                        noticia.createdAt=moment(noticia.createdAt).format("LL");
                    });
                    
                    
                    res_noticias=noticias
                })
            return res.json({res_noticias})
    },
    async obtenerNoticia(req,res){
        let id_noticia = req.params.id_noticia;
        let res_noticia;

        await Noticia.findOne({where:{id_noticia}})
        .then((noticia)=>{
            res_noticia=noticia
        })

        return res.json({res_noticia})
    }
}