import React, { useState } from "react";
import "../newProfile.css";

const AdminRestrictedUsers = () => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [avatar, setAvatar] = useState("");

  // Lista de avatares en la carpeta public/avatars
  const avatars = ["avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png", "avatar5.png", "avatar6.png", "avatar7.png", "avatar8.png"];

  const handleAddUser = () => {
    const parentUser = localStorage.getItem("userId"); // Recupera el usuario principal
  
    if (!parentUser) {
      alert("Error: No se encontró el usuario principal ❌");
      return;
    }
  
    if (!name || !pin || !avatar) {
      alert("Todos los campos son obligatorios ❌");
      return;
    }
  
    if (pin.length !== 6 || isNaN(pin)) {
      alert("El PIN debe tener exactamente 6 dígitos numéricos ❌");
      return;
    }
  
    fetch("http://localhost:5000/api/restricted-users/add-restricted-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pin, avatar, parentUser }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la solicitud");
        }
        return res.json();
      })
      .then(() => {
        alert("Usuario restringido agregado ✅");
        window.location.href = "http://localhost:3000/select-profile"; // Redirige a la página de selección de perfil
      })
      .catch((error) => {
        console.error("❌ Error al agregar usuario restringido:", error);
        alert("Error al agregar usuario restringido");
      });
  };

  return (
    <div className="container">
      <h2>Agregar Nuevo Usuario</h2>
      <input
        type="text"
        placeholder="Nombre Completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="PIN (6 dígitos)"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <h3>Selecciona un Avatar</h3>
      <div className="profiles-grid">
        {avatars.map((img) => (
          <div
            key={img}
            className="profile-card"
            onClick={() => setAvatar(img)}
          >
            <img
              src={`/avatars/${img}`}
              alt={img}
              className={`profile-avatar ${avatar === img ? "selected" : ""}`}
            />
          </div>
        ))}
      </div>

      <button onClick={handleAddUser}>Agregar Usuario</button>
    </div>
  );
};

export default AdminRestrictedUsers;
