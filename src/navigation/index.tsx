import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Tela de loading enquanto verifica o token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;