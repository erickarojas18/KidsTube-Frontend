import React, { useEffect, useState } from "react";
import { getVideos, createVideo, deleteVideo, updateVideo } from "../services/videoService";
import "../videos.css"; // Importamos el CSS para estilos

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [editId, setEditId] = useState(null);

    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        const data = await getVideos();
        setVideos(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editId) {
            await updateVideo(editId, { name, url });
            setEditId(null);
        } else {
            await createVideo({ name, url });
        }

        fetchVideos();
        setName("");
        setUrl("");
    };

    const handleEdit = (video) => {
        setEditId(video._id);
        setName(video.name);
        setUrl(video.url);
    };

    return (
        <div className="videos-container">
            <div className="videos-card">
                <h2 className="videos-title">🎬 Gestión de Videos</h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="videos-form">
                    <input 
                        type="text" 
                        className="videos-input" 
                        placeholder="Nombre del video" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        type="text" 
                        className="videos-input" 
                        placeholder="URL de YouTube" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        required 
                    />
                    <button type="submit" className={`videos-button ${editId ? "edit" : "add"}`}>
                        {editId ? "Actualizar Video" : "Agregar Video"}
                    </button>
                </form>

                {/* Lista de videos */}
                <ul className="videos-list">
                    {videos.map((video) => (
                        <li key={video._id} className="videos-item">
                            <div className="video-content">
                                <strong>{video.name}</strong>
                                <div className="video-frame">
                                    <iframe
                                        width="100%"
                                        height="315"
                                        src={getYouTubeEmbedUrl(video.url)}
                                        title={video.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                            <div className="videos-actions">
                                <button className="videos-button edit" onClick={() => handleEdit(video)}>
                                    ✏️ Editar
                                </button>
                                <button className="videos-button delete" onClick={() => deleteVideo(video._id).then(fetchVideos)}>
                                    🗑 Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Videos;
