const express = require('express')
const Mapa = require('../models/Mapa')
const router = express.Router()

// GET - recuperar marcadores
//http://localhost:3000/api/mapa
router.get('/', async (req,res)=>{
    try {
        const listaMarcadoresenBD = await Mapa.find()
        res.json({
            lista_marcadores: listaMarcadoresenBD,
            mensaje:"Marcadores recuperados exitosamente"
        })
    } catch (error) {
        res.json({
            mensaje:"Ocurrió un error",
            error
        })
    }
})

// POST - crear nuevo marcador
//http://localhost:3000/api/mapa
router.post('/', async (req,res)=>{
    const nuevoMarcador = new Mapa(req.body)
    try {
        await nuevoMarcador.save()
        res.status(200).json({
            info_nuevo_marcador: nuevoMarcador,
            mensaje:"Marcador creado exitosamente",
            resultado:"true"
        })
    } catch (error) {
        res.status(500).json({
            mensaje:"No se pudo crear el marcador, ocurrió un error",
            error,
            resultado:"false"
        })
    }
})

// PUT - actualizar marcador
//http://localhost:3000/api/mapa
router.put('/', async (req,res)=>{
    const id_busqueda = req.query.id
    try {
        const MarcadorActualizado = await Mapa.findByIdAndUpdate(id_busqueda, req.body, {new:true})
        if(!MarcadorActualizado){
            return res.json({ mensaje:"Marcador no encontrado" })
        }
        res.json({
            info_marcador_actualizado: MarcadorActualizado,
            mensaje:"Marcador actualizado",
            resultado:"true"
        })
    } catch (error) {
        res.json({
            mensaje:"Error al actualizar",
            error
        })
    }
})

// DELETE - eliminar marcador
//http://localhost:3000/api/mapa
router.delete('/', async (req,res)=>{
    try {
        const marcadorEliminado = await Mapa.findByIdAndDelete(req.query.id)
        if(!marcadorEliminado){
            return res.json({ mensaje:"El marcador no existe en la base de datos" })
        }
        res.json({
            info_marcador_eliminado: marcadorEliminado,
            mensaje:"El marcador fue eliminado exitosamente"
        })
    } catch (error) {
        res.json({
            mensaje:"No se pudo eliminar el marcador, ocurrió un error",
            error
        })
    }
})

module.exports = router
