import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Modal } from "react-bootstrap";
import { getVideos } from "../services/videoService";

const Playlists = () => {
    const [restrictedUsers, setRestrictedUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        profiles: []
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showManageModal, setShowManageModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [availableVideos, setAvailableVideos] = useState([]);
    const [playlistMembers, setPlaylistMembers] = useState([]);

    useEffect(() => {
        fetchRestrictedUsers();
        fetchAvailableVideos();
        fetchPlaylists();
       
    }, []);

    // Función para limpiar mensajes
    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    // Efecto para limpiar mensajes después de 3 segundos
    useEffect(() => {
        let timeoutId;
        if (error || success) {
            timeoutId = setTimeout(clearMessages, 3000);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [error, success]);

    const fetchPlaylists = async () => {
        try {
            console.log('Obteniendo playlists...');
            const response = await axios.get("http://localhost:5000/api/playlists");
            console.log('Respuesta completa:', response);
            
            if (response.data) {
                setPlaylists(response.data);
            } else {
                console.error('La respuesta está vacía');
                setPlaylists([]);
            }
        } catch (error) {
            console.error("Error al obtener playlists:", error);
            if (error.response) {
                // El servidor respondió con un estado de error
                console.error("Datos del error:", error.response.data);
                console.error("Estado del error:", error.response.status);
                setError(`Error al obtener playlists: ${error.response.data.message || 'Error del servidor'}`);
            } else if (error.request) {
                // La petición fue hecha pero no se recibió respuesta
                console.error("No se recibió respuesta del servidor");
                setError("No se pudo conectar con el servidor. Por favor, verifica que el servidor esté en ejecución.");
            } else {
                // Error al configurar la petición
                console.error("Error al configurar la petición:", error.message);
                setError("Error al realizar la petición");
            }
            setPlaylists([]);
        }
    };

    const fetchRestrictedUsers = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const { data } = await axios.get(`http://localhost:5000/api/restricted-users/${userId}`);
            setRestrictedUsers(data || []);
        } catch (error) {
            console.error("Error al obtener usuarios restringidos:", error);
            setRestrictedUsers([]);
        }
    };

    const fetchAvailableVideos = async () => {
        try {
            const videos = await getVideos();
            setAvailableVideos(videos);
        } catch (error) {
            console.error("Error al obtener videos disponibles:", error);
            setAvailableVideos([]);
        }
    };

    const fetchPlaylistMembers = async (playlist) => {
        try {
            console.log('Obteniendo miembros de la playlist:', playlist._id);
            const { data } = await axios.get(`http://localhost:5000/api/playlists/${playlist._id}/members`);
            console.log('Miembros obtenidos:', data);
            setPlaylistMembers(data);
            setSelectedPlaylist(playlist);
            setShowMembersModal(true);
        } catch (error) {
            console.error("Error al obtener miembros de la playlist:", error);
            setError(error.response?.data?.message || "Error al obtener los miembros de la playlist");
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name || formData.profiles.length === 0) {
                setError("Por favor, complete todos los campos requeridos");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/playlists", {
                name: formData.name,
                profiles: formData.profiles,
                videos: []
            });

            if (response.data) {
                setFormData({ name: "", profiles: [] });
                setSuccess("¡Playlist creada exitosamente! 🎉");
                fetchPlaylists();
            }
        } catch (error) {
            console.error("Error al crear playlist:", error);
            setError(error.response?.data?.message || "Error al crear la playlist");
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        if (window.confirm("¿Está seguro de eliminar esta playlist?")) {
            try {
                await axios.delete(`http://localhost:5000/api/playlists/${playlistId}`);
                setSuccess("Playlist eliminada exitosamente");
                fetchPlaylists();
            } catch (error) {
                console.error("Error al eliminar playlist:", error);
                setError("Error al eliminar la playlist");
            }
        }
    };

    const handleAddVideoToPlaylist = async (video) => {
        try {
            if (!selectedPlaylist?._id) {
                setError("No hay playlist seleccionada");
                return;
            }

            if (selectedPlaylist.videos?.some(v => v._id === video._id)) {
                setError("Este video ya está en la playlist");
                return;
            }

            console.log('Agregando video:', {
                playlistId: selectedPlaylist._id,
                videoId: video._id
            });

            const response = await axios.post(
                `http://localhost:5000/api/playlists/${selectedPlaylist._id}/videos`,
                { videoId: video._id },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setSelectedPlaylist(response.data);
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

    const handleRemoveVideo = async (videoId) => {
        if (window.confirm("¿Está seguro de eliminar este video de la playlist?")) {
            try {
                await axios.delete(`http://localhost:5000/api/playlists/${selectedPlaylist._id}/videos/${videoId}`);
                
                const updatedPlaylist = {
                    ...selectedPlaylist,
                    videos: selectedPlaylist.videos.filter(v => v._id !== videoId)
                };

                setPlaylists(playlists.map(p => 
                    p._id === selectedPlaylist._id 
                        ? updatedPlaylist
                        : p
                ));
                setSelectedPlaylist(updatedPlaylist);
                setSuccess("Video eliminado exitosamente");
            } catch (error) {
                console.error("Error al eliminar video:", error);
                setError("Error al eliminar el video");
            }
        }
    };  

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                {/* Formulario para crear playlist */}
                <div className="col-md-4">
                    <div className="card h-100">
                        <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                            <h3 className="mb-0">Crear Nueva Playlist</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre de la Playlist</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Videos Educativos"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Selecciona los Perfiles que tendrán acceso</Form.Label>
                                    <Form.Select
                                        multiple
                                        value={formData.profiles}
                                        onChange={(e) => {
                                            const values = Array.from(e.target.selectedOptions, option => option.value);
                                            setFormData({ ...formData, profiles: values });
                                        }}
                                        className="form-select"
                                        required
                                    >
                                        {restrictedUsers.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Para seleccionar múltiples perfiles, mantén presionado Ctrl (Cmd en Mac)
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button 
                                        style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                                        type="submit"
                                        size="lg"
                                        className="w-100"
                                    >
                                        ✨ Crear Playlist
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>

                {/* Lista de Playlists */}
                <div className="col-md-8">
                    <div className="card h-100">
                        <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                            <h4 className="mb-0">Playlists Existentes</h4>
                        </div>
                        <div className="card-body">
                            {playlists.length > 0 ? (
                                <div className="row g-3">
                                    {playlists.map((playlist) => (
                                        <div key={playlist._id} className="col-md-6">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <h5 className="card-title">{playlist.name}</h5>
                                                    <p className="card-text text-muted">
                                                        {playlist.videos?.length || 0} videos
                                                    </p>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <Button 
                                                            style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedPlaylist(playlist);
                                                                setShowManageModal(true);
                                                            }}
                                                            className="flex-grow-1"
                                                        >
                                                            Gestionar Videos
                                                        </Button>
                                                        <Button 
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => fetchPlaylistMembers(playlist)}
                                                            className="flex-grow-1"
                                                        >
                                                            Ver Integrantes
                                                        </Button>
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleDeletePlaylist(playlist._id)}
                                                            className="flex-grow-1"
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted">No hay playlists creadas</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para Gestionar Videos */}
            <Modal show={showManageModal} onHide={() => setShowManageModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Gestionar Videos de {selectedPlaylist?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {/* Lista de Videos Disponibles */}
                    <div className="mb-4">
                        <h5>Videos Disponibles</h5>
                        <div className="row g-3">
                            {availableVideos
                                .filter(video => !selectedPlaylist?.videos?.some(v => v._id === video._id))
                                .map((video) => (
                                    <div key={video._id} className="col-12 col-sm-6 col-md-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h6 className="card-title text-truncate">{video.name}</h6>
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
                                                        style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                                                        size="sm"
                                                        onClick={() => handleAddVideoToPlaylist(video)}
                                                        className="flex-grow-1"
                                                    >
                                                        Agregar
                                                    </Button>
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => window.open(video.url, '_blank')}
                                                    >
                                                        Ver
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Lista de Videos en la Playlist */}
                    <div>
                        <h5>Videos en la Playlist</h5>
                        {selectedPlaylist?.videos?.length > 0 ? (
                            <div className="row g-3">
                                {selectedPlaylist.videos.map((video) => (
                                    <div key={video._id} className="col-12 col-sm-6 col-md-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h6 className="card-title text-truncate">{video.name}</h6>
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
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleRemoveVideo(video._id)}
                                                        className="flex-grow-1"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => window.open(video.url, '_blank')}
                                                    >
                                                        Ver
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted">No hay videos en esta playlist</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal para Ver Integrantes */}
            <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Integrantes de {selectedPlaylist?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {playlistMembers.length > 0 ? (
                        <div className="list-group">
                            {playlistMembers.map((member) => (
                                <div key={member._id} className="list-group-item">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={member.avatar || "https://via.placeholder.com/50"}
                                                alt={member.name}
                                                className="rounded-circle"
                                                width="50"
                                                height="50"
                                            />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-0">{member.name}</h6>
                                            <small className="text-muted">{member.email}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No hay integrantes en esta playlist</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
     
        
    );
};

export default Playlists;
