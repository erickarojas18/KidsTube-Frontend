import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from '../services/authService';
import { Container, Alert, Spinner } from 'react-bootstrap';

const VerifyEmail = () => {
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                // Obtener el token de la URL
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (!token) {
                    setStatus('error');
                    setMessage('Token de verificación no encontrado');
                    return;
                }

                // Verificar el correo electrónico
                const response = await verifyEmail(token);
                
                if (response.message === 'Cuenta verificada con éxito') {
                    setStatus('success');
                    setMessage('Tu cuenta ha sido verificada con éxito. Serás redirigido al inicio de sesión en unos segundos.');
                    
                    // Redirigir al inicio de sesión después de 3 segundos
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Error al verificar tu cuenta');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Error al verificar tu cuenta. Por favor, intenta nuevamente.');
                console.error('Error al verificar correo:', error);
            }
        };

        verifyUserEmail();
    }, [location, navigate]);

    return (
        <Container className="mt-5">
            {status === 'loading' && (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="mt-3">Verificando tu cuenta...</p>
                </div>
            )}

            {status === 'success' && (
                <Alert variant="success">
                    <Alert.Heading>¡Verificación exitosa!</Alert.Heading>
                    <p>{message}</p>
                </Alert>
            )}

            {status === 'error' && (
                <Alert variant="danger">
                    <Alert.Heading>Error de verificación</Alert.Heading>
                    <p>{message}</p>
                    <hr />
                    <p className="mb-0">
                        Si el problema persiste, por favor contacta al soporte técnico.
                    </p>
                </Alert>
            )}
        </Container>
    );
};

export default VerifyEmail; 