import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../login.css";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [smsCode, setSmsCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSmsVerified, setIsSmsVerified] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSmsCodeChange = (e) => {
        setSmsCode(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el login ❌');
            }

            localStorage.setItem('userId', data.userId);
            setIsSmsVerified(true);
        } catch (error) {
            console.error('Error en el login:', error);
            setError(error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSmsVerification = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/api/auth/verify-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, code: smsCode })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Código incorrecto ❌');
            }

            console.log("✅ Código verificado correctamente.");
            navigate('/select-profile');
        } catch (error) {
            console.error('Error en la verificación de SMS:', error);
            setError(error.message || 'Error al verificar el código. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error con el login de Google ❌');
            }

            localStorage.setItem('userId', data.userId);
            navigate('/select-profile');
        } catch (error) {
            console.error("Error en Google Login:", error);
            setError(error.message || 'Fallo en el login con Google');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {error && <p className="error-message">{error}</p>}

                {!isSmsVerified ? (
                    <>
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

                        <div style={{ margin: '20px 0' }}>
                            <p style={{ textAlign: 'center' }}>o</p>
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    if (!credentialResponse.credential) {
                                        setError("Token de Google no proporcionado");
                                        return;
                                    }
                                    handleGoogleSuccess(credentialResponse);
                                }}
                                onError={() => {
                                    setError("Error al iniciar sesión con Google");
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSmsVerification}>
                        <input
                            type="text"
                            name="smsCode"
                            placeholder="Código SMS"
                            value={smsCode}
                            onChange={handleSmsCodeChange}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Verificando...' : 'Verificar Código'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
