import api from './api';
import { AuthResponse } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // ATENÇÃO: O endpoint '/login' é uma suposição. 
  // Verifique no seu backend a rota correta.
  const { data } = await api.post('/login', { email, password });
  return data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // ATENÇÃO: O endpoint '/register' é uma suposição.
  const { data } = await api.post('/register', { name, email, password });
  return data;
};