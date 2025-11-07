// src/screens/Auth/LoginScreen.tsx
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
  StatusBar, // Importar a StatusBar
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AppHeader } from '../../components/AppHeader';

// Define os tipos para o formulário
type FormData = {
  email: string;
  password: string;
};

// Define o tipo das props da rota
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  // --- Lógica (inalterada) ---
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'E-mail ou senha inválidos.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // --- Fim da Lógica ---

  return (
    <KeyboardAvoidingView
      // 1. Mudar o 'style' principal para o fundo preto
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 2. Mudar a StatusBar para 'light-content' (relógio e bateria brancos) */}
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* 3. Passar as novas props de cor para o Header */}
          <AppHeader 
            title="Fitness" 
            backgroundColor="red" 
            textColor="#fff"
            borderBottomColor="red" // Cor da borda igual ao fundo
          />

          <Text style={styles.title}>LOGIN</Text>

          <View style={styles.form}>
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
                  placeholder="seu@email.com"
                  placeholderTextColor="#777" // Cor do placeholder
                />
              )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

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
                  placeholder="******"
                  placeholderTextColor="#777" // Cor do placeholder
                />
              )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isLoading} style={styles.button}>
              {isLoading ? (
                <ActivityIndicator color="#fff" /> // Indicador branco
              ) : (
                <Text style={styles.buttonText}>OK</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View /> 
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 4. ATUALIZAR TODOS OS ESTILOS PARA O TEMA ESCURO
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fundo preto
    alignItems: 'center',
    justifyContent: 'space-around', 
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#fff', // Texto branco
  },
  form: {
    width: '80%',
  },
  label: {
    fontSize: 16,
    color: '#eee', // Texto branco (suave)
    marginTop: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#555', // Borda cinza escura
    fontSize: 18,
    paddingVertical: 8,
    width: '100%',
    color: '#fff', // Texto do input branco
  },
  button: {
    marginTop: 40,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff', // Texto do botão branco
  },
  error: {
    color: 'red', // Erro vermelho (funciona em fundo preto)
    marginTop: 5,
    fontSize: 12,
  },
});