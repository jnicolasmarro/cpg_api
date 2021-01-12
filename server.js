const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fileUpload = require('express-fileupload')
const cors = require('cors');
require('dotenv').config();

// Routers de la app//
const usersRouter = require('./routes/users')
const establecimientosRouter = require('./routes/establecimientos')
const adminEstablecimientoRouter = require('./routes/adminEstablecimiento')
const ExperienciaRouter = require('./routes/experiencias')
const ItemRouter = require('./routes/items')
const AfiliacionRouter = require('./routes/afiliaciones')
const authRouter = require('./routes/AuthRoutes/auth')
const ContactoRouter = require('./routes/datosContacto')
const NoticiaRouter = require('./routes/noticias')

//Middleware de autenticación//
const authMiddleware = require('./middleware/auth')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(fileUpload())

app.set('views', './views')

app.set('view engine', 'pug')

app.use('/api/',express.static('publico'));

app.use('/api/auth', authRouter)

app.use('/api/user',authMiddleware, usersRouter)

app.use('/api/establecimiento',authMiddleware, establecimientosRouter)

app.use('/api/adminEstablecimiento',authMiddleware, adminEstablecimientoRouter)

app.use('/api/experiencia',authMiddleware, ExperienciaRouter)

app.use('/api/itemExp',authMiddleware, ItemRouter)

app.use('/api/afiliacion',authMiddleware, AfiliacionRouter)

app.use('/api/contacto',authMiddleware, ContactoRouter)

app.use('/api/noticia',authMiddleware, NoticiaRouter)

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado!');
});

