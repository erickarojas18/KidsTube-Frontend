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
        <div>
            <h2>Gestión de Videos</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="URL de YouTube" value={url} onChange={(e) => setUrl(e.target.value)} required />
                <button type="submit">Agregar Video</button>
            </form>
            <ul>
                {videos.map((video) => (
                    <li key={video._id}>
                        {video.name} - {video.url} 
                        <button onClick={() => deleteVideo(video._id).then(fetchVideos)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Videos;
