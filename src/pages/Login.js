import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event, data) => {
    event.preventDefault(); // Ahora se llama correctamente
  
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Ahora se usa 'data' en vez de 'formData'
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
    <AuthForm
      title="Iniciar Sesión"
      fields={[
        { label: "Correo Electrónico", type: "email", name: "email", value: formData.email, onChange: handleChange, required: true },
        { label: "Contraseña", type: "password", name: "password", value: formData.password, onChange: handleChange, required: true },
      ]}
      onSubmit={handleSubmit}
      buttonText="Iniciar Sesión"
    />
  );
};

export default Login;
