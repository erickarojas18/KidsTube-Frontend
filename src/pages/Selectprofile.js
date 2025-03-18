import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SelectProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState(""); // Define a dónde se redirige después del PIN

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // ID del usuario logueado

  useEffect(() => {
    axios.get(`http://localhost:5000/api/restricted-users/${userId}`)
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setProfiles(response.data);
        } else {
          console.warn(" La respuesta no contiene un arreglo de perfiles");
        }
      })
      .catch(error => console.error("Error al obtener perfiles:", error));
  }, [userId]);

  const handleProfileClick = (profile) => {
    setRedirectPath("/videos"); // Al tocar perfil, se va a videos después del PIN
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handleAdminProfilesClick = () => {
    setRedirectPath("/AdminRestricted"); // Al tocar "Administrar Perfiles", se va a AdminRestricted después del PIN
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handleAdminClick = () => {
    setRedirectPath("/videos"); // Al tocar "Administración", se va a videos después del PIN
    setShowPinModal(true);
    setError("");
    setPin("");
  };

  const handlePinSubmit = async () => {
    try {
      console.log("🔑 Enviando PIN:", pin);

      const response = await axios.post("http://localhost:5000/api/validate-admin-pin", {
        userId, // Siempre se valida con el usuario principal
        pin
      });

      if (response.data.message === "PIN válido") {
        console.log("✅ PIN correcto, redirigiendo...");
        setShowPinModal(false);
        navigate(redirectPath); // Redirigir a la página correspondiente
      } else {
        setError("PIN incorrecto");
      }
    } catch (error) {
      setError("PIN incorrecto");
    }
  };

  return (
    <div className="container">
      <h2>Selecciona un perfil</h2>

      {profiles.length === 0 ? (
        <p>No se han creado perfiles aún. Por favor, agrega un perfil.</p>
      ) : (
        <div className="profiles">
          {profiles.map(profile => (
            <div key={profile._id} className="profile-card" onClick={() => handleProfileClick(profile)}>
              <img
                src={profile.avatar ? `/avatars/${profile.avatar}` : "/avatars/default-avatar.png"}
                alt={profile.name}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <p>{profile.name}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate("/new-profile")}>➕ Agregar Perfil</button>
      <button onClick={handleAdminProfilesClick}>⚙️ Administrar Perfiles</button>
      <button onClick={handleAdminClick}>📂 Administración</button>

      {/* Modal para ingresar PIN del usuario principal */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ingrese el PIN del usuario principal</h3>
            <input
              type="password"
              maxLength="6"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button onClick={handlePinSubmit}>Validar</button>
            <button onClick={() => setShowPinModal(false)}>Cancelar</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectProfile;
