import React, { useEffect, useState } from 'react';
import { getVideos, createVideo, deleteVideo } from '../services/videoService';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        const data = await getVideos();
        setVideos(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createVideo({ name, url });
        fetchVideos();
        setName('');
        setUrl('');
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">🎬 Gestión de Videos</h2>

            {/* Formulario para agregar video */}
            <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nombre del video" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="URL de YouTube" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    required 
                />
                <button type="submit" className="btn btn-primary">Agregar Video</button>
            </form>

            {/* Lista de videos */}
            <ul className="list-group">
                {videos.map((video) => (
                    <li key={video._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            <strong>{video.name}</strong> - {" "}
                            <a href={video.url} className="text-primary" target="_blank" rel="noopener noreferrer">
                                Ver en YouTube
                            </a>
                        </span>

                        <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => deleteVideo(video._id).then(fetchVideos)}
                        >
                            🗑 Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Videos;
