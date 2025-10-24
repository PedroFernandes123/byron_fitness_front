// src/components/AppHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  /** * O texto a ser exibido após o logo 'bF'. 
   * Default: 'BYRON Fitness' 
   */
  title?: string;
  
  /** * Se true, mostra o botão de voltar (→)[cite: 62]. 
   */
  canGoBack?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = "BYRON Fitness", // Valor padrão da maioria das telas [cite: 6]
  canGoBack = false 
}) => {
  // Hook genérico para funcionar em qualquer stack de navegação
  const navigation = useNavigation<any>(); 

  return (
    <View style={styles.container}>
      {/* Lado Esquerdo: Botão de Voltar */}
      <View style={styles.sideContainer}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* A seta de voltar (→) vista na 'Pagina inicial.pdf' [cite: 62] */}
            <Text style={styles.backArrow}>→</Text> 
          </TouchableOpacity>
        )}
      </View>

      {/* Centro: Logo/Título */}
      <View style={styles.titleContainer}>
        {/* O logo 'bF' [cite: 1, 6, 13] */}
        <Text style={styles.logo}>bF</Text>
        {/* O 'title' é dinâmico (ex: "BYRON Fitness"  ou "Fitness" [cite: 14]) */}
        <Text style={styles.appName}> {title}</Text>
      </View>

      {/* Lado Direito: Espaçador (para manter o título centralizado) */}
      <View style={styles.sideContainer} />
    </View>
  );
};

// Estilos baseados nos PDFs
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 50, // Espaço seguro (safe area)
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
    width: 40, // Largura fixa para balancear o título central
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