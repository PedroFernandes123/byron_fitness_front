import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import { User, AuthResponse } from '../types';
import api from '../services/api';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = await AsyncStorage.getItem('@ByronFitness:token');
      const storedUser = await AsyncStorage.getItem('@ByronFitness:user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Re-aplica o token no header do Axios caso o app tenha sido fechado
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      setIsLoading(false);
    }
    loadStorageData();
  }, []);

  const handleAuthResponse = async ({ token, user }: AuthResponse) => {
    await AsyncStorage.setItem('@ByronFitness:token', token);
    await AsyncStorage.setItem('@ByronFitness:user', JSON.stringify(user));

    setToken(token);
    setUser(user);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const signIn = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    await handleAuthResponse(response);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password);
    // Auto-login após o registro
    await handleAuthResponse(response);
  };

  const signOut = async () => {
  // Tenta fazer o logout no backend
  try {
    await authService.logout(); // <-- A linha adicionada
  } catch (error) {
    console.error("Erro ao fazer logout no servidor:", error);
    // Mesmo se falhar, continua o logout local
  }

  // Limpa o local
  await AsyncStorage.removeItem('@ByronFitness:token');
  await AsyncStorage.removeItem('@ByronFitness:user');
  setUser(null);
  setToken(null);
  delete api.defaults.headers.common['Authorization'];
};

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;