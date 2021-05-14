const express = require('express');
const Joi = require('@hapi/joi');

const route = express.Router();

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

route.get('/', (req, res) => {
    res.send(usuarios);
})

route.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }
    res.send(usuario)
})

route.post('/', (req, res) => {

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

route.put('/:id', (req, res) => {
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


route.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }

    let index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1)

    res.send('Usuario eliminado');
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

module.exports= route;
