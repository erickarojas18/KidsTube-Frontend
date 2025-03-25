const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Video = require('../models/Video');

// Obtener historial de un usuario
router.get('/user/:userId', async (req, res) => {
    try {
        const history = await History.find({ userId: req.params.userId })
            .sort({ watchedAt: -1 })
            .populate('videoId')
            .limit(50);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Agregar video al historial
router.post('/', async (req, res) => {
    try {
        const { userId, videoId } = req.body;
        const history = new History({
            userId,
            videoId
        });
        await history.save();
        res.status(201).json(history);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Limpiar historial de un usuario
router.delete('/user/:userId', async (req, res) => {
    try {
        await History.deleteMany({ userId: req.params.userId });
        res.json({ message: 'Historial limpiado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 