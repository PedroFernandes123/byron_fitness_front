import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Exercise } from '../types';

// Importe as telas
import HomeScreen from '../screens/App/HomeScreen';
import WorkoutDetailsScreen from '../screens/App/WorkoutDetailsScreen';
import CreateExerciseScreen from '../screens/App/CreateExerciseScreen';
import EditExerciseScreen from '../screens/App/EditExerciseScreen';

// Definição de tipos para as rotas
export type AppStackParamList = {
  Home: undefined;
  WorkoutDetails: { workoutId: string; workoutName: string };
  CreateExercise: { workoutId: string };
  EditExercise: { workoutId: string; exercise: Exercise };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
      <Stack.Screen name="CreateExercise" component={CreateExerciseScreen} />
      <Stack.Screen name="EditExercise" component={EditExerciseScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;