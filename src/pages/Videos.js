import React, { useState, useEffect } from "react";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { createVideo, deleteVideo, updateVideo } from "../services/videoService";
import "../videos.css";

// Consulta para obtener todos los videos
const GET_ALL_VIDEOS = gql`
  query GetAllVideos {
    videos {
      id
      name
      url
    }
  }
`;

// Consulta para buscar videos por nombre
const SEARCH_VIDEOS = gql`
  query SearchVideos($name: String!) {
    searchVideos(name: $name) {
      id
      name
      url
    }
  }
`;

const Videos = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoList, setVideoList] = useState([]);

  const { data: allVideosData, loading: loadingAll, error: errorAll, refetch } = useQuery(GET_ALL_VIDEOS);
  const [searchVideos, { data: searchData, loading: loadingSearch, error: errorSearch }] = useLazyQuery(SEARCH_VIDEOS);

  useEffect(() => {
    if (searchData?.searchVideos) {
      setVideoList(searchData.searchVideos);
    } else if (allVideosData?.videos) {
      setVideoList(allVideosData.videos);
    }
  }, [allVideosData, searchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateVideo(editId, { name, url });
      setEditId(null);
    } else {
      await createVideo({ name, url });
    }

    if (searchTerm) {
      searchVideos({ variables: { name: searchTerm } });
    } else {
      await refetch(); // Recarga los videos sin recargar la página
    }

    setName("");
    setUrl("");
  };

  const handleEdit = (video) => {
    setEditId(video.id);
    setName(video.name);
    setUrl(video.url);
  };

  const handleSearch = () => {
    searchVideos({ variables: { name: searchTerm } });
  };

  // Modificación de la función getYouTubeEmbedUrl
  const getYouTubeEmbedUrl = (url) => {
    // Intentamos primero extraer el ID de una URL larga (https://www.youtube.com/watch?v=videoId)
    let videoId = url.split("v=")[1]?.split("&")[0];
    
    // Si no encontramos el ID con el formato largo, intentamos con la URL corta (https://youtu.be/videoId)
    if (!videoId) {
      const regex = /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/))([^"&?\/\s]{11})/;
      const match = url.match(regex);
      if (match) {
        videoId = match[1];
      }
    }
  
    console.log("Video URL:", url); // Mostrar la URL recibida
    console.log("Video ID extraído:", videoId); // Mostrar el videoId extraído
  
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };
  

  return (
    <div className="videos-container">
      <div className="videos-card">
        <h2 className="videos-title">🎬 Gestión de Videos</h2>

        {/* Buscador */}
        <input
          type="text"
          className="videos-input"
          placeholder="Buscar video por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="videos-button search" onClick={handleSearch}>
          Buscar
        </button>

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

        {/* Errores */}
        {(errorAll || errorSearch) && (
          <p>Error al cargar los videos: {(errorAll || errorSearch).message}</p>
        )}

        {/* Lista de videos */}
        {(loadingAll || loadingSearch) ? (
          <p>Cargando videos...</p>
        ) : (
          <ul className="videos-list">
            {videoList.map((video) => (
              <li key={video.id} className="videos-item">
                <div className="video-content">
                  <strong>{video.name}</strong>
                  <div className="video-frame">
                    {getYouTubeEmbedUrl(video.url) ? (
                      <iframe
                        width="100%"
                        height="315"
                        src={getYouTubeEmbedUrl(video.url)}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <p>URL de video no válida</p> // Mostrar mensaje si la URL no es válida
                    )}
                  </div>
                </div>

                <div className="videos-actions">
                  <button className="videos-button edit" onClick={() => handleEdit(video)}>
                    ✏️ Editar
                  </button>
                  <button
                    className="videos-button delete"
                    onClick={() =>
                      deleteVideo(video.id).then(() => {
                        if (searchTerm) {
                          searchVideos({ variables: { name: searchTerm } });
                        } else {
                          refetch(); // También usar refetch aquí
                        }
                      })
                    }
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Videos;
