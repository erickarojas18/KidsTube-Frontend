import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    pin: "",
    firstName: "",
    lastName: "",
    country: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, formData) => { //  Evita conflicto con 'data'
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden ❌");
        return;
    }

    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      alert("Debes ser mayor de 18 años para registrarte ❌");
      return;
    }

    const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registro exitoso 🎉");
      navigate("/login");
    } else {
      alert(data.message || "Error en el registro ❌");
    }
  };

  return (
    <AuthForm
      title="Registro"
      fields={[
        { label: "Correo Electrónico", type: "email", name: "email", value: formData.email, onChange: handleChange, required: true },
        { label: "Contraseña", type: "password", name: "password", value: formData.password, onChange: handleChange, required: true },
        { label: "Repetir Contraseña", type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, required: true },
        { label: "Número Telefónico", type: "tel", name: "phone", value: formData.phone, onChange: handleChange, required: true },
        { label: "PIN (6 dígitos)", type: "password", name: "pin", value: formData.pin, onChange: handleChange, required: true },
        { label: "Nombre", type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, required: true },
        { label: "Apellidos", type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, required: true },
        { label: "País", type: "text", name: "country", value: formData.country, onChange: handleChange, required: false },
        { label: "Fecha de Nacimiento", type: "date", name: "birthDate", value: formData.birthDate, onChange: handleChange, required: true },
      ]}
      onSubmit={handleSubmit}
      buttonText="Registrarse"
    />
  );
};

export default Register;
