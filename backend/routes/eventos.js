const express = require('express');
const router = express.Router();

// Importar el modelo
const Evento = require('../models/Evento');

// GET para obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener eventos' });
  }
});

// POST para crear un evento
router.post('/', async (req, res) => {
  console.log('Body recibido:', req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ mensaje: 'No se recibió un cuerpo válido en la solicitud' });
  }

  const { titulo, fecha, hora, ubicacion, descripcion } = req.body;

  try {
    const nuevoEvento = new Evento({
      titulo,
      fecha,
      hora,
      ubicacion,
      descripcion,
      estado: 'pendiente'
    });

    await nuevoEvento.save();
    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(400).json({ mensaje: 'Error al crear el evento' });
  }
});

// DELETE para eliminar un evento por ID
router.delete('/:id', async (req, res) => {
  try {
    const eventoEliminado = await Evento.findByIdAndDelete(req.params.id);
    if (!eventoEliminado) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }
    res.json({ mensaje: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar evento' });
  }
});

// PUT para actualizar un evento por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const camposPermitidos = ['titulo', 'fecha', 'hora', 'ubicacion', 'descripcion', 'estado'];
    const data = {};
    for (const key of camposPermitidos) {
      if (key in req.body) data[key] = req.body[key];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ mensaje: "No hay campos válidos para actualizar" });
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!eventoActualizado) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    res.json(eventoActualizado);
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ mensaje: "Error al actualizar el evento" });
  }
});

module.exports = router;

