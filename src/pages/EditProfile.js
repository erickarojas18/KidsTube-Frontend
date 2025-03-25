import React, { useState } from 'react';

const EditProfile: React.FC = () => {
  const [pin, setPin] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatars, setAvatars] = useState(['avatar1.png', 'avatar2.png', 'avatar3.png']);

  const handleUpdateUser = () => {
    // Implementa la lógica para actualizar el usuario aquí
  };

  return (
    <div className="edit-profile-container">
      <input
        type="password"
        placeholder="PIN (6 dígitos)"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <div className="avatars-container">
        <div className="avatars-title">Seleccionar Avatar</div>
        <div className="avatar-grid">
          {avatars.map((img) => (
            <div
              key={img}
              className="avatar-option"
              onClick={() => setAvatar(img)}
            >
              <img
                src={`/avatars/${img}`}
                alt={img}
                className={avatar === img ? "selected" : ""}
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleUpdateUser}>Guardar Cambios</button>
    </div>
  );
};

export default EditProfile; 