const mongoose = require('mongoose')

const reporteSchema = new mongoose.Schema({
    fechareporte :{type:Date, required:true, default: Date.now },
    descripcion:{type:String, required:true},
    Nivelprioridad: {type:String, required:true, enum: ['Nivel 1', 'Nivel 2','Nivel 3']},
})

const Reporte = mongoose.model('Reporte', reporteSchema); 
module.exports = Reporte