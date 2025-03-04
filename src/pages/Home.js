import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h2>Pantalla de Inicio</h2>
            <button onClick={() => navigate("/gestion-videos")}>Administración</button>
            <button onClick={() => navigate("/videos")}>Gestión de videos</button>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
};

export default Home;
