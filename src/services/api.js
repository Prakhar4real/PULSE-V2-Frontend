import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', 
});

// 1. Attaches the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Expired Token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Token expired. Logging out...");
            
            // Clear the stale data
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            
            // Force redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;