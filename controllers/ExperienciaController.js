const { Experiencia, Establecimiento,Item } = require('../db');
const validator = require('validator');


async function validacionExperiencia(experiencia) {
    let error = [];
    if (validator.isEmpty(experiencia.titulo_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado un título para la experiencia!')
    }
    if (validator.isEmpty(experiencia.descripcion_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado una descripción para la experiencia!')
    }
    if (validator.isEmpty(experiencia.precio_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado un precio PG a la experiencia!')
    } else if (!validator.isInt(experiencia.precio_experiencia)) {
        error.push('El precio PG debe de ser un número entero!')
    } else if (parseInt(experiencia.precio_experiencia) <= 0) {
        error.push('El precio PG debe de ser mayor a cero!')
    }
    if (validator.isEmpty(experiencia.precio_publico, { ignore_whitespace: true })) {
        error.push('No ha ingresado un precio de establecimiento a la experiencia!')
    } else if (!validator.isInt(experiencia.precio_publico)) {
        error.push('El precio de establecimiento debe de ser un número entero!')
    } else if (parseInt(experiencia.precio_publico) <= 0) {
        error.push('El precio de establecimiento debe de ser mayor a cero!')
    }
    if (validator.isEmpty(experiencia.comision, { ignore_whitespace: true })) {
        error.push('No ha ingresado un porcentaje de comisión a la experiencia!')
    } else if (!validator.isDecimal(experiencia.comision, { force_decimal: false, decimal_digits: '0,2' })) {
        error.push('El porcentaje de comisión puede tener máximo 2 decimales!')
    } else if (parseFloat(experiencia.comision) <= 0) {
        error.push('El porcentaje de comisión debe de ser mayor a cero!')
    }else if(parseFloat(experiencia.comision) > 100){
        error.push('El porcentaje de comisión debe de ser máximo 100!')
    }
    if (validator.isEmpty(experiencia.imagen_experiencia, { ignore_whitespace: true })) {
        error.push('No ha cargado una imagen de experiencia!')
    }
    if (validator.isEmpty(experiencia.experiencia_tipo_id_tipo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el tipo de experiencia!')
    } else if (!(parseInt(experiencia.experiencia_tipo_id_tipo) == 1 || parseInt(experiencia.experiencia_tipo_id_tipo) == 2)) {
        error.push('Error tipo de experiencia!')
    }
    if (validator.isEmpty(experiencia.establecimiento_nit, { ignore_whitespace: true })) {
        error.push('No ha ingresado el establecimiento!')
    } else if (!validator.isInt(experiencia.establecimiento_nit)) {
        error.push('El NIT de establecimiento no es válido!')
    } else {
        await Establecimiento.findOne({ where: { nit: experiencia.establecimiento_nit } })
            .then(establecimiento => {
                if (!establecimiento) {
                    error.push('El establecimiento no existe')
                }
            })
    }

    if (error.length == 0)
        error = null
    return error

}

async function validacionActivacionExperiencia(experiencia){
    let error = [];
    if (validator.isEmpty(experiencia.id_experiencia, { ignore_whitespace: true })) {
        error.push('No ha ingresado el ID de la experiencia!')
    }else{
        await Experiencia.findOne({where:{id_experiencia:experiencia.id_experiencia}}).
        then(exp=>{
            if(!exp){
                error.push('La experiencia no existe!')
            }else{
                if(exp.estado_experiencia==1){
                    error.push('La experiencia ya se encuentra activa!')
                }
            }
        })
    }
    if (error.length == 0)
        error = null
    return error
}

module.exports = {
    async crearExperiencia(req, res) {
        let experiencia = {
            titulo_experiencia: req.body.titulo,
            descripcion_experiencia: req.body.descripcion,
            precio_experiencia: req.body.precio_experiencia,
            precio_publico: req.body.precio_publico,
            comision: req.body.comision,
            imagen_experiencia: req.body.imagen_experiencia,
            experiencia_tipo_id_tipo: req.body.tipo_experiencia,
            establecimiento_nit: req.body.establecimiento_nit
        }

        let errores = await validacionExperiencia(experiencia);

        if(errores){
            res.json(errores)
        }else{
            await Experiencia.create(experiencia).
            then(exp =>{
                if(exp){
                    res.json({success:'Experiencia creada!'})
                }
            })
        }
    },
    async obtenerGastronomicas(req, res) {
        Experiencia.hasMany(Item, { foreignKey: 'experiencia_id_experiencia' });
        await Experiencia.findAll({ where: { experiencia_tipo_id_tipo: 1,estado_experiencia:1 }, include: {
            model: Item,
            as: 'items'
          } }).
        then(experienciasGastronomicas=>{
            if(experienciasGastronomicas.length>0){
                res.json(experienciasGastronomicas)
            }else{
                res.json({error:'No existen experiencias gastronómicas aún!'})
            }
        })
    },
    async obtenerEntretenimiento(req, res) {
        await Experiencia.findAll({ where: { experiencia_tipo_id_tipo: 2,estado_experiencia:1 } }).
        then(experienciasEntretenimiento=>{
            if(experienciasEntretenimiento.length>0){
                res.json(experienciasEntretenimiento)
            }else{
                res.json({error:'No existen experiencias de entretenimiento aún!'})
            }
        })
    },
    async activacionExperiencia(req,res){
        let experiencia = {
            id_experiencia:req.body.id_experiencia
        }

        let errores = await validacionActivacionExperiencia(experiencia)

        if(errores){
            res.json({errores})
        }else{
            await Experiencia.update({estado_experiencia:1},
                {where:{id_experiencia:req.body.id_experiencia}}).
                then(res.json({success:'Experiencia activada!'}))
        }
        
    }


    
}