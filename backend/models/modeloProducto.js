const mongoose = require('mongoose')

const modeloProductoSchema = new mongoose.Schema({
    nombreProducto:{type:String, required:true},
    descripcionProducto:{type:String},
    precio:{type:Number, required:true},
    creador:{type:mongoose.Schema.Types.ObjectId, ref:'modeloEmprendimiento', required:true}
})

module.exports = mongoose.model('modeloProducto',modeloProductoSchema)