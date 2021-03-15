import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
})

axiosInstance.interceptors.request.use((config) => {
    config.headers.AuthToken = process.env.REACT_APP_DEVZA_API_KEY;
    return config;
})

export default axiosInstance;
