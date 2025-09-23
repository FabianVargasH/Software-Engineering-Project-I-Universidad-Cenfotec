const mongoose = require('mongoose')

const administracionSchema = new mongoose.Schema({
    ruta:{type: String, required: true},
    recorrido:{type:String, required:true},
    tarifa:{type:String, required:true},
    dia:{type:Date, required:true, default: Date.now },
    horaPrimerBus:{type:String, required:true},
    horaUltimoBus:{type:String, required:true},
    frecuencia:{type:String, required: true},
    telefono: {type:String, required:true, unique:true},
    correoElectronico:{type:String, required: true, unique:true}
})

const Administracion = mongoose.model('Administracion', administracionSchema); 
module.exports = Administracion 