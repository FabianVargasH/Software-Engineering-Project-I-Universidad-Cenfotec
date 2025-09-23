// Cargar variables de entorno
require('dotenv').config();
// Importaciones
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // para interpretar JSON 

// Importación de rutas
const eventosRoutes = require('./routes/eventos');
const anunciosRoutes = require('./routes/anuncios');
const registroRoutes = require('./routes/registro_routes');
const loginRoutes = require('./routes/login_routes');
const administracionRoutes = require('./routes/administracion_routes');


// Uso de las rutas 
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/eventos', eventosRoutes);  
app.use('/api/registro', registroRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/administracion', administracionRoutes);

// Puerto
const port = process.env.PORT || 3000;

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar con MongoDB:', err));

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`); 
});
