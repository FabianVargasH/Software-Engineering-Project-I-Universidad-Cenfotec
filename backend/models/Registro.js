const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    tipoUsuario: {type:String, required:true, enum: ['ciudadano', 'emprendedor','administrador']},
    nombreCompleto: {type:String, required:true, trim:true },
    telefono:{type:String, required:true, trim:true},
    fechaNacimiento:{type:Date, required:true},
    correoElectronico:{type:String, required:true, trim:true, unique: true, lowercase:true},
    contrasenna: {type:String, required:true}
})

const Registro = mongoose.model('Registro', registroSchema); 
module.exports = Registro