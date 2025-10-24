import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

// Faltando: O componente Header (bF BYRON Fitness)
export default function OnboardingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>bF</Text>
      <Text style={styles.slogan}>O seu app de controle{'\n'}fitness!</Text>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.button}>CADASTRO</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.button, { marginTop: 20 }]}>LOGIN</Text>
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
    justifyContent: 'space-around',
  },
  logo: { fontSize: 80, fontWeight: 'bold', marginTop: 100 },
  slogan: { fontSize: 20, textAlign: 'center' },
  button: { fontSize: 22, fontWeight: 'bold' },
});