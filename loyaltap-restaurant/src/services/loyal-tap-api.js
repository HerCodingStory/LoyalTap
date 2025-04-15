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

const createPassWithQR = (customerEmail, points, goal) => {
    return api.post('/api/pass/google/generate-pass-with-qr', {
        customerEmail,
        points,
        goal,
    });
};

export { createPassWithQR };

export default api;
