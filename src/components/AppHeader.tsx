// src/components/AppHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
  canGoBack?: boolean;
  
  // --- NOVAS PROPRIEDADES DE ESTILO ---
  backgroundColor?: string;
  textColor?: string;
  borderBottomColor?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = "BYRON Fitness",
  canGoBack = false,
  // --- VALORES PADRÃO (para as outras telas) ---
  backgroundColor = '#fff',
  textColor = '#000',
  borderBottomColor = '#f0f0f0'
}) => {
  const navigation = useNavigation<any>(); 
  const insets = useSafeAreaInsets();

  return (
    // Aplica os estilos dinamicamente
    <View 
      style={[
        styles.container, 
        { 
          paddingTop: insets.top, 
          backgroundColor: backgroundColor, // Usa a cor de fundo
          borderBottomColor: borderBottomColor // Usa a cor da borda
        }
      ]}
    >
      
      {/* Lado Esquerdo: Botão de Voltar */}
      <View style={styles.sideContainer}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* Aplica a cor do texto */}
            <Text style={[styles.backArrow, { color: textColor }]}>→</Text> 
          </TouchableOpacity>
        )}
      </View>

      {/* Centro: Logo/Título */}
      <View style={styles.titleContainer}>
        {/* Aplica a cor do texto */}
        <Text style={[styles.logo, { color: textColor }]}>bF</Text>
        <Text style={[styles.appName, { color: textColor }]}> {title}</Text>
      </View>

      {/* Lado Direito: Espaçador */}
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
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    // As cores de 'backgroundColor' e 'borderBottomColor'
    // foram movidas para as props
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
    width: 40,
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