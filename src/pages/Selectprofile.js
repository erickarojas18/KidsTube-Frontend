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

  const handleProfileClick = () => {
    setRedirectPath("/Playlists");
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handleAdminProfilesClick = () => {
    setRedirectPath("/AdminRestricted");
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handleAdminClick = () => {
    setRedirectPath("/videos");
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handlePinSubmit = async () => {
    try {
      console.log("🔑 Enviando PIN:", pin);

      const response = await axios.post(
        "http://localhost:5000/api/validate-admin-pin",
        { userId, pin }
      );

      if (response.data.message === "PIN válido") {
        console.log("✅ PIN correcto, redirigiendo...");
        setShowPinModal(false);
        navigate(redirectPath);
      } else {
        setError("PIN incorrecto ❌");
      }
    } catch (error) {
      setError("PIN incorrecto ❌");
      console.error("❌ Error en la validación del PIN:", error);
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
              onClick={handleProfileClick}
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
      <div className="actions">
        <button
          className="circle-btn"
          onClick={() => navigate("/new-profile")}
        >
          ➕
        </button>
        <button className="circle-btn" onClick={handleAdminProfilesClick}>
          ⚙️
        </button>
        <button className="circle-btn" onClick={handleAdminClick}>
          📂
        </button>
      </div>

      {/* Modal para ingresar PIN */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ingrese el PIN del usuario principal</h3>
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
      )}
    </div>
  );
};

export default SelectProfile;
