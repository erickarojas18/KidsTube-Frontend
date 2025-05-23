import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../eddit.css";

const EditProfile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatars, setAvatars] = useState([
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    "avatar6.png",
    "avatar7.png",
    "avatar8.png"
  ]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/restricted-users/profile/${profileId}`)
      .then(response => {
        setName(response.data.name);
        setPin(response.data.pin);
        setAvatar(response.data.avatar || "");
      })
      .catch(error => console.error("❌ Error al obtener perfil:", error));
  }, [profileId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/restricted-users/edit-restricted-user/${profileId}`, {
        name,
        pin,
        avatar
      });

      alert("✅ Perfil actualizado correctamente");
      navigate("/AdminRestricted");
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
    }
  };

  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
  };

  return (
    <div className="container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleUpdate}>
        <input 
          type="text" 
          placeholder="Nombre" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="PIN (6 dígitos)" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} 
          required 
          maxLength="6"
        />

        <div>
          <h3>Seleccionar Avatar</h3>
          <div className="edit-profile-avatar-selector">
            {avatars.map((avatarOption) => (
              <div key={avatarOption} className="edit-profile-avatar-option" onClick={() => handleAvatarSelect(avatarOption)}>
                <img 
                  src={`/avatars/${avatarOption}`} 
                  alt={avatarOption} 
                  className={`edit-profile-avatar-thumbnail ${avatar === avatarOption ? 'selected' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="edit-profile-buttons-container">
          <button type="submit" className="edit-profile-button">💾 Guardar Cambios</button>
          <button
            type="button"
            className="edit-profile-button edit-profile-cancel-button"
            onClick={() => navigate("/AdminRestricted")}
          >
            ⬅️ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
