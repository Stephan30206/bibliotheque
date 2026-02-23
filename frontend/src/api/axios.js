// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        const { status } = error.response || {};
        console.error('Erreur API:', status, error.response?.data);

        if (status === 403) {
            console.warn('Accès refusé ou Token expiré (403). Déconnexion forcée...');
            localStorage.clear();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?expired=true';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
