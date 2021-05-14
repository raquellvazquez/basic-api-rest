const express =  require('express');

const Joi = require('@hapi/joi');
const morgan = require('morgan');

const config = require('config');

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

const usuarios = [
    {
        id: 1,
        nombre: 'Raquel'
    },
    {
        id: 2,
        nombre: 'Coco'
    },
    {
        id: 3,
        nombre: 'Pelusa'
    }
]

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

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
})

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }
    res.send(usuario)
})

app.post('/api/usuarios', (req, res) => {

    const {error, value} = validarUsuario(req.body.nombre);

    if(!error) {
        const usuario = {
        id: usuarios.length + 1,
        nombre: value.nombre
        }
        usuarios.push(usuario);
        res.send(usuario)
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje); 
    }    
});

app.put('/api/usuarios/:id', (req, res) => {
    // existe el usuario
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }

    const {error, value} = validarUsuario(req.body.nombre);

    if(error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje); 
        return;
    }  

    usuario.nombre = value.nombre;
    res.send(usuario)
});

function existeUsuario(id) {
    return (usuarios.find( usuario => {
        return usuario.id === parseInt(id);
    }))
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required(),
    });

    return schema.validate({ nombre: nom});
}

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }

    let index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1)

    res.send('Usuario eliminado');
});