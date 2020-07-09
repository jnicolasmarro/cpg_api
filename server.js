const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users')
const app = express();
require('dotenv').config();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
/*
const { UserModel,Membresia,User } = require('./db')*/

app.use('/api/user',usersRouter)
/*app.get('/users', (req, res) => {
    UserModel.findAll()
        .then(users => { res.json(users); })
});

app.get('/membresias', (req, res) => {
    Membresia.findAll()
        .then(membresias => { res.json(membresias); })
});

/*Funcion POST para la creación de un nuevo usuario*//*
app.post('/users/nuevo', async (req, res) => {
    res.json(await UserController.crearUsuario(req));
});


app.get('/login', async (req, res) => {
    res.json(await validacionLogin(req));
});

app.put('/users/:id', (req, res) => {
    res.send('PUT /users/:id')
});

app.delete('/users/:id', (req, res) => {
    res.send('DELETE /users/:id')
});*/

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado!');
});

async function validacionLogin(req) {
    let error=[];
    let email = req.body.email;
    if (validator.isEmpty(email, { ignore_whitespace: true })) {
        error.push("No ha ingresado un correo electrónico")
    } else {
        await UserModel.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (!user) {
                    error.push('El correo ingresado es incorrecto')
                } else {
                    if (!User.validarHash(req.body.password,user.password)) {
                        error.push('La contraseña es incorrecta') 
                    }
                }
            })
    }
    return { error };
}

/* 
Función para la validación de los datos de registro de un nuevo usuario
- Se valida que no existan datos en blanco
- Se valida que la membresía esté dentro del listado de membresías
- Se valida que la membresía no cuente con un usuario asignado
- Si la membresía es válida se retorna el id de la membresía
- Se valida que el correo ingresado no se encuentre registrado
- Se valida que la contraseña contenga mínimo 8 caracteres
*//*
async function validacionNuevoUsuario(req) {
    let error=[];
    let id_membresia;

    if (validator.isEmpty(req.body.codigo, { ignore_whitespace: true })) {
        error.push('No ha ingresado el código de la membresía')
    } else {
        await Membresia.findOne({ where: { codigo: req.body.codigo } })
            .then(membresia => {
                if (!membresia) {
                    error.push('La membresía ingresada no es válida')
                } else if(!membresia.user_id_user) {
                    id_membresia = membresia.id_membresia;
                } else {
                    error.push('La membresía se encuentra asignada a un usuario');
                }
            })
    }

    if (validator.isEmpty(req.body.email, { ignore_whitespace: true })) {
        error.push('No ha ingresado el correo')
    } else if (!validator.isEmail(req.body.email)) {
        error.push('No ha ingresado un correo válido')
    } else {
        await UserModel.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    error.push('El correo ingresado ya se encuentra registrado')
                }
            })
    }
    if (validator.isEmpty(req.body.password, { ignore_whitespace: true })) {
        error.push('No ha ingresado la contraseña')
    }else if (!validator.isByteLength(req.body.password, { min: 8 })) {
        error.push('La contraseña debe tener mínimo 8 caracteres')
    }
/*NUMEROS*//*
    if (validator.isEmpty(req.body.numero_celular, { ignore_whitespace: true })) {
        error.push('No ha ingresado un número celular')
    }
    if (validator.isEmpty(req.body.nombre_usuario, { ignore_whitespace: true })) {
        error.push('No ha ingresado el nombre')
    }
    if (error.length == 0){
        error = null;
    }
    return { error, id_membresia };
}*/