import React from "react";
import { useNavigate } from "react-router-dom";
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
            </div>
        </div>
    );
};

export default Home;
