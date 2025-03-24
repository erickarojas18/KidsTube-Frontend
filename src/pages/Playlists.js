import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState("");

    useEffect(() => {
        fetchPlaylists();
        fetchVideos();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/playlists");
            console.log("Playlists recibidas:", data);
            setPlaylists(data || []); // Si `data` es undefined, lo convertimos en un array vacío
        } catch (error) {
            console.error("Error al obtener playlists:", error);
            setPlaylists([]); // Para evitar errores al hacer `.map()`
        }
    };

    const fetchVideos = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/videos");
            console.log("Videos recibidos:", data);
            setVideos(data || []);
        } catch (error) {
            console.error("Error al obtener videos:", error);
            setVideos([]);
        }
    };

    const fetchPlaylistDetails = async (playlistId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/playlists/${playlistId}`);
            console.log("Detalles de playlist recibidos:", data);
            setSelectedPlaylist(data || { videos: [] });
        } catch (error) {
            console.error("Error al obtener detalles de la playlist:", error);
            setSelectedPlaylist(null);
        }
    };

    const addVideoToPlaylist = async () => {
        if (!selectedVideo || !selectedPlaylist) {
            alert("Selecciona una playlist y un video");
            return;
        }

        try {
            const { data } = await axios.put(`http://localhost:5000/api/playlists/${selectedPlaylist._id}/videos`, {
                videoId: selectedVideo
            });         
            console.log("Playlist actualizada:", data);
            setSelectedPlaylist(data);
            setSelectedVideo("");
        } catch (error) {
            console.error("Error al agregar video a la playlist:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>🎵 Gestión de Playlists</h2>

            {/* Listado de Playlists */}
            <ul className="list-group">
                {playlists?.length > 0 ? (
                    playlists.map((playlist) => (
                        <li key={playlist._id} className="list-group-item d-flex justify-content-between">
                            <span>
                                <strong>{playlist.name}</strong> - 🎥 {playlist.videos?.length || 0} videos
                            </span>
                            <button className="btn btn-info btn-sm" onClick={() => fetchPlaylistDetails(playlist._id)}>
                                Ver Videos
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No hay playlists disponibles</li>
                )}
            </ul>

            {/* Detalle de la Playlist */}
            {selectedPlaylist && (
                <div className="card mt-3 p-3">
                    <h3>{selectedPlaylist.name}</h3>
                    <ul className="list-group">
                        {selectedPlaylist.videos?.length > 0 ? (
                            selectedPlaylist.videos.map((video) => (
                                <li key={video._id} className="list-group-item">
                                    🎬 <a href={video.url} target="_blank" rel="noopener noreferrer">{video.name}</a>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">No hay videos en esta playlist</li>
                        )}
                    </ul>

                    {/* Seleccionar y Agregar Video */}
                    <div className="mt-3">
                        <h5>Agregar Video Existente</h5>
                        <select
                            className="form-control"
                            value={selectedVideo}
                            onChange={(e) => setSelectedVideo(e.target.value)}
                        >
                            <option value="">Selecciona un video</option>
                            {videos.map((video) => (
                                <option key={video._id} value={video._id}>
                                    {video.name}
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-success mt-2" onClick={addVideoToPlaylist}>
                            Agregar a la Playlist
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Playlists;
