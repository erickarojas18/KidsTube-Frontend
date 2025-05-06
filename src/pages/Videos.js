import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { createVideo, deleteVideo, updateVideo } from "../services/videoService";
import "../videos.css";

const GET_ALL_VIDEOS = gql`
  query GetAllVideos {
    videos {
      id
      name
      url
    }
  }
`;

const Videos = () => {
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: allVideosData, loading, error, refetch } = useQuery(GET_ALL_VIDEOS);

  useEffect(() => {
    if (allVideosData?.videos) {
      setVideoList(allVideosData.videos);
    }
  }, [allVideosData]);

  const searchYouTubeVideos = async (query) => {
    const apiKey = "AIzaSyCbqiVn_Uvm0dvtyXXopRRUyCuuDoFI874";
    const maxResults = 5;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&key=${apiKey}&type=video&maxResults=${maxResults}`
    );
    const data = await response.json();
    const results = data.items.map((item) => ({
      id: item.id.videoId,
      name: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
    setVideoList(results);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;
    await searchYouTubeVideos(searchTerm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateVideo(editId, { name });
      setEditId(null);
      setIsEditing(false);
    }
    setName("");
    refetch();
  };

  const handleEdit = (video) => {
    setEditId(video.id);
    setName(video.name);
    setIsEditing(true);
  };

  const handleAddFromYouTube = async (video) => {
    try {
      await createVideo({ name: video.name, url: video.url });
      alert("Video agregado correctamente");
      refetch();
    } catch (error) {
      alert("Error al guardar el video.");
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    let videoId = url.split("v=")[1]?.split("&")[0];
    if (!videoId) {
      const regex = /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/))([^"&?\/\s]{11})/;
      const match = url.match(regex);
      if (match) {
        videoId = match[1];
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <div className="videos-container">
      <div className="videos-card">
        <h2 className="videos-title">🎬 Gestión de Videos</h2>

        <div className="videos-form-container">
          <input
            type="text"
            className="videos-input"
            placeholder="Buscar video en YouTube"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="videos-button search" onClick={handleSearch}>
            Buscar en YouTube
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="videos-form">
            <input
              type="text"
              className="videos-input"
              placeholder="Editar nombre del video"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit" className="videos-button edit">
              Actualizar Video
            </button>
          </form>
        )}

        {error && <p>Error al cargar los videos: {error.message}</p>}

        {loading ? (
          <p>Cargando videos...</p>
        ) : (
          <div className="videos-grid">
            {videoList.map((video) => {
              const isSaved = allVideosData?.videos.some((v) => v.url === video.url);
              return (
                <div key={video.id} className="videos-item">
                  <div className="video-content">
                    <strong>{video.name}</strong>
                    <div className="video-frame">
                      {getYouTubeEmbedUrl(video.url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(video.url)}
                          title={video.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <p>URL de video no válida</p>
                      )}
                    </div>
                  </div>

                  <div className="videos-actions">
                    {!isSaved ? (
                      <button
                        className="videos-button add"
                        onClick={() => handleAddFromYouTube(video)}
                      >
                        💾 Guardar video
                      </button>
                    ) : (
                      <>
                        <button
                          className="videos-button edit"
                          onClick={() => handleEdit(video)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="videos-button delete"
                          onClick={() =>
                            deleteVideo(video.id).then(() => refetch())
                          }
                        >
                          🗑 Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
