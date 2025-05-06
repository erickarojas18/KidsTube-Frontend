import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import "../selectProfile.css";

const GET_RESTRICTED_USERS = gql`
  query GetRestrictedUsers($parentUser: ID!) {
    restrictedUsers(parentUser: $parentUser) {
      id
      name
      avatar
    }
  }
`;

const SelectProfile = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Consulta GraphQL con Apollo Client
  const { data, loading, error: gqlError } = useQuery(GET_RESTRICTED_USERS, {
    variables: { parentUser: userId },
    skip: !userId,
  });

  const profiles = data?.restrictedUsers || [];

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
        const response = await fetch("http://localhost:5000/api/restricted-users/validate-pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedProfile.id,
            pin,
          }),
        });

        const result = await response.json();
        if (result.message === "PIN válido") {
          localStorage.setItem("selectedUserId", selectedProfile.id);
          setShowPinModal(false);
          navigate(redirectPath);
        } else {
          setError("PIN incorrecto. Por favor, intente nuevamente ❌");
        }
      } else {
        const response = await fetch("http://localhost:5000/api/admin/validate-pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });

        const result = await response.json();
        if (result.isValid) {
          setShowPinModal(false);
          navigate(redirectPath);
        } else {
          setError("PIN incorrecto. Por favor, intente nuevamente ❌");
        }
      }
    } catch (err) {
      console.error("❌ Error al validar el PIN:", err);
      setError("PIN incorrecto. Por favor, intente nuevamente ❌");
    }
  };

  return (
    <div className="container">
      <h2>Selecciona un perfil</h2>

      {loading ? (
        <p>Cargando perfiles...</p>
      ) : gqlError ? (
        <p>Error al cargar los perfiles: {gqlError.message}</p>
      ) : profiles.length === 0 ? (
        <p>No se han creado perfiles aún. Por favor, agrega un perfil.</p>
      ) : (
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div
              key={profile.id}
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
        <button className="circle-btn" onClick={() => navigate("/new-profile")}>➕</button>
        <button className="circle-btn" onClick={handleAdminProfilesClick}>⚙️</button>
        <button className="circle-btn" onClick={handleAdminClick}>📂</button>
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
                <button className="btn validate" onClick={handlePinSubmit}>Validar</button>
                <button className="btn cancel" onClick={() => setShowPinModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectProfile;
