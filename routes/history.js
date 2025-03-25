const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Video = require('../models/Video');

// Obtener historial de un usuario
router.get('/user/:userId', async (req, res) => {
    try {
        console.log('Obteniendo historial para usuario:', req.params.userId);
        const history = await History.find({ userId: req.params.userId })
            .sort({ watchedAt: -1 })
            .populate('videoId')
            .limit(50);
        console.log('Historial encontrado:', history.length, 'registros');
        res.json(history);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ message: error.message });
    }
});

// Agregar video al historial
router.post('/', async (req, res) => {
    try {
        const { userId, videoId } = req.body;
        console.log('Agregando video al historial:', { userId, videoId });

        // Verificar que el video existe
        const video = await Video.findById(videoId);
        if (!video) {
            console.error('Video no encontrado:', videoId);
            return res.status(404).json({ message: 'Video no encontrado' });
        }

        const history = new History({
            userId,
            videoId
        });
        await history.save();
        console.log('Historial guardado:', history);
        res.status(201).json(history);
    } catch (error) {
        console.error('Error al agregar al historial:', error);
        res.status(400).json({ message: error.message });
    }
});

// Limpiar historial de un usuario
router.delete('/user/:userId', async (req, res) => {
    try {
        console.log('Limpiando historial para usuario:', req.params.userId);
        await History.deleteMany({ userId: req.params.userId });
        res.json({ message: 'Historial limpiado exitosamente' });
    } catch (error) {
        console.error('Error al limpiar historial:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 