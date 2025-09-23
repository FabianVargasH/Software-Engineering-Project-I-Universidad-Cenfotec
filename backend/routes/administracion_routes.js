const express = require('express');
const Administracion = require('../models/Administracion');
const router = express.Router();

// POST - Crear nueva ruta de transporte
//http://localhost:3000/api/administracion
router.post('/', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body); // Log para debugging
        const nuevaRuta = new Administracion(req.body);
        console.log('Modelo creado, intentando guardar'); // Log para debugging
        await nuevaRuta.save();
        console.log('Guardado exitoso:', nuevaRuta); // Log para debugging
        
        res.status(201).json({
            registro: nuevaRuta,
            msg: "Ruta de transporte creada correctamente"
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: {
                    name: error.name,
                    message: error.message,
                    detalles: Object.values(error.errors).map(e => e.message)
                },
                msg: "Error de validación al crear la ruta"
            });
        }

        if (error.code === 11000) { // Error de duplicados
            return res.status(400).json({
                error: {
                    campo: Object.keys(error.keyPattern)[0],
                    valor: error.keyValue[Object.keys(error.keyPattern)[0]],
                    msg: "Valor duplicado"
                },
                msg: "El teléfono o correo electrónico ya existen"
            });
        }

        // Error genérico - solo se ejecuta si no es ValidationError ni duplicado
        res.status(500).json({
            error: {
                name: error.name,
                message: error.message
            },
            msg: "Error interno al crear la ruta"
        });
    }
});

// GET - Obtener todas las rutas ordenadas por fecha de creación (más reciente primero)
//http://localhost:3000/api/administracion
router.get('/', async (req, res) => {
    try {
        // Ordenar por createdAt descendente (más reciente primero)
        // Si no tienes createdAt, puedes usar _id que también funciona cronológicamente
        const rutas = await Administracion.find().sort({ _id: -1 });
        
        res.status(200).json({
            total: rutas.length,
            rutas,
            rutaMasReciente: rutas.length > 0 ? rutas[0] : null,
            msg: "Listado de rutas exitoso"
        });
    } catch (error) {
        res.status(500).json({
            error: {
                name: error.name,
                message: error.message
            },
            msg: "Error al obtener las rutas"
        });
    }
});

// GET - Obtener solo la ruta más reciente
//http://localhost:3000/api/administracion/reciente
router.get('/reciente', async (req, res) => {
    try {
        const rutaMasReciente = await Administracion.findOne().sort({ _id: -1 });
        
        if (!rutaMasReciente) {
            return res.status(404).json({
                msg: "No hay rutas disponibles"
            });
        }

        res.status(200).json({
            ruta: rutaMasReciente,
            msg: "Ruta más reciente obtenida exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            error: {
                name: error.name,
                message: error.message
            },
            msg: "Error al obtener la ruta más reciente"
        });
    }
});

// GET - Obtener una ruta por ID
//http://localhost:3000/api/administracion/:id
router.get('/:id', async (req, res) => {
    try {
        const ruta = await Administracion.findById(req.params.id);
        
        if (!ruta) {
            return res.status(404).json({
                msg: "Ruta no encontrada"
            });
        }

        res.status(200).json({
            ruta,
            msg: "Ruta obtenida exitosamente"
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: "ID de ruta inválido"
            });
        }
        
        res.status(500).json({
            error: {
                name: error.name,
                message: error.message
            },
            msg: "Error al obtener la ruta"
        });
    }
});

// PUT - Actualizar ruta
//http://localhost:3000/api/administracion/:id
router.put('/:id', async (req, res) => {
    try {
        const rutaActualizada = await Administracion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!rutaActualizada) {
            return res.status(404).json({
                msg: "Ruta no encontrada"
            });
        }

        res.status(200).json({
            ruta: rutaActualizada,
            msg: "Ruta actualizada correctamente"
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: {
                    name: error.name,
                    message: error.message,
                    detalles: Object.values(error.errors).map(e => e.message)
                },
                msg: "Error de validación al actualizar"
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                error: {
                    campo: Object.keys(error.keyPattern)[0],
                    valor: error.keyValue[Object.keys(error.keyPattern)[0]],
                    msg: "Valor duplicado"
                },
                msg: "El teléfono o correo electrónico ya existen"
            });
        }

        res.status(500).json({
            error: {
                name: error.name,
                message: error.message
            },
            msg: "Error interno al actualizar"
        });
    }
});

// DELETE - Eliminar ruta
//http://localhost:3000/api/administracion/:id
router.delete('/:id', async (req, res) => {
    try {
        const rutaEliminada = await Administracion.findByIdAndDelete(req.params.id);
        
        if (!rutaEliminada) {
            return res.status(404).json({
                msg: "Ruta no encontrada"
            });
        }

        res.status(200).json({
            ruta: rutaEliminada,
            msg: "Ruta eliminada correctamente"
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: "ID de ruta inválido"
            });
        }
        
        res.status(500).json({
            error: {
                name: error.name,
                message: error.message
            },
            msg: "Error interno al eliminar"
        });
    }
});

module.exports = router;