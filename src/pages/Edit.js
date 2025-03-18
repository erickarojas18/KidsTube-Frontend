import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [avatar, setAvatar] = useState("");

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
        <input 
          type="text" 
          placeholder="URL del Avatar" 
          value={avatar} 
          onChange={(e) => setAvatar(e.target.value)} 
        />
        <button type="submit">💾 Guardar Cambios</button>
      </form>
      <button onClick={() => navigate("/AdminRestricted")}>⬅️ Cancelar</button>
    </div>
  );
};

export default EditProfile;
