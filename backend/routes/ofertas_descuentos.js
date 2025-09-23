const express = require('express');
const Ofertas = require('../models/ofertas_descuentos');
const router = express.Router();

// POST | Crear Oferta
// http://localhost:3000/api/ofertas
router.post('/', async (req, res) => {
    try {
        const nuevaOferta = new Ofertas(req.body);
        await nuevaOferta.save();

        res.json({
            oferta_creada: nuevaOferta,
            msg: "Oferta creada correctamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error al crear la oferta"
        });
    }
});

// GET | Listar Ofertas
// http://localhost:3000/api/ofertas
router.get('/', async (req, res) => {
    try {
        const listaOfertas = await Ofertas.find();
        res.json({
            lista: listaOfertas,
            msg: "Listado de ofertas exitoso"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error en el listado de ofertas"
        });
    }
});

// GET | Buscar oferta por ID
// http://localhost:3000/api/ofertas/:id
router.get('/:id', async (req, res) => {
    const id_oferta = req.params.id;
    try {
        const ofertaRecuperada = await Ofertas.findById(id_oferta);
        if (!ofertaRecuperada) {
            return res.json({ msg: "Oferta no encontrada" });
        }

        res.json({
            info_oferta: ofertaRecuperada,
            msg: "Oferta encontrada exitosamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error al buscar la oferta"
        });
    }
});

// PUT | Modificar información de una oferta
// http://localhost:3000/api/ofertas/:id
router.put('/:id', async (req, res) => {
    const id_oferta = req.params.id;
    try {
        const ofertaActualizada = await Ofertas.findByIdAndUpdate(
            id_oferta,
            req.body,
            { new: true, runValidators: true }
        );

        if (!ofertaActualizada) {
            return res.json({ msg: "Oferta no encontrada" });
        }

        res.json({
            oferta_actualizada: ofertaActualizada,
            msg: "Oferta actualizada correctamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Ocurrió un error al modificar la oferta"
        });
    }
});

// DELETE | Eliminar oferta
// http://localhost:3000/api/ofertas/:id
router.delete('/:id', async (req, res) => {
    const id_oferta = req.params.id;
    try {
        const ofertaEliminada = await Ofertas.findByIdAndDelete(id_oferta);
        if (!ofertaEliminada) {
            return res.json({ msg: "Oferta no encontrada" });
        }

        res.json({
            oferta_eliminada: ofertaEliminada,
            msg: "Oferta eliminada correctamente"
        });
    } catch (error) {
        res.json({
            error,
            msg: "Error al eliminar la oferta"
        });
    }
});

module.exports = router;