"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var fileUpload = require('express-fileupload');

require('dotenv').config(); // Routers de la app//


var usersRouter = require('./routes/users');

var establecimientosRouter = require('./routes/establecimientos');

var adminEstablecimientoRouter = require('./routes/adminEstablecimiento');

var ExperienciaRouter = require('./routes/experiencias');

var ItemRouter = require('./routes/items');

var AfiliacionRouter = require('./routes/afiliaciones');

var authRouter = require('./routes/AuthRoutes/auth');

var ContactoRouter = require('./routes/datosContacto');

var NoticiaRouter = require('./routes/noticias'); //Middleware de autenticación//


var authMiddleware = require('./middleware/auth');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(fileUpload());
app.set('views', './views');
app.set('view engine', 'pug');
app.use('/api/', express["static"]('publico'));
app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, usersRouter);
app.use('/api/establecimiento', authMiddleware, establecimientosRouter);
app.use('/api/adminEstablecimiento', authMiddleware, adminEstablecimientoRouter);
app.use('/api/experiencia', authMiddleware, ExperienciaRouter);
app.use('/api/itemExp', authMiddleware, ItemRouter);
app.use('/api/afiliacion', authMiddleware, AfiliacionRouter);
app.use('/api/contacto', authMiddleware, ContactoRouter);
app.use('/api/noticia', authMiddleware, NoticiaRouter);
app.listen(process.env.PORT, function () {
  console.log('Servidor arrancado!');
});