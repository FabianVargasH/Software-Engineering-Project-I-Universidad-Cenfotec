                                 /*Esto es anuncio de prueba*/
                                 
const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('Ruta /api/anuncios funcionando correctamente');
});

module.exports = router;
