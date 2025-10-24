import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AppHeader } from '../../components/AppHeader'; // Importa o Header

// Define o tipo das props da rota
type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Header baseado na 'Pagina Onboarding.pdf' 
        (que tem o mesmo header da 'Pagina Cadastro.pdf')
      */}
      <AppHeader title="BYRON Fitness" />

      <Text style={styles.slogan}>
        O seu app de controle{'\n'}fitness!
      </Text>

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.button}>CADASTRO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ marginTop: 25 }} // Espaço entre os botões
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.button}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // 'space-around' distribui o conteúdo verticalmente
    justifyContent: 'space-around', 
  },
  slogan: {
    fontSize: 22,
    fontWeight: '300', // Fonte mais leve
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 40, // Margem inferior
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});