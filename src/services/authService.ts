import api from './api';
import { AuthResponse } from '../types';

/**
 * Autentica o usuário (Login)
 * Rota: POST /sessions
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post('/sessions', { email, password });
  return data;
};

/**
 * Cadastra um novo usuário (Register)
 * Rota: POST /users
 */
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post('/users', { name, email, password });
  return data;
};