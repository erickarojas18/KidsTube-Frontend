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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Datos enviados:", formData);
    // Aquí iría la lógica para conectar con el backend (Ejemplo con fetch)
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Inicio de sesión exitoso 🎉");
      navigate("/"); // Redirige a la página principal
    } else {
      alert(data.message || "Usuario o contraseña inválida ❌");
    }
  };

  return (
    <AuthForm
      title="Iniciar Sesión"
      fields={[
        { label: "Correo Electrónico", type: "email", name: "email", value: formData.email, onChange: handleChange, required: true },
        { label: "Contraseña", type: "password", name: "password", value: formData.password, onChange: handleChange, required: true }
      ]}
      onSubmit={handleSubmit}
      buttonText="Ingresar"
    />
  );
};

export default Login;
