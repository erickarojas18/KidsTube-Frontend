import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Error en el login ❌");
      }
  
      console.log("Respuesta completa del backend:", responseData);
      console.log("Usuario recibido:", responseData.user);
  
      // Guardar datos en localStorage
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
  
      // Extraer el userId de forma flexible
      const userId = responseData.user?._id || responseData.user?.id || null;
      if (userId) {
        localStorage.setItem("userId", userId);
        console.log("User ID guardado en localStorage:", userId);
      } else {
        console.warn("No se encontró _id ni id en el usuario.");
      }
  
      // Redirigir a AdminRestricted
      navigate("/AdminRestricted");
    } catch (error) {
      setError(error.message);
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
