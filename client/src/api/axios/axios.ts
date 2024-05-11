import axios, { AxiosInstance } from "axios";
import API_BASE_URL from "constants/constants";

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;