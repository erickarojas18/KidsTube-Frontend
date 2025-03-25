const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.includes('youtube.com') || v.includes('youtu.be');
            },
            message: props => `${props.value} no es una URL válida de YouTube!`
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Video', videoSchema); 