const express = require('express')
const crear_producto = require('../models/modeloProducto')
const router = express.Router()

//POST -- Crear nuevo producto
//http://localhost:3000/api/routes_crear_producto/crearProducto
router.post('/crearProducto', async(req, res)=>{
    const nuevoProducto = new crear_producto(req.body)

    try {
        //guardar el producto
        console.log("Received data:");
        await nuevoProducto.save()

        res.json({
            producto_creado:nuevoProducto,
            mensaje:"Producto creado exitosamente",
            resultado:"true"
        })

    } catch (error) {
        console.error("Full error:");
        res.status(500).json({
            error,
            mensaje:"No se registro el producto",
            resultado:"false"
        })
        
    }
})



module.exports = router;