import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UserPlaylists.css";
import { gql, useQuery } from '@apollo/client';  // Importa Apollo Client

const GET_VIDEOS = gql`
  query GetVideos {
    videos {
      id
      name
      url
    }
  }
`;

const UserPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [userName, setUserName] = useState("");
    const [availableVideos, setAvailableVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [history, setHistory] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [historySuccess, setHistorySuccess] = useState("");
    const [playlistError, setPlaylistError] = useState("");
    const [playlistSuccess, setPlaylistSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const selectedUserId = localStorage.getItem("selectedUserId");
        if (!selectedUserId) {
            navigate("/playlists");
            return;
        }

        fetchPlaylists(selectedUserId);
        fetchUserName(selectedUserId);
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
            console.log('🔍 Obteniendo playlists para el usuario:', userId);
            const { data } = await axios.get(`http://localhost:5000/api/playlists/user/${userId}`);
            console.log('📋 Playlists obtenidas:', data);
            
            const playlistsWithProfiles = data.map(playlist => {
                console.log(`Playlist "${playlist.name}" tiene ${playlist.profiles?.length || 0} perfiles:`, playlist.profiles);
                return playlist;
            });
            
            setPlaylists(playlistsWithProfiles || []);
        } catch (error) {
            console.error("❌ Error al obtener playlists:", error);
            setPlaylists([]);
        }
    };

    const fetchHistory = async (userId) => {
        try {
            console.log('Obteniendo historial para usuario:', userId);
            const { data } = await axios.get(`http://localhost:5000/api/history/user/${userId}`);
            console.log('Historial obtenido:', data);
            setHistory(data || []);
        } catch (error) {
            console.error("Error al obtener el historial:", error);
            setHistory([]);
        }
    };

    const handleVideoClick = async (videoId) => {
        const userId = localStorage.getItem("selectedUserId");
        if (!userId || !videoId) {
            console.error('Faltan datos necesarios:', { userId, videoId });
            return;
        }

        try {
            console.log('Registrando video en historial:', { userId, videoId });
            const response = await axios.post('http://localhost:5000/api/history', {
                userId,
                videoId
            });
            console.log('Respuesta del servidor:', response.data);
            await fetchHistory(userId);
        } catch (error) {
            console.error("Error al registrar en el historial:", error.response?.data || error);
            setHistoryError("Error al registrar el video en el historial");
            setHistorySuccess("");
        }
    };

    const handleWatchVideo = async (video) => {
        await handleVideoClick(video._id);
        window.open(video.url, '_blank');
    };

    const clearHistory = async () => {
        const userId = localStorage.getItem("selectedUserId");
        try {
            await axios.delete(`http://localhost:5000/api/history/user/${userId}`);
            setHistory([]);
            setHistorySuccess("Historial limpiado exitosamente");
            setHistoryError("");
        } catch (error) {
            setHistoryError("Error al limpiar el historial");
            setHistorySuccess("");
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
                setSelectedPlaylist(response.data);
                setPlaylists(playlists.map(p => 
                    p._id === selectedPlaylist._id 
                        ? response.data
                        : p
                ));
                setPlaylistSuccess("¡Video agregado exitosamente! 🎉");
                setPlaylistError("");
            }
        } catch (error) {
            console.error("Error al agregar video:", error);
            setPlaylistError(error.response?.data?.message || "Error al agregar el video");
            setPlaylistSuccess("");
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtrar videos que coincidan con el término de búsqueda
    const getFilteredVideos = () => {
        if (!availableVideos) return [];
        if (!searchTerm.trim()) return availableVideos;

        return availableVideos.filter(video => {
            const searchTermLower = searchTerm.toLowerCase().trim();
            const videoNameLower = video.name.toLowerCase();
            return videoNameLower.includes(searchTermLower);
        });
    };

    // Consulta de GraphQL con Apollo Client
    const { data: videoData, loading: loadingVideos, error: errorVideos } = useQuery(GET_VIDEOS);

    useEffect(() => {
        if (videoData?.videos) {
            setAvailableVideos(videoData.videos);
        }
    }, [videoData]);

    if (loadingVideos) return <p>Cargando videos...</p>;
    if (errorVideos) return <p>Error al cargar videos.</p>;

    return (
        <div className="container-fluid mt-4">
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
                        <div className="playlist-container">
                            {playlists.map((playlist) => (
                                <div key={playlist._id} className="playlist-card">
                                    <div className="playlist-header">
                                        <h5 className="playlist-title">{playlist.name}</h5>
                                    </div>
                                    <div className="playlist-content">
                                        <div className="playlist-info">
                                            <p>{playlist.videos?.length || 0} videos</p>
                                        </div>
                                        <div className="playlist-actions">
                                            <Button 
                                                style={{ 
                                                    backgroundColor: '#6f42c1', 
                                                    borderColor: '#6f42c1'
                                                }}
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
                    {historyError && <div className="alert alert-danger">{historyError}</div>}
                    {historySuccess && <div className="alert alert-success">{historySuccess}</div>}

                    <div className="d-flex justify-content-end mb-3">
                        <Button 
                            variant="outline-danger" 
                            onClick={clearHistory}
                        >
                            Limpiar Historial
                        </Button>
                    </div>

                    {history.length > 0 ? (
                        <div className="video-grid">
                            {history.map((item) => (
                                item.videoId ? (
                                    <div key={item._id} className="video-card">
                                        <div className="video-info">
                                            <h6 className="video-title">{item.videoId.name}</h6>
                                            <div className="ratio ratio-16x9 mb-3">
                                                <iframe
                                                    src={getYouTubeEmbedUrl(item.videoId.url)}
                                                    title={item.videoId.name}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                            <p className="video-meta">
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
                                ) : null
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
                    {playlistError && <div className="alert alert-danger">{playlistError}</div>}
                    {playlistSuccess && <div className="alert alert-success">{playlistSuccess}</div>}

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

                    <h5>Videos en la Playlist</h5>
                    {selectedPlaylist?.videos?.length > 0 ? (
                        <>
                            <div className="video-grid">
                                {getFilteredVideos().map((video) => (
                                    <div key={video.id} className="video-card">
                                        <div className="video-info">
                                            <h6 className="video-title">{video.name}</h6>
                                            <div className="ratio ratio-16x9 mb-3">
                                                <iframe
                                                    src={getYouTubeEmbedUrl(video.url)}
                                                    title={video.name}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <Button 
                                                    variant="outline-info" 
                                                    onClick={() => handleWatchVideo(video)}
                                                    size="sm"
                                                >
                                                    Ver Video
                                                </Button>
                                                <Button 
                                                    variant="outline-success"
                                                    onClick={() => handleAddVideoToPlaylist(video)}
                                                    size="sm"
                                                >
                                                    Agregar a Playlist
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-muted">No hay videos en esta playlist</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserPlaylists;
