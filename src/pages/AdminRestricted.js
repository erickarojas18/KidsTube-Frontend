import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../adminRestricted.css";

const ManageProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  // Obtener el ID del usuario logueado
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ userId es inválido o no está en localStorage.");
      return;
    }

    axios.get(`http://localhost:5000/api/restricted-users/${userId}`)
      .then(response => setProfiles(response.data))
      .catch(error => console.error("❌ Error al obtener perfiles:", error));
  }, [userId]);

  const handleProfileClick = (id) => {
    // Redirigir a la página de edición del perfil
    navigate(`/edit/${id}`);
  };

  const handleEditIconClick = (event, id) => {
    // Evitar que el clic en el icono de editar se propague y redirija
    event.stopPropagation(); // Detener la propagación del clic
    navigate(`/edit/${id}`); // Redirigir al editar perfil
  };

  return (
    <div className="container">
      <h2>Selecciona un perfil</h2>

      {profiles.length === 0 ? (
        <p>No se han creado perfiles aún. Por favor, agrega un perfil.</p>
      ) : (
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="profile-card"
              onClick={() => handleProfileClick(profile._id)} // Redirige a la página de edición cuando se hace clic en el avatar
            >
              <div className="avatar-container">
                <img
                  src={
                    profile.avatar
                      ? `/avatars/${profile.avatar}`
                      : "/avatars/default-avatar.png"
                  }
                  alt={profile.name}
                  className="profile-avatar"
                />
                 <div className="edit-icon">✏️</div>
               
              </div>
              <p className="profile-name">{profile.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Botones de acción */}
      <div className="actions">
        <button
          className="circle-btn"
          onClick={() => navigate("/new-profile")}
        >
          ➕
        </button>
        <button className="circle-btn" onClick={() => navigate("/admin-profiles")}>
          ⚙️
        </button>
        <button className="circle-btn" onClick={() => navigate("/admin")}>
          📂
        </button>
      </div>
    </div>
  );
};

export default ManageProfiles;
