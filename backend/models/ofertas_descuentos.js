const mongoose = require('mongoose')

const ofertasSchema = new mongoose.Schema({
    NombreProducto:{type:String, required:true},
    Ofertadesc:{type:String, required:true},
    DescOferta:{type:String, required:true},
    Condiciones:{type:String, required:true},
    Duracion:{type:Number, required:true},
})

const Ofertas = mongoose.model('Ofertas', ofertasSchema); 
module.exports = Ofertas