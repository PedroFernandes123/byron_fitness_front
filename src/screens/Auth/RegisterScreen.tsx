import React, { useState, useRef } from 'react';
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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Observa o valor da senha para a validação de confirmação
  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await signUp(data.name, data.email, data.password);
      // O RootNavigator cuidará da mudança de tela
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Não foi possível criar a conta.';
      Alert.alert('Erro no Cadastro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView + ScrollView evitam que o teclado cubra os inputs
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Header baseado na "Pagina Cadastro.pdf" [cite: 47] */}
          <AppHeader title="BYRON Fitness" />

          <Text style={styles.title}>Cadastro</Text> [cite: 48]

          <View style={styles.form}>
            {/* Campo Nome  */}
            <Text style={styles.label}>Nome:</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

            {/* Campo E-mail  */}
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

            {/* Campo Senha  */}
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

            {/* Campo Confirme sua senha  */}
            <Text style={styles.label}>Confirme sua senha:</Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Confirmação é obrigatória',
                validate: value =>
                  value === password.current || 'As senhas não coincidem',
              }}
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
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword.message}</Text>
            )}

            {/* Botão OK [cite: 53] */}
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
}

// Estilos seguindo o padrão da LoginScreen e do PDF
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
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