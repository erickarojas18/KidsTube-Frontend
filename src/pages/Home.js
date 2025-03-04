import React from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import "../home.css";

const Home = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="home-container">
            <div className="home-card">
                <h2 className="home-title">Bienvenido a YouTube Kids</h2>
                <p className="home-subtitle">Disfruta y gestiona el contenido de forma segura.</p>
                <div className="home-buttons">
                    <button className="home-button admin" onClick={() => navigate("/gestion-videos")}>
                        <FaUserCog />
                        <span>Administración</span>
                    </button>
                    <button className="home-button videos" onClick={() => navigate("/videos")}>
                        <FaVideo />
                        <span>Gestión de Videos</span>
                    </button>
                    <button className="home-button logout" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
