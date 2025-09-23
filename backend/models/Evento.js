const mongoose = require('mongoose');

//Definir el esquema del evento comunitario
const eventoSchema = new mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },
    fecha:{
        type: String, //formato mm/dd/yyyy desde el frontend
        required: true
    },
    hora: {
        type: String, //formato HH:mm
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    descripcion:
    {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente','aprobado'],
        default: 'pendiente'
    },
    fechaRegistro:{
        type: Date,
        default: Date.now
    }
});

//Crear el modelo a partir del esquema
const Evento = mongoose.model('Evento', eventoSchema);
module.exports = Evento;