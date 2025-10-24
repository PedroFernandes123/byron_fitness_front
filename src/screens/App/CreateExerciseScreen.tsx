import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet, // 1. Importação do StyleSheet
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInputProps, // Importação para a tipagem
} from 'react-native';
import { useForm, Controller, Control } from 'react-hook-form'; // Importação do Control
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

// 2. Início da função do componente
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

  // Mutação para criar o exercício
  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      exerciseService.createExercise(workoutId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout', workoutId] });
      navigation.goBack();
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

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    createMutation.mutate(data);
  };

  // Define os tipos para o FormInput
  interface FormInputProps extends TextInputProps {
    name: keyof FormData;
    label: string;
    control: Control<FormData>;
    rules?: Object;
  }

  // Componente de Input reutilizável (tipado)
  const FormInput = ({ name, label, control, rules = {}, ...props }: FormInputProps) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}:</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            // Aplica estilo diferente para o campo 'description'
            style={name === 'description' ? styles.inputDescription : styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
        )}
      />
      {errors[name] && <Text style={styles.error}>{errors[name]!.message}</Text>}
    </View>
  );


  // 3. Início do return (JSX)
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader canGoBack={true} />
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Criar Exercício</Text>

        <FormInput
          name="name"
          label="Nome"
          control={control}
          rules={{ required: 'Nome é obrigatório' }}
          placeholder="Ex: Puxada alta"
        />
        <FormInput name="load" label="Carga" control={control} />
        <FormInput name="member" label="Membro" control={control} />
        <FormInput name="rest" label="Intervalo" control={control} />
        <FormInput name="reps" label="Repetições" control={control} />
        <FormInput
          name="description"
          label="Descrição"
          control={control}
          multiline
          numberOfLines={3}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.buttonTextCancel}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCreate]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonTextCreate}>Criar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView> 
  );
} // 4. Fim da função do componente

// 5. O BLOCO DE ESTILOS QUE ESTAVA FALTANDO
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 18,
    paddingVertical: 8,
    width: '100%',
  },
  inputDescription: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    padding: 10,
    textAlignVertical: 'top', // Para Android
    height: 100,
    borderRadius: 5,
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 50,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonCancel: {
    backgroundColor: '#f0f0f0',
  },
  buttonTextCancel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonCreate: {
    backgroundColor: '#007AFF', // Azul
  },
  buttonTextCreate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});