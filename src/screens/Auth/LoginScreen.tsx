import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AppHeader } from '../../components/AppHeader'; // Importa o Header

// Define os tipos para o formulário
type FormData = {
  email: string;
  password: string;
};

// Define o tipo das props da rota
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// A função do componente começa aqui
export default function LoginScreen({ navigation }: Props) {
  // --- Lógica do Componente ---
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      // O RootNavigator cuidará da mudança de tela
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'E-mail ou senha inválidos.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // --- Fim da Lógica ---

  // --- Parte Visual (JSX) ---
  // O 'return' deve estar no nível principal da função LoginScreen
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Header baseado na "Pagina login.pdf" (título customizado) */}
          <AppHeader title="Fitness" />

          <Text style={styles.title}>LOGIN</Text>

          <View style={styles.form}>
            {/* Campo E-mail */}
            <Text style={styles.label}>e-mail:</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'E-mail inválido',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            {/* Campo Senha */}
            <Text style={styles.label}>Senha:</Text>
            <Controller
              control={control}
              name="password"
              rules={{ required: 'Senha é obrigatória' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            {/* Botão OK */}
            <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isLoading} style={styles.button}>
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>OK</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Espaçador para manter o layout centralizado */}
          <View /> 
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} // --- Fim da função LoginScreen ---

// Os estilos são definidos fora da função do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // 'space-around' para centralizar verticalmente
    justifyContent: 'space-around', 
    minHeight: '100%', // Garante que o scroll ocupe a tela
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  form: {
    width: '80%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginTop: 15,
  },
  input: {
    // Linha inferior para usabilidade, mantendo o design minimalista
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 18,
    paddingVertical: 8,
    width: '100%',
  },
  button: {
    marginTop: 40,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  error: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
});