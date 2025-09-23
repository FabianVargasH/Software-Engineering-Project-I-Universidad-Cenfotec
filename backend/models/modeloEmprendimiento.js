const mongoose = require('mongoose')

const CrearEmprendimientoSchema = new mongoose.Schema({
    nombreEmprendimiento:{type:String, required:true},
    descripcionEmprendimiento:{type:String},
    productos:[{type:mongoose.Schema.Types.ObjectId, ref:'modeloProducto'}]
})

module.exports = mongoose.model('crear_emprendimiento',CrearEmprendimientoSchema)