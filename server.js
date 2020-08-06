const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// Routers de la app//
const usersRouter = require('./routes/users')
const establecimientosRouter = require('./routes/establecimientos')
const adminEstablecimientoRouter = require('./routes/adminEstablecimiento')
const ExperienciaRouter = require('./routes/experiencias')
const ItemRouter = require('./routes/items')
const AfiliacionRouter = require('./routes/afiliaciones')
const authRouter = require('./routes/AuthRoutes/auth')

//Middleware de autenticación//
const authMiddleware = require('./middleware/auth')



app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static('publico'));

app.use('/api/auth', authRouter)

app.use('/api/user', usersRouter)

app.use('/api/establecimiento', establecimientosRouter)

app.use('/api/adminEstablecimiento', adminEstablecimientoRouter)

app.use('/api/experiencia', ExperienciaRouter)

app.use('/api/itemExp', ItemRouter)

app.use('/api/afiliacion', AfiliacionRouter)

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado!');
});

