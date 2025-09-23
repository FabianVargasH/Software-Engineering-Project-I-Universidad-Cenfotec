const mongoose = require('mongoose')

const marcadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  fecha:{type:Date, default:Date.now},
  descripcion: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
})

module.exports = mongoose.model('Mapa', marcadorSchema)
