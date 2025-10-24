import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as workoutService from '../../services/treinosService';
import { Workout } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';

// Importa o Header e o hook de autenticação
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../hooks/useAuth';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const { signOut } = useAuth(); // Hook para o botão Sair

  // --- Estados para o Modal de Criar/Editar ---
  const [isModalVisible, setModalVisible] = useState(false);
  // Se 'editingWorkout' estiver setado, o modal está em modo de EDIÇÃO.
  // Se for 'null', está em modo de CRIAÇÃO.
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  // Estado para o valor do input de texto
  const [workoutName, setWorkoutName] = useState('');
  // ---------------------------------------------

  // 1. READ (Buscar dados)
  // Adicionamos <Workout[]> para corrigir o erro do FlatList
  const { data: workouts, isLoading, isError } = useQuery<Workout[]>({
    queryKey: ['workouts'],
    queryFn: workoutService.getWorkouts,
  });

  // 2. DELETE (Mutação para deletar)
  const deleteMutation = useMutation({
    mutationFn: workoutService.deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      Alert.alert('Sucesso', 'Treino excluído.');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível excluir o treino.');
    },
  });

  // 3. CREATE (Mutação para criar)
  const createMutation = useMutation({
    mutationFn: workoutService.createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      handleCloseModal(); // Fecha o modal
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível criar o treino.');
    },
  });

  // 4. UPDATE (Mutação para atualizar)
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      workoutService.updateWorkout(data.id, data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      handleCloseModal(); // Fecha o modal
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível atualizar o treino.');
    },
  });

  // --- Funções de Manipulação do Modal ---

  // Abre o modal para CRIAR um novo treino
  const handleOpenCreateModal = () => {
    setEditingWorkout(null);
    setWorkoutName('');
    setModalVisible(true);
  };

  // Abre o modal para EDITAR um treino existente
  const handleOpenEditModal = (workout: Workout) => {
    setEditingWorkout(workout);
    setWorkoutName(workout.name);
    setModalVisible(true);
  };

  // Fecha o modal e reseta os estados
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingWorkout(null);
    setWorkoutName('');
  };

  // Chamado ao pressionar "OK" no modal
  const handleSave = () => {
    if (!workoutName.trim()) {
      Alert.alert('Erro', 'O nome do treino é obrigatório.');
      return;
    }

    if (editingWorkout) {
      // Modo EDIÇÃO
      updateMutation.mutate({ id: editingWorkout.id, name: workoutName.trim() });
    } else {
      // Modo CRIAÇÃO
      createMutation.mutate(workoutName.trim());
    }
  };

  // --- Funções de Renderização ---

  // Mostra um loading centralizado enquanto o header já está visível
  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* 'Pagina inicial.pdf' mostra a seta de voltar */}
        <AppHeader canGoBack={true} /> 
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <AppHeader canGoBack={true} />
        <Text style={styles.errorText}>Erro ao carregar treinos.</Text>
      </View>
    );
  }

  // Renderiza cada item da lista de treinos
  const renderWorkout = ({ item }: { item: Workout }) => (
    <View style={styles.workoutCard}>
      <TouchableOpacity
        style={styles.workoutTitleArea}
        onPress={() =>
          navigation.navigate('WorkoutDetails', {
            workoutId: item.id,
            workoutName: item.name,
          })
        }
      >
        <Text style={styles.workoutTitle}>{item.name}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        {/* Botão Editar agora abre o modal */}
        <TouchableOpacity onPress={() => handleOpenEditModal(item)}>
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteMutation.mutate(item.id)}>
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Adicionado (conforme Pagina inicial.pdf) */}
      <AppHeader canGoBack={true} />

      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Meus treinos:</Text>
        <FlatList
          data={workouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <>
              {/* Botão "Novo treino +" agora abre o modal */}
              <TouchableOpacity onPress={handleOpenCreateModal}>
                <Text style={styles.newWorkoutButton}>Novo treino +</Text>
              </TouchableOpacity>
              
              {/* Botão de Sair (Logout) Adicionado */}
              <TouchableOpacity onPress={signOut}>
                <Text style={styles.logoutButton}>Sair</Text>
              </TouchableOpacity>
            </>
          }
        />
      </View>

      {/* Modal de Criar/Editar (conforme Editando nome treino.pdf) */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingWorkout ? 'Editar Treino' : 'Novo Treino'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do Treino"
              value={workoutName}
              onChangeText={setWorkoutName}
              autoFocus={true}
            />
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={styles.modalButton}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.modalButton, styles.modalButtonOK]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// --- Estilos ---
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20, // Espaço após o header
  },
  workoutCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitleArea: { flex: 1 },
  workoutTitle: { fontSize: 18 },
  actions: { flexDirection: 'row' },
  actionText: { fontSize: 14, color: '#555', marginLeft: 15 },
  newWorkoutButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF', // Azul (padrão iOS)
    marginTop: 30,
    alignSelf: 'center',
  },
  logoutButton: {
    fontSize: 16,
    color: 'red',
    marginTop: 50,
    marginBottom: 50,
    alignSelf: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
  
  // Estilos do Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 30,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    fontSize: 18,
    color: '#007AFF',
    padding: 10,
  },
  modalButtonOK: {
    fontWeight: 'bold',
  },
});