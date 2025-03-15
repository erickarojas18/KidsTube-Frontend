import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SelectProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false); // Estado para forzar la actualización
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // ID del usuario logueado

  useEffect(() => {
    // Obtener perfiles restringidos del usuario autenticado
    axios.get(`http://localhost:5000/api/restricted-users/${userId}`)
      .then(response => {
        // Verifica si la respuesta tiene los datos esperados
        if (response.data && Array.isArray(response.data)) {
          setProfiles(response.data);
        } else {
          console.warn("⚠️ La respuesta no contiene un arreglo de perfiles");
        }
      })
      .catch(error => console.error("Error al obtener perfiles:", error));
  }, [userId, refresh]); // Agregar `refresh` como dependencia

  const handleProfileClick = (profile) => {
    setSelectedUser(profile);
    setError("");
    setPin("");
  };

  const handlePinSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/validate-pin", {
        userId: selectedUser._id,
        pin
      });

      if (response.data.message === "PIN válido") {
        navigate("/home"); // Redirigir a la pantalla de inicio
      }
    } catch (error) {
      setError("PIN incorrecto");
    }
  };

  return (
    <div className="container">
      <h2>Selecciona un perfil</h2>
      {/* Verifica si hay perfiles */}
      {profiles.length === 0 ? (
        <p>No se han creado perfiles aún. Por favor, agrega un perfil.</p>
      ) : (
        <div className="profiles">
          {profiles.map(profile => (
            <div key={profile._id} className="profile-card" onClick={() => handleProfileClick(profile)}>
              {/* Mostrar avatar */}
              <img
                src={profile.avatar ? `/avatars/${profile.avatar}` : "/avatars/default-avatar.png"} // Asegúrate de que la ruta sea correcta
                alt={profile.name}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <p>{profile.name}</p>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="pin-modal">
          <h3>Ingresa el PIN de {selectedUser.name}</h3>
          <input
            type="password"
            maxLength="6"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button onClick={handlePinSubmit}>Ingresar</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      <button onClick={() => navigate("/new-profile")}>➕ Agregar Perfil</button>
      <button onClick={() => navigate("/AdminRestricted")}>⚙️ Administrar Perfiles</button>
    </div>
  );
};

export default SelectProfile;
