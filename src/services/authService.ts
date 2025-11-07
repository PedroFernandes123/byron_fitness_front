import api from './api';
import { AuthResponse } from '../types';

/**
 * Autentica o usuário (Login)
 * Rota (Provável): POST /usuarios/login
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // ATENÇÃO: Verifique no Swagger se a rota de login é /usuarios/login ou /sessoes
  // Mudamos de /users/login para /usuarios/login para seguir o padrão
  const { data } = await api.post('/usuarios/login', { email, password });
  return data;
};

/**
 * Cadastra um novo usuário (Register)
 * Rota (Confirmada): POST /usuarios/registrar
 */
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Mudamos de /users/register para /usuarios/registrar, conforme a imagem
  const { data } = await api.post('/usuarios/registrar', { name, email, password });
  return data;
};

export const logout = async (): Promise<void> => {
  // ATENÇÃO: Verifique no Swagger se a rota de logout é /usuarios/logout
  await api.post('/usuarios/logout');
};