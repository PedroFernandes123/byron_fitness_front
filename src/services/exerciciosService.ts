import api from './api';
import { Exercise } from '../types';

/**
 * Busca a biblioteca completa de exercícios (para filtragem).
 * Rota (Confirmada): GET /exercises
 */
export const getLibraryExercises = async (): Promise<Exercise[]> => {
  // Baseado no arquivo exerciseRoutes.ts anterior
  const { data } = await api.get('/exercises');
  return data;
};

/**
 * Cria um novo exercício DENTRO de um treino específico.
 * Rota (Confirmada): POST /workouts/:workoutId/exercises
 */
export const createExercise = async (
  workoutId: string,
  exerciseData: Omit<Exercise, 'id'>
): Promise<Exercise> => {
  // O arquivo workoutRoutes.ts aninha as rotas em '/:workoutId/exercises'
  // O verbo (POST) é definido em workoutExercise.routes.js (não fornecido, mas é o padrão)
  const { data } = await api.post(
    `/workouts/${workoutId}/exercises`,
    exerciseData
  );
  return data;
};

/**
 * Atualiza um exercício existente.
 * Rota (Provável): PUT /workouts/:workoutId/exercises/:exerciseId
 */
export const updateExercise = async (
  workoutId: string, // Precisamos do workoutId para a rota
  exerciseId: string,
  exerciseData: Partial<Omit<Exercise, 'id'>>
): Promise<Exercise> => {
  // Esta rota segue o padrão RESTful aninhado.
  // Você precisará confirmar o :exerciseId em 'workoutExercise.routes.js'
  const { data } = await api.put(
    `/workouts/${workoutId}/exercises/${exerciseId}`,
    exerciseData
  );
  return data;
};

/**
 * Exclui um exercício.
 * Rota (Provável): DELETE /workouts/:workoutId/exercises/:exerciseId
 */
export const deleteExercise = async (
  workoutId: string, // Precisamos do workoutId para a rota
  exerciseId: string
): Promise<void> => {
  // Esta rota segue o padrão RESTful aninhado.
  // Você precisará confirmar o :exerciseId em 'workoutExercise.routes.js'
  await api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
};