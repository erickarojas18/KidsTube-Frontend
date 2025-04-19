import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../selectProfile.css"; // Asegúrate de que el archivo CSS está en la ruta correcta

const SelectProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No se encontró un userId en localStorage");
      return;
    }

    axios
      .get(`http://localhost:5000/api/restricted-users/${userId}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setProfiles(response.data);
        } else {
          console.warn("⚠️ La respuesta no contiene un arreglo de perfiles.");
        }
      })
      .catch((error) => {
        console.error("❌ Error al obtener perfiles:", error);
      });
  }, [userId]);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setRedirectPath("/user-playlists/:userId");
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handleAdminProfilesClick = () => {
    setSelectedProfile(null);
    setRedirectPath("/AdminRestricted");
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handleAdminClick = () => {
    setSelectedProfile(null);
    setRedirectPath("/videos");
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handlePinSubmit = async () => {
    try {
      if (selectedProfile) {
        const response = await axios.post(
          "http://localhost:5000/api/restricted-users/validate-pin",
          { 
            userId: selectedProfile._id,
            pin,
          }
        );

        if (response.data && response.data.message === "PIN válido") {
          console.log("✅ PIN validado correctamente");
          localStorage.setItem("selectedUserId", selectedProfile._id);
          setShowPinModal(false);
          navigate(redirectPath);
        } else {
          setError("PIN incorrecto. Por favor, intente nuevamente ❌");
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/admin/validate-pin",
          { 
            pin
          }
        );

        if (response.data && response.data.isValid) {
          console.log("✅ PIN de administrador validado correctamente");
          setShowPinModal(false);
          navigate(redirectPath);
        } else {
          setError("PIN incorrecto. Por favor, intente nuevamente ❌");
        }
      }
    } catch (error) {
      console.error("❌ Error:", error.response?.data);
      setError("PIN incorrecto. Por favor, intente nuevamente ❌");
    }
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
              onClick={() => handleProfileClick(profile)}
            >
              <img
                src={
                  profile.avatar
                    ? `/avatars/${profile.avatar}`
                    : "/avatars/default-avatar.png"
                }
                alt={profile.name}
                className="profile-avatar"
              />
              <p className="profile-name">{profile.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Botones de acción */}
      <div className="button-container">
        <button className="circle-btn" onClick={() => navigate("/new-profile")}>
          ➕
        </button>
        <button className="circle-btn" onClick={() => navigate("/AdminRestricted")}>
          ⚙️
        </button>
        <button className="circle-btn" onClick={() => navigate("/videos")}>
          📂
        </button>
      </div>

      {/* Modal para ingresar PIN */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-wrapper">
            <div className="modal-content">
              <h3>Ingrese el PIN</h3>
              <input
                type="password"
                maxLength="6"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pin-input"
                placeholder="******"
              />
              {error && <p className="error-text">{error}</p>}
              <div className="button-group">
                <button className="btn validate" onClick={handlePinSubmit}>
                  Validar
                </button>
                <button
                  className="btn cancel"
                  onClick={() => setShowPinModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectProfile;

