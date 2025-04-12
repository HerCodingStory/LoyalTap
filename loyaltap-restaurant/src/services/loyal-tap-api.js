import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
    baseURL: 'http://localhost:5001/api'
});

api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// export const login = (email, password) => api.post('/auth/login', { email, password });
// export const register = (email, password, name) => api.post('/auth/register', { email, password, name });

export const createPassWithQR = (customerEmail, points, goal) =>
    api.post('/pass/google/generate-pass-with-qr', { customerEmail, points, goal });

export default api;
