import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form, Tab, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const UserPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [userName, setUserName] = useState("");
    const [availableVideos, setAvailableVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [history, setHistory] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const selectedUserId = localStorage.getItem("selectedUserId");
        if (!selectedUserId) {
            navigate("/playlists");
            return;
        }

        fetchPlaylists(selectedUserId);
        fetchUserName(selectedUserId);
        fetchAvailableVideos();
        fetchHistory(selectedUserId);
    }, [navigate]);

    const fetchUserName = async (userId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/restricted-users/${userId}`);
            if (data && data.length > 0) {
                const user = data.find(u => u._id === userId);
                if (user) {
                    setUserName(user.name);
                }
            }
        } catch (error) {
            console.error("Error al obtener el nombre del usuario:", error);
        }
    };

    const fetchPlaylists = async (userId) => {
        try {
            console.log('Obteniendo playlists para el usuario:', userId);
            const { data } = await axios.get(`http://localhost:5000/api/playlists/user/${userId}`);
            console.log('Playlists obtenidas:', data);
            setPlaylists(data || []);
        } catch (error) {
            console.error("Error al obtener playlists:", error);
            setPlaylists([]);
        }
    };

    const fetchAvailableVideos = async () => {
        try {
            console.log('Obteniendo videos disponibles...');
            const { data } = await axios.get("http://localhost:5000/api/videos");
            console.log('Videos obtenidos:', data);
            setAvailableVideos(data || []);
        } catch (error) {
            console.error("Error al obtener videos disponibles:", error);
            setAvailableVideos([]);
        }
    };

    const fetchHistory = async (userId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/history/user/${userId}`);
            setHistory(data || []);
        } catch (error) {
            console.error("Error al obtener el historial:", error);
            setHistory([]);
        }
    };

    const handleVideoClick = async (videoId) => {
        const userId = localStorage.getItem("selectedUserId");
        try {
            await axios.post('http://localhost:5000/api/history', {
                userId,
                videoId
            });
            fetchHistory(userId);
        } catch (error) {
            console.error("Error al registrar en el historial:", error);
        }
    };

    const clearHistory = async () => {
        const userId = localStorage.getItem("selectedUserId");
        try {
            await axios.delete(`http://localhost:5000/api/history/user/${userId}`);
            setHistory([]);
            setSuccess("Historial limpiado exitosamente");
        } catch (error) {
            setError("Error al limpiar el historial");
        }
    };

    const handleAddVideoToPlaylist = async (video) => {
        try {
            if (!selectedPlaylist?._id) {
                return;
            }

            console.log('Agregando video a la playlist:', {
                playlistId: selectedPlaylist._id,
                videoId: video._id
            });

            const response = await axios.post(
                `http://localhost:5000/api/playlists/${selectedPlaylist._id}/videos`,
                { videoId: video._id }
            );

            if (response.data) {
                // Actualizar la playlist seleccionada con los datos actualizados
                setSelectedPlaylist(response.data);
                
                // Actualizar la lista de playlists
                setPlaylists(playlists.map(p => 
                    p._id === selectedPlaylist._id 
                        ? response.data
                        : p
                ));
                
                setSuccess("¡Video agregado exitosamente! 🎉");
            }
        } catch (error) {
            console.error("Error al agregar video:", error);
            setError(error.response?.data?.message || "Error al agregar el video");
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    // Filtrar videos que coincidan con el término de búsqueda
    const filteredVideos = selectedPlaylist?.videos?.filter(video => {
        const searchTermLower = searchTerm.toLowerCase().trim();
        const videoNameLower = video.name.toLowerCase();
        return searchTermLower === '' || videoNameLower.includes(searchTermLower);
    });

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Playlists de {userName}</h4>
                        <Button 
                            variant="outline-light" 
                            onClick={() => setShowHistoryModal(true)}
                        >
                            Ver Historial
                        </Button>
                    </div>
                </div>
                <div className="card-body">
                    {playlists.length > 0 ? (
                        <div className="row g-3">
                            {playlists.map((playlist) => (
                                <div key={playlist._id} className="col-md-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{playlist.name}</h5>
                                            <p className="card-text text-muted">
                                                {playlist.videos?.length || 0} videos
                                            </p>
                                            <Button 
                                                style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedPlaylist(playlist);
                                                    setShowVideoModal(true);
                                                }}
                                                className="w-100"
                                            >
                                                Ver Videos
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No hay playlists disponibles</p>
                    )}
                </div>
            </div>

            {/* Modal de Historial */}
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Historial de Videos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    
                    <div className="d-flex justify-content-end mb-3">
                        <Button 
                            variant="outline-danger" 
                            onClick={clearHistory}
                        >
                            Limpiar Historial
                        </Button>
                    </div>

                    {history.length > 0 ? (
                        <div className="row g-3">
                            {history.map((item) => (
                                <div key={item._id} className="col-md-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h6 className="card-title">{item.videoId.name}</h6>
                                            <div className="ratio ratio-16x9 mb-3">
                                                <iframe
                                                    src={getYouTubeEmbedUrl(item.videoId.url)}
                                                    title={item.videoId.name}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                            <p className="text-muted small">
                                                Visto el: {new Date(item.watchedAt).toLocaleString()}
                                            </p>
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => window.open(item.videoId.url, '_blank')}
                                                className="w-100"
                                            >
                                                Ver en YouTube
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No hay videos en el historial</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal para Ver Videos */}
            <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Videos de {selectedPlaylist?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {/* Buscador de Videos */}
                    <div className="mb-4">
                        <Form.Group>
                            <Form.Label>Buscar Videos</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </div>

                    {/* Lista de Videos en la Playlist */}
                    <div>
                        <h5>Videos en la Playlist</h5>
                        {filteredVideos?.length > 0 ? (
                            <div className="row g-3">
                                {filteredVideos.map((video) => (
                                    <div key={video._id} className="col-md-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h6 className="card-title">{video.name}</h6>
                                                <div className="ratio ratio-16x9 mb-3">
                                                    <iframe
                                                        src={getYouTubeEmbedUrl(video.url)}
                                                        title={video.name}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        onClick={() => {
                                                            window.open(video.url, '_blank');
                                                            handleVideoClick(video._id);
                                                        }}
                                                        className="flex-grow-1"
                                                    >
                                                        Ver en YouTube
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted">
                                {searchTerm 
                                    ? "No se encontraron videos que coincidan con la búsqueda"
                                    : "No hay videos en esta playlist"}
                            </p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserPlaylists; 