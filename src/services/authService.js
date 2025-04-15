const API_URL = "http://localhost:5000/api/auth"; // Ajusta según tu backend

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
        // Guardamos el usuario o token (depende cómo responde el backend)
        localStorage.setItem("user", JSON.stringify(data.user)); // ajusta según tu backend
    }

    return data;
};

export const logoutUser = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};
