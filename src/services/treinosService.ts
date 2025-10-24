import api from './api';
import { Workout } from '../types';

/**
 * Busca a lista de treinos do usuário.
 * Rota (Confirmada): GET /workouts
 */
export const getWorkouts = async (): Promise<Workout[]> => {
  // O arquivo workoutRoutes.ts define a rota GET '/'
  // O router principal monta em '/workouts'
  const { data } = await api.get('/workouts');
  return data;
};

/**
 * Busca os detalhes de um treino específico (incluindo seus exercícios).
 * Rota (Confirmada): GET /workouts/:id
 */
export const getWorkoutDetails = async (id: string): Promise<Workout> => {
  // O arquivo workoutRoutes.ts define a rota GET '/:id'
  const { data } = await api.get(`/workouts/${id}`);
  return data;
};

/**
 * Cria um novo treino.
 * Rota (Confirmada): POST /workouts
 */
export const createWorkout = async (name: string): Promise<Workout> => {
  // O arquivo workoutRoutes.ts define a rota POST '/'
  const { data } = await api.post('/workouts', { name });
  return data;
};

/**
 * Atualiza o nome de um treino existente.
 * Rota (Confirmada): PUT /workouts/:id
 */
export const updateWorkout = async (id: string, name: string): Promise<Workout> => {
  // O arquivo workoutRoutes.ts define a rota PUT '/:id'
  const { data } = await api.put(`/workouts/${id}`, { name });
  return data;
};


 //Exclui um treino.

export const deleteWorkout = async (id: string): Promise<void> => {
  // O arquivo workoutRoutes.ts define a rota DELETE '/:id'
  await api.delete(`/workouts/${id}`);
};