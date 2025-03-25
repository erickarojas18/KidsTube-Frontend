const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// Obtener todos los videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        console.error('Error al obtener videos:', error);
        res.status(500).json({ message: 'Error al obtener los videos' });
    }
});

// Crear un nuevo video
router.post('/', async (req, res) => {
    try {
        const video = new Video(req.body);
        await video.save();
        res.status(201).json(video);
    } catch (error) {
        console.error('Error al crear video:', error);
        res.status(500).json({ message: 'Error al crear el video' });
    }
});

// Actualizar un video
router.put('/:id', async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!video) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }
        res.json(video);
    } catch (error) {
        console.error('Error al actualizar video:', error);
        res.status(500).json({ message: 'Error al actualizar el video' });
    }
});

// Eliminar un video
router.delete('/:id', async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }
        res.json({ message: 'Video eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar video:', error);
        res.status(500).json({ message: 'Error al eliminar el video' });
    }
});

module.exports = router; 