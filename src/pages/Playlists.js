import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Modal } from "react-bootstrap";
import { getVideos } from "../services/videoService";

const GET_PLAYLISTS_BY_USER = gql`
  query GetPlaylists($userId: ID!) {
    playlists(userId: $userId) {
      id
      name
      videos {
        id
        name
        url
        description
      }
    }
  }
`;

const Playlists = () => {
  const [restrictedUsers, setRestrictedUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", profiles: [] });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [availableVideos, setAvailableVideos] = useState([]);
  const [playlistMembers, setPlaylistMembers] = useState([]);
  const [playlistError, setPlaylistError] = useState("");
  const [playlistSuccess, setPlaylistSuccess] = useState("");
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", profiles: [] });

  const userId = localStorage.getItem("userId");

  // Apollo: obtener playlists
  const { loading, data, refetch } = useQuery(GET_PLAYLISTS_BY_USER, {
    variables: { userId },
    skip: !userId,
  });
  refetch();

  useEffect(() => {
    if (data?.playlists) {
      setPlaylists(data.playlists);
    }
  }, [data]);

  useEffect(() => {
    fetchRestrictedUsers();
    fetchAvailableVideos();
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    let timeoutId;
    if (error || success) timeoutId = setTimeout(clearMessages, 3000);
    return () => clearTimeout(timeoutId);
  }, [error, success]);

  

  const fetchRestrictedUsers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/restricted-users/${userId}`);
      setRestrictedUsers(data || []);
    } catch (error) {
      console.error("Error al obtener usuarios restringidos:", error);
      setRestrictedUsers([]);
    }
  };

  const fetchPlaylistMembers = async (playlist) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/playlists/${playlist.id}/members`);
      setPlaylistMembers(data);
      setSelectedPlaylist(playlist);
      setShowMembersModal(true);
    } catch (error) {
      console.error("Error al obtener miembros de la playlist:", error);
      setError("Error al obtener los miembros de la playlist");
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
        profiles: [...formData.profiles, userId],
        videos: []
      });

      if (response.data) {
        setFormData({ name: "", profiles: [] });
        setSuccess("¡Playlist creada exitosamente! 🎉");
        refetch(); // Recargar con Apollo
      }
    } catch (error) {
      console.error("Error al crear playlist:", error);
      setError("Error al crear la playlist");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("¿Está seguro de eliminar esta playlist?")) {
      try {
        await axios.delete(`http://localhost:5000/api/playlists/${playlistId}`);
        setSuccess("Playlist eliminada exitosamente");
        refetch(); // Apollo
      } catch (error) {
        setError("Error al eliminar la playlist");
      }
    }
  };

    const handleEditPlaylist = async (e) => {
        e.preventDefault();
        try {
            if (!editFormData.name || editFormData.profiles.length === 0) {
                setError("Por favor, complete todos los campos requeridos");
                return;
            }

            const response = await axios.put(`http://localhost:5000/api/playlists/${selectedPlaylist._id}`, {
                name: editFormData.name,
                profiles: editFormData.profiles
            });

            if (response.data) {
                setSuccess("¡Playlist actualizada exitosamente! 🎉");
                setShowEditModal(false);
                refetch();

            }
        } catch (error) {
            console.error("Error al actualizar playlist:", error);
            setError(error.response?.data?.message || "Error al actualizar la playlist");
        }
    };

    const openEditModal = (playlist) => {
        setSelectedPlaylist(playlist);
        setEditFormData({
            name: playlist.name,
            profiles: playlist.profiles.map(profile => profile._id)
        });
        setShowEditModal(true);
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

    const handleRemoveProfile = async (playlistId, profileId) => {
        try {
            await axios.delete(`http://localhost:5000/api/playlists/${playlistId}/profiles/${profileId}`);
            
            // Actualizar el estado local
            setPlaylists(playlists.map(playlist => {
                if (playlist._id === playlistId) {
                    return {
                        ...playlist,
                        profiles: playlist.profiles.filter(profile => profile._id !== profileId)
                    };
                }
                return playlist;
            }));

            // Actualizar la playlist seleccionada si está abierta
            if (selectedPlaylist?._id === playlistId) {
                setSelectedPlaylist(prev => ({
                    ...prev,
                    profiles: prev.profiles.filter(profile => profile._id !== profileId)
                }));
            }

            setPlaylistSuccess("Integrante eliminado exitosamente");
            setTimeout(() => setPlaylistSuccess(""), 3000);
        } catch (error) {
            console.error("Error al eliminar integrante:", error);
            setPlaylistError("Error al eliminar el integrante");
            setTimeout(() => setPlaylistError(""), 3000);
        }
    };

    const handleAddProfiles = async (playlistId) => {
        try {
            const selectedProfiles = formData.profiles;
            if (!selectedProfiles || selectedProfiles.length === 0) {
                setPlaylistError("Por favor, selecciona al menos un perfil");
                return;
            }

            const response = await axios.post(
                `http://localhost:5000/api/playlists/${playlistId}/profiles`,
                { profileIds: selectedProfiles }
            );

            // Actualizar el estado local
            setPlaylists(playlists.map(playlist => {
                if (playlist._id === playlistId) {
                    return response.data;
                }
                return playlist;
            }));

            // Actualizar la playlist seleccionada si está abierta
            if (selectedPlaylist?._id === playlistId) {
                setSelectedPlaylist(response.data);
            }

            setFormData({ ...formData, profiles: [] });
            setShowAddMembersModal(false);
            setPlaylistSuccess("Integrantes agregados exitosamente");
            setTimeout(() => setPlaylistSuccess(""), 3000);
        } catch (error) {
            console.error("Error al agregar integrantes:", error);
            setPlaylistError("Error al agregar los integrantes");
            setTimeout(() => setPlaylistError(""), 3000);
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
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={() => openEditModal(playlist)}
                                                            className="flex-grow-1"
                                                        >
                                                            Editar
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
                    {playlistError && <div className="alert alert-danger">{playlistError}</div>}
                    {playlistSuccess && <div className="alert alert-success">{playlistSuccess}</div>}
                    
                    <div className="d-flex justify-content-end mb-3">
                        <Button 
                            style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                            size="sm"
                            onClick={() => setShowAddMembersModal(true)}
                        >
                            <i className="fas fa-plus"></i> Agregar Integrantes
                        </Button>
                    </div>
                    
                    {selectedPlaylist?.profiles && selectedPlaylist.profiles.length > 0 ? (
                        <div className="list-group">
                            {selectedPlaylist.profiles.map((profile) => (
                                <div key={profile._id} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={profile.avatar || "https://placehold.co/50"}
                                                    alt={profile.name}
                                                    className="rounded-circle"
                                                    width="50"
                                                    height="50"
                                                />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">{profile.name}</h6>
                                                <small className="text-muted">{profile.email || 'Sin correo'}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleRemoveProfile(selectedPlaylist._id, profile._id)}
                                        >
                                            <i className="fas fa-trash"></i> Eliminar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No hay integrantes en esta playlist</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal para Agregar Integrantes */}
            <Modal show={showAddMembersModal} onHide={() => setShowAddMembersModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Integrantes a {selectedPlaylist?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Selecciona los Perfiles a Agregar</Form.Label>
                            <Form.Select
                                multiple
                                value={formData.profiles}
                                onChange={(e) => {
                                    const values = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({ ...formData, profiles: values });
                                }}
                                className="form-select"
                            >
                                {restrictedUsers
                                    .filter(user => !selectedPlaylist?.profiles?.some(profile => profile._id === user._id))
                                    .map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.name}
                                        </option>
                                    ))
                                }
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Para seleccionar múltiples perfiles, mantén presionado Ctrl (Cmd en Mac)
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button 
                                variant="secondary" 
                                onClick={() => setShowAddMembersModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                                onClick={() => handleAddProfiles(selectedPlaylist._id)}
                            >
                                Agregar Integrantes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal para Editar Playlist */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <Form onSubmit={handleEditPlaylist}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Playlist</Form.Label>
                            <Form.Control
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                placeholder="Ej: Videos Educativos"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Selecciona los Perfiles que tendrán acceso</Form.Label>
                            <Form.Select
                                multiple
                                value={editFormData.profiles}
                                onChange={(e) => {
                                    const values = Array.from(e.target.selectedOptions, option => option.value);
                                    setEditFormData({ ...editFormData, profiles: values });
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

                        <div className="d-flex justify-content-end gap-2">
                            <Button 
                                variant="secondary" 
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                                type="submit"
                            >
                                Guardar Cambios
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
     
        
    );
};

export default Playlists;
