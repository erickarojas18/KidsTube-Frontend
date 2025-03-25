const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la playlist es requerido'],
        trim: true
    },
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RestrictedUser',
        required: [true, 'La playlist debe tener al menos un usuario']
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }]
}, {
    timestamps: true
});

// Middleware pre-save para validar que los perfiles y videos existan
playlistSchema.pre('save', async function(next) {
    try {
        const RestrictedUser = mongoose.model('RestrictedUser');
        const Video = mongoose.model('Video');

        // Validar perfiles
        for (const profileId of this.profiles) {
            const profile = await RestrictedUser.findById(profileId);
            if (!profile) {
                throw new Error(`El perfil con ID ${profileId} no existe`);
            }
        }

        // Validar videos si existen
        if (this.videos && this.videos.length > 0) {
            for (const videoId of this.videos) {
                const video = await Video.findById(videoId);
                if (!video) {
                    throw new Error(`El video con ID ${videoId} no existe`);
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist; 