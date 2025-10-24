export interface Exercise {
  id: string;
  name: string;      // Ex: "Puxada alta"
  load: string;      // Ex: "Carga:"
  member: string;    // Ex: "Membro:"
  rest: string;      // Ex: "Intervalo:"
  reps: string;      // Ex: "Repetições:"
  description: string;// Ex: "Descrição:"
}

export interface Workout {
  id: string;
  name: string;     // Ex: "Treino A"
  exercises: Exercise[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}