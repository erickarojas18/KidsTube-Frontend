import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css"; // Importa el CSS

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Login exitoso 🎉");
        localStorage.setItem("token", responseData.token);
        navigate("/home");
      } else {
        alert(responseData.message || "Error en el login ❌");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Hubo un problema con el servidor ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
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
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>

      

     
    </div>
    
  );
};

export default Login;
