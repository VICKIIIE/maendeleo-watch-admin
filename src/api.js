import axios from 'axios';
import { auth } from './config/firebase'; 

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("No Firebase user detected! The backend will likely reject this request with a 401.");
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;