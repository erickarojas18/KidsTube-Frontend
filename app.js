const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/kidstube', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Importar rutas
const playlistsRouter = require('./routes/playlists');
const videosRouter = require('./routes/videos');

// Rutas
app.use('/api/playlists', playlistsRouter);
app.use('/api/videos', videosRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 