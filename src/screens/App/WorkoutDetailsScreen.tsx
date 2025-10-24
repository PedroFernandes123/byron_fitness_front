import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as workoutService from '../../services/treinosService';
import * as exerciseService from '../../services/exerciciosService';
import { Exercise } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { AppHeader } from '../../components/AppHeader';

// Pega os tipos de props da rota
type Props = NativeStackScreenProps<AppStackParamList, 'WorkoutDetails'>;

export default function WorkoutDetailsScreen({ navigation, route }: Props) {
  const queryClient = useQueryClient();
  const { workoutId, workoutName } = route.params; // Pega os dados passados da HomeScreen

  // 1. READ: Busca os detalhes do treino (incluindo a lista de exercícios)
  const {
    data: workout,
    isLoading,
    isError,
  } = useQuery<Workout>({ // Informa o tipo <Workout>
    queryKey: ['workout', workoutId], // Chave única para este treino
    queryFn: () => workoutService.getWorkoutDetails(workoutId),
  });

  // 2. DELETE (Exercício): Mutação para deletar um exercício
  const deleteMutation = useMutation({
    mutationFn: (exerciseId: string) =>
      exerciseService.deleteExercise(workoutId, exerciseId),
    onSuccess: () => {
      // Invalida a query para forçar o refetch da lista
      queryClient.invalidateQueries({ queryKey: ['workout', workoutId] });
      Alert.alert('Sucesso', 'Exercício excluído.');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível excluir o exercício.');
    },
  });

  const handleDeleteExercise = (exerciseId: string) => {
    Alert.alert(
      'Excluir Exercício',
      'Tem certeza que deseja excluir este exercício?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(exerciseId),
        },
      ]
    );
  };

  // Renderiza a tela de Loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader canGoBack={true} />
        <ActivityIndicator style={{ flex: 1 }} />
      </View>
    );
  }

  // Renderiza a tela de Erro
  if (isError || !workout) {
    return (
      <View style={styles.container}>
        <AppHeader canGoBack={true} />
        <Text style={styles.errorText}>Erro ao carregar o treino.</Text>
      </View>
    );
  }

  // Renderiza cada card de exercício
  const renderExercise = ({ item }: { item: Exercise }) => (
    <View style={styles.exerciseCard}>
      <TouchableOpacity
        style={styles.cardContent}
        // Navega para a tela de Edição passando o exercício
        onPress={() =>
          navigation.navigate('EditExercise', {
            workoutId: workoutId,
            exercise: item,
          })
        }
      >
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDetail}>Carga: {item.load} | Reps: {item.reps}</Text>
        <Text style={styles.exerciseDetail}>Membro: {item.member} | Intervalo: {item.rest}</Text>
      </TouchableOpacity>
      
      {/* Botão de excluir (ícone ம் do design) */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExercise(item.id)}
      >
        <Text style={styles.deleteIcon}>ம்</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* O design 'Pagina Treino.pdf' não tem seta, mas a navegação exige */}
      <AppHeader canGoBack={true} />

      <View style={styles.contentContainer}>
        {/* Título do Treino (ex: "Treino A") */}
        <Text style={styles.pageTitle}>{workoutName}</Text>
        
        <FlatList
          data={workout.exercises} // Usa os exercícios do treino
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            // Botão "+ Exercício" (conforme 'Pagina Treino.pdf')
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateExercise', { workoutId: workoutId })
              }
            >
              <Text style={styles.newButton}>+ Exercício</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20, // Espaço após o header
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  deleteIcon: {
    fontSize: 24, // Tamanho do ícone de lixeira
    color: 'red',
  },
  newButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
    marginBottom: 50,
    alignSelf: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});