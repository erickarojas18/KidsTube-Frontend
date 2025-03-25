const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// Obtener todas las playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find()
            .populate({
                path: 'videos',
                select: 'name url',
                model: 'Video'
            })
            .populate({
                path: 'profiles',
                select: 'name email avatar',
                model: 'RestrictedUser'
            });
        
        res.json(playlists);
    } catch (error) {
        console.error('Error al obtener playlists:', error);
        res.status(500).json({ 
            message: 'Error al obtener las playlists',
            error: error.message
        });
    }
});

// Obtener playlists por usuario
router.get('/user/:userId', async (req, res) => {
    try {
        const playlists = await Playlist.find({ profiles: req.params.userId })
            .populate({
                path: 'videos',
                select: 'name url',
                model: 'Video'
            })
            .populate({
                path: 'profiles',
                select: 'name email avatar',
                model: 'RestrictedUser'
            });
        res.json(playlists);
    } catch (error) {
        console.error('Error al obtener playlists del usuario:', error);
        res.status(500).json({ message: 'Error al obtener las playlists del usuario' });
    }
});

// Crear una nueva playlist
router.post('/', async (req, res) => {
    try {
        const playlist = new Playlist(req.body);
        await playlist.save();
        
        // Obtener la playlist creada con sus referencias pobladas
        const populatedPlaylist = await Playlist.findById(playlist._id)
            .populate({
                path: 'videos',
                select: 'name url',
                model: 'Video'
            })
            .populate({
                path: 'profiles',
                select: 'name email avatar',
                model: 'RestrictedUser'
            });
            
        res.status(201).json(populatedPlaylist);
    } catch (error) {
        console.error('Error al crear playlist:', error);
        res.status(500).json({ message: 'Error al crear la playlist' });
    }
});

// Eliminar una playlist
router.delete('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist no encontrada' });
        }
        res.json({ message: 'Playlist eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar playlist:', error);
        res.status(500).json({ message: 'Error al eliminar la playlist' });
    }
});

// Agregar video a una playlist
router.post('/:playlistId/videos', async (req, res) => {
    try {
        const { videoId } = req.body;
        const playlist = await Playlist.findById(req.params.playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist no encontrada' });
        }

        // Verificar si el video ya existe en la playlist
        if (playlist.videos.some(v => v._id.toString() === videoId)) {
            return res.status(400).json({ message: 'El video ya está en la playlist' });
        }

        // Agregar el video a la playlist
        playlist.videos.push(videoId);
        await playlist.save();

        // Obtener la playlist actualizada con los videos poblados
        const updatedPlaylist = await Playlist.findById(req.params.playlistId)
            .populate({
                path: 'videos',
                select: 'name url',
                model: 'Video'
            })
            .populate({
                path: 'profiles',
                select: 'name email avatar',
                model: 'RestrictedUser'
            });

        res.json(updatedPlaylist);
    } catch (error) {
        console.error('Error al agregar video a la playlist:', error);
        res.status(500).json({ message: 'Error al agregar el video a la playlist' });
    }
});

// Eliminar video de una playlist
router.delete('/:playlistId/videos/:videoId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist no encontrada' });
        }

        playlist.videos = playlist.videos.filter(v => v._id.toString() !== req.params.videoId);
        await playlist.save();

        // Obtener la playlist actualizada con los videos poblados
        const updatedPlaylist = await Playlist.findById(req.params.playlistId)
            .populate({
                path: 'videos',
                select: 'name url',
                model: 'Video'
            })
            .populate({
                path: 'profiles',
                select: 'name email avatar',
                model: 'RestrictedUser'
            });

        res.json(updatedPlaylist);
    } catch (error) {
        console.error('Error al eliminar video de la playlist:', error);
        res.status(500).json({ message: 'Error al eliminar el video de la playlist' });
    }
});

// Obtener miembros de una playlist
router.get('/:playlistId/members', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId)
            .populate({
                path: 'profiles',
                select: 'name email avatar',
                model: 'RestrictedUser'
            });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist no encontrada' });
        }

        res.json(playlist.profiles);
    } catch (error) {
        console.error('Error al obtener miembros de la playlist:', error);
        res.status(500).json({ message: 'Error al obtener los miembros de la playlist' });
    }
});

module.exports = router; 