import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import countries from "world-countries";
import "../register.css";

const countryOptions = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    pin: "",
    name: "",
    lastname: "",
    country: "",
    birthdate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country: selectedOption.label }); // o .value si prefieres el código
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }

    const birthDate = new Date(formData.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      alert("Debes ser mayor de 18 años para registrarte ❌");
      return;
    }

    if (!/^\d{6}$/.test(formData.pin)) {
      alert("El PIN debe tener exactamente 6 dígitos ❌");
      return;
    }

    if (!/^\+?\d{8,15}$/.test(formData.phone)) {
      alert("El número de teléfono debe tener entre 8 y 15 dígitos");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          pin: formData.pin,
          name: formData.name,
          lastname: formData.lastname,
          country: formData.country,
          birthdate: formData.birthdate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso, verifique su correo. 🎉");
        navigate("/login");
      } else {
        alert(data.message || "Error en el registro ❌");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un problema con el servidor ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Registro</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repetir Contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Número Telefónico"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              name="pin"
              placeholder="PIN (6 dígitos)"
              value={formData.pin}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="lastname"
              placeholder="Apellidos"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
            <Select
              name="country"
              options={countryOptions}
              value={countryOptions.find(option => option.label === formData.country)}
              onChange={handleCountryChange}
              placeholder="Selecciona un país..."
              isSearchable
              className="country-select"
              classNamePrefix="react-select"
            />

          </div>
          <div className="form-row">
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
