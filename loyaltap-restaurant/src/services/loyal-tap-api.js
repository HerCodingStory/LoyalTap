import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Create the Axios instance
export const api = axios.create({
    baseURL: 'http://localhost:5001'
});

// Add an interceptor to include the Firebase token in requests
api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Define API functions
export const createPassWithQR = (customerEmail, phone_number, name, points, goal) => {
    return api.post('/api/pass/google/generate-pass-with-qr', { customerEmail, phone_number, name, points, goal });
}
export const getAllCustomers = (headers) => {
    return api.get('/api/pass/google/all', { headers });
};

// Default export for grouped API functions
const loyalTapApi = {
    createPassWithQR,
    getAllCustomers,
};

export default loyalTapApi;
