const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users')
const establecimientosRouter = require('./routes/establecimientos')
const authRouter = require('./routes/AuthRoutes/singup')
const app = express();
require('dotenv').config();


let isLogin = () => false;

let auth = (req,res,next) => {
    if (isLogin()) {
        next()
    } else {
        res.json('Fail Auth')
    }
}




app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/user', usersRouter)

app.use('/api/establecimiento',auth, establecimientosRouter)

app.use('/api/auth',authRouter)

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado!');
});

