// src/components/AppHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppNavigator';

interface AppHeaderProps {
  /** * O texto a ser exibido após o logo 'bF'. 
   * Default: 'BYRON Fitness'
   */
  title?: string; // <-- VERIFIQUE SE ESTA LINHA EXISTE
  
  /** * Se true, mostra o botão de voltar (→). 
   */
  canGoBack?: boolean;
}

interface AppHeaderProps {
  /**
   * Se true, mostra o botão de voltar (→)[cite: 12].
   * Se false ou omitido, não mostra nada.
   */
  canGoBack?: boolean;
}

// Define o tipo do hook de navegação para o AppNavigator
type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const AppHeader: React.FC<AppHeaderProps> = ({ canGoBack = false }) => {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Lado Esquerdo: Botão de Voltar */}
      <View style={styles.sideContainer}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>→</Text> 
          </TouchableOpacity>
        )}
      </View>

      {/* Centro: Logo/Título [cite: 11] */}
      <View style={styles.titleContainer}>
        <Text style={styles.logo}>bF</Text>
        <Text style={styles.appName}> BYRON Fitness</Text>
      </View>

      {/* Lado Direito: Espaçador (para manter o título centralizado) */}
      <View style={styles.sideContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 50, // Espaço para a barra de status
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sideContainer: {
    width: 40, // Largura fixa para balancear
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});