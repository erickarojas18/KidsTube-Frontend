// src/pages/Verify.jsx o donde manejes tus rutas

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verificando...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("Token no válido.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/verify?token=${token}`) // ← Cambia el puerto si tu backend está en otro
      .then((res) => {
        setStatus("Cuenta verificada con éxito. Redirigiendo...");
        setTimeout(() => navigate("/login"), 2000); // redirige al login después de 2s
      })
      .catch((err) => {
        console.error(err);
        setStatus("Hubo un problema al verificar tu cuenta.");
      });
  }, [location, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
};

export default Verify;
