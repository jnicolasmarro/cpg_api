const path = require('path')
const multer = require('multer')

let storage = multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,'./publico/'+req.body.destino+'/')
        },
        filename: (req,file,cb) =>{
            cb(null, req.body.id_imagen+path.extname(file.originalname))
        }
    }
)

const upload = multer({storage})



module.exports={
    upload
}