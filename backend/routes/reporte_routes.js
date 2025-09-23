const express = require('express');
const Reporte = require('../models/reportes_sugerencias');
const router = express.Router();

// POST | Crear Reporte
// http://localhost:3000/api/reporte
router.post('/', async (req, res) => {
    try {
        const nuevoReporte = new Reporte(req.body);
        await nuevoReporte.save();
        res.json({
            reporte_creado: nuevoReporte,
            msg: "Reporte creado correctamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error al crear el reporte"
        });
    }
});

// GET | Listar todos los Reportes
// http://localhost:3000/api/reporte
router.get('/', async (req, res) => {
    try {
        const listaReportes = await Reporte.find();
        res.json({
            lista: listaReportes,
            msg: "Listado de reportes exitoso"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error en el listado de reportes"
        });
    }
});

// GET | Buscar reporte por ID
// http://localhost:3000/api/reporte/:id
router.get('/:id', async (req, res) => {
    const id_reporte = req.params.id;
    try {
        const reporteRecuperado = await Reporte.findById(id_reporte);
        if (!reporteRecuperado) {
            return res.json({
                msg: "Reporte no encontrado"
            });
        }
        res.json({
            info_reporte: reporteRecuperado,
            msg: "Reporte encontrado exitosamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error al buscar el reporte"
        });
    }
});

// PUT | Modificar reporte
// http://localhost:3000/api/reporte/:id
router.put('/:id', async (req, res) => {
    const id_reporte = req.params.id;
    try {
        const reporteActualizado = await Reporte.findByIdAndUpdate(
            id_reporte,
            req.body,
            { new: true, runValidators: true }
        );
        if (!reporteActualizado) {
            return res.json({
                msg: "Reporte no encontrado"
            });
        }
        res.json({
            reporte_actualizado: reporteActualizado,
            msg: "Reporte actualizado correctamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Ocurrió un error al actualizar el reporte"
        });
    }
});

// DELETE | Eliminar reporte
// http://localhost:3000/api/reporte/:id
router.delete('/:id', async (req, res) => {
    const id_reporte = req.params.id;
    try {
        const reporteEliminado = await Reporte.findByIdAndDelete(id_reporte);
        if (!reporteEliminado) {
            return res.json({
                msg: "Reporte no encontrado"
            });
        }
        res.json({
            reporte_eliminado: reporteEliminado,
            msg: "Reporte eliminado correctamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error al eliminar el reporte"
        });
    }
});

module.exports = router;