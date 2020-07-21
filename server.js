const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users')
const establecimientosRouter = require('./routes/establecimientos')
const authRouter = require('./routes/AuthRoutes/auth')
const authMiddleware = require('./middleware/auth')
const app = express();
require('dotenv').config();


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/user',authMiddleware, usersRouter)

app.use('/api/establecimiento',authMiddleware, establecimientosRouter)

app.use('/api/auth',authRouter)

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado!');
});

