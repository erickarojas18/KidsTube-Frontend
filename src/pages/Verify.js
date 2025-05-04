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
      setStatus("❌ Token no válido.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/auth/verify?token=${token}`)
      .then((res) => {
        setStatus(`✅ ${res.data.message} Redirigiendo al login...`);
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        console.error("Error al verificar:", err);
        if (err.response?.data?.message) {
          setStatus(` ${err.response.data.message}`);
        } else {
          setStatus(" Ocurrió un error inesperado al verificar la cuenta.");
        }
      });
  }, [location, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
};

export default Verify;
