import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  // 1. Importar TextInputProps
  TextInputProps,
} from 'react-native';
// 1. Importar Control
import { useForm, Controller, Control } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as exerciseService from '../../services/exerciciosService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { AppHeader } from '../../components/AppHeader';

// Define os tipos para o formulário
type FormData = {
  name: string;
  load: string;
  member: string;
  rest: string;
  reps: string;
  description: string;
};

type Props = NativeStackScreenProps<AppStackParamList, 'CreateExercise'>;

export default function CreateExerciseScreen({ navigation, route }: Props) {
  const queryClient = useQueryClient();
  const { workoutId } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      load: '',
      member: '',
      rest: '',
      reps: '',
      description: '',
    },
  });

  // 1. CREATE: Mutação para criar o exercício
  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      exerciseService.createExercise(workoutId, data),
    onSuccess: () => {
      // Invalida a query para forçar o refetch na tela anterior
      queryClient.invalidateQueries({ queryKey: ['workout', workoutId] });
      navigation.goBack(); // Volta para a tela WorkoutDetails
    },
    onError: (error: any) => {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Não foi possível criar o exercício.';
      Alert.alert('Erro', errorMessage);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  // Função chamada ao pressionar "Criar"
  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    createMutation.mutate(data);
  };

  // 2. Definir a interface de Props para o FormInput
  interface FormInputProps extends TextInputProps {
    name: keyof FormData; // Garante que 'name' é uma chave válida
    label: string;
    control: Control<FormData>; // Define o tipo do 'control'
    rules?: Object;
  }

  // 3. Componente de Input reutilizável (agora tipado)
  const FormInput = ({ name, label, control, rules = {}, ...props }: FormInputProps) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}:</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={name === 'description' ? styles.inputDescription : styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
        )}
      />
      {/* Esta linha agora é segura */}
      {errors[name] && <Text style={styles.error}>{errors[name]!.message}</Text>}
    </View>
  );


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader canGoBack={true} />
      <ScrollView style={styles.container}>
        {/* Título do Treino (ex: "Treino A