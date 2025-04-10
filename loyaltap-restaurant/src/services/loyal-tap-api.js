import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api', // TODO: replace when backend is deployed
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (email, password, name) => api.post('/auth/register', { email, password, name });

export const createPassWithQR = (customerEmail, points, goal) =>
    api.post('/pass/google/generate-pass-with-qr', { customerEmail, points, goal });

export default api;
