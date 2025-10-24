import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ATENÇÃO: Substitua pelo IP/URL do seu backend
const API_URL = 'http://SEU_BACKEND_URL/api'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@ByronFitness:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;