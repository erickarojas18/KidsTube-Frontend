import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../login.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            console.log("Datos enviados al backend:", formData);
    
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                console.error("❌ No se pudo parsear JSON:", parseError);
                throw new Error("Respuesta inesperada del servidor");
            }
    
            if (!response.ok) {
                throw new Error(data.message || 'Error en el login ❌');
            }
    
            console.log("✅ Respuesta completa del backend:", data);
    
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user._id);
            navigate('/select-profile');
        } catch (error) {
            console.error('Error en el login:', error);
            setError(error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {error && <p className="error-message">{error}</p>}
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
                    <button type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
