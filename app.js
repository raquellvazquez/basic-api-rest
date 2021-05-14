const express =  require('express');


const morgan = require('morgan');

const config = require('config');


const usuarios = require('./routes/usuarios')
// const logger = require('./logger');

/**
 * Instancia de express
 */
const app = express();

/**
 * Midellware
 */

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.use('/api/usuarios', usuarios);

/**
 * Configuración de entornos
 */
console.log('Aplicacion' + config.get('nombre'));
console.log('Base de datos server' + config.get('dbConfig.host'))
/**
 * Midellware de 3o
 */
if(app.get('env') === 'development') { 
    app.use(morgan('tiny'));

    console.log('Morgan habilitado')
}

// app.use(logger);

/**
 * Metodos 
 */
app.get('/', (req, res) => {
    res.send('Hola Mundo desde express');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
