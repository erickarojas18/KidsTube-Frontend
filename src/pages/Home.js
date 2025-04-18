import React from "react";
import { useNavigate } from "react-router-dom";
import "../home.css";
import { Button } from "react-bootstrap";

const Home = () => {
    const navigate = useNavigate();
    
    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="home-container">
            <div className="home-card">
                <h2 className="home-title">Bienvenido a KidsTube</h2>
                <p className="home-subtitle">Disfruta y gestiona el contenido de forma segura.</p>
                <div className="mt-4">
                    <Button variant="primary" onClick={handleLogin} className="me-2">
                        Iniciar Sesión
                    </Button>
                    <Button variant="outline-primary" onClick={() => navigate("/Register")}>
                        Registrarse
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
