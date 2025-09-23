const express = require('express')
const crear_emprendimiento = require('../models/modeloEmprendimiento')
const router = express.Router()

//POST -- Crear nuevo negocio/emprendimiento
//http://localhost:3000/api/routes_crear_emprendimiento/crearNegocio
router.post('/crearNegocio', async(req, res)=>{
    const nuevoNegocio = new crear_emprendimiento(req.body)

    try {
        //guardar el negocio
        console.log("Received data:");
        await nuevoNegocio.save()

        res.json({
            negocio_creado:nuevoNegocio,
            mensaje:"Negocio creado exitosamente",
            resultado:"true"
        })

    } catch (error) {
        console.error("Full error:");
        res.status(500).json({
            error,
            mensaje:"No se registro el negocio",
            resultado:"false"
        })
        
    }
})



module.exports = router;