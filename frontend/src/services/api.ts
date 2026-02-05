import axios from 'axios'
import { LOCAL_STORAGE_KEYS } from '../constants/localstorage';
import type { TokenInterface } from '../interfaces/UserInterface';


const api = axios.create({
    // baseURL: process.env.API_URL
    baseURL: 'http://127.0.0.1:8000/api/'
})

api.interceptors.request.use(config => {
    const userToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    if (userToken) {
        const token:TokenInterface = JSON.parse(userToken)
        config.headers.Authorization = `Bearer ${token.access_token}`;
    }

    return config;
})

export default api;