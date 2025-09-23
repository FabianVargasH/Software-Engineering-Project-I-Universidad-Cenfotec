const mongoose = require ('mongoose');

//Definir el esquema del anuncio
const anuncioSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String, required: true
    },
    autor: {
        type: String, required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    estado:{
        type: String,
        enum: ['pendiente','aprobado'],
        default: 'pendiente'
    }
});

//Crear el modelo
const Anuncio = mongoose.model('Anuncio, anuncioSchema');
module.exports= Anuncio;