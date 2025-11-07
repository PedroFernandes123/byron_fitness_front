import api from './api';
import { AuthResponse } from '../types';

/**
 * Autentica o usuário (Login)
 * Rota (TESTE): POST /users/login
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // Voltando para /users/login (baseado nos arquivos de rota)
  const { data } = await api.post('/users/login', { email, password });
  return data;
};

/**
 * Cadastra um novo usuário (Register)
 * Rota (TESTE): POST /users/register
 */
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Voltando para /users/register (baseado nos arquivos de rota)
  const { data } = await api.post('/users/register', { name, email, password });
  return data;
};

/**
 * Faz o logout do usuário
 * Rota (TESTE): POST /users/logout
 */
export const logout = async (): Promise<void> => {
  await api.post('/users/logout');
};