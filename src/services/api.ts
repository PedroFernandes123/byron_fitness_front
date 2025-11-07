import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ATENÇÃO: /api foi REMOVIDO para este teste
const API_URL = 'http://192.168.3.155:3333'; 

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