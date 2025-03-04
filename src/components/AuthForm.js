import React, { useState } from "react";

const AuthForm = ({ onSubmit, fields, buttonText }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita la recarga de la página
    onSubmit(e,formData); // 🔥 Ahora pasamos los datos, no el evento
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {fields.map((field) => (
        <div key={field.name}>
          <label>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            required={field.required}
          />
        </div>
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default AuthForm;
