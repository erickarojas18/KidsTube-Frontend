import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SelectProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // ID del usuario logueado

  useEffect(() => {
    // Obtener perfiles restringidos del usuario autenticado
    axios.get(`http://localhost:5000/restricted-users/${userId}`)
      .then(response => setProfiles(response.data))
      .catch(error => console.error("Error al obtener perfiles:", error));
  }, [userId]);

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
      <div className="profiles">
        {profiles.map(profile => (
          <div key={profile._id} className="profile-card" onClick={() => handleProfileClick(profile)}>
            <img src={profile.avatar} alt={profile.name} />
            <p>{profile.name}</p>
          </div>
        ))}
      </div>

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
      <button onClick={() => navigate("/manage-profiles")}>⚙️ Administrar Perfiles</button>
    </div>
  );
};

export default SelectProfile;
