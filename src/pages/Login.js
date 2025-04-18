import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../login.css"; // Importa el CSS

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      console.log("Datos enviados al backend:", formData);
  
      // Usar el servicio de autenticación
      const responseData = await loginUser(formData);
  
      if (responseData.error) {
        throw new Error(responseData.error || "Error en el login ❌");
      }
  
      console.log("Respuesta completa del backend:", responseData);
      
      // Si el login fue exitoso, redirigir a la página principal
      navigate("/");
    } catch (error) {
      console.error("Error en el login:", error);
      setError(error.message || "Error al iniciar sesión. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
