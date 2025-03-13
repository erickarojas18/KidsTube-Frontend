import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    axios.get(`http://localhost:5000/restricted-users/${userId}`)
      .then(response => setProfiles(response.data))
      .catch(error => console.error("❌ Error al obtener perfiles:", error));
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-restricted-user/${id}`);
      setProfiles(prevProfiles => prevProfiles.filter(profile => profile._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar perfil:", error);
    }
  };

  return (
    <div className="container">
      <h2>Administrar Perfiles</h2>
      
      {profiles.length === 0 ? (
        <>
          <p>No hay perfiles disponibles.</p>
          <button onClick={() => navigate("/new-profile")}>➕ Crear Perfil</button>
        </>
      ) : (
        <ul>
          {profiles.map(profile => (
            <li key={profile._id}>
              {profile.name} - {profile.pin}
              <button onClick={() => handleDelete(profile._id)}>❌ Eliminar</button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/select-profile")}>⬅️ Volver</button>
    </div>
  );
};

export default ManageProfiles;
