import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { AuthStackParamList } from './types';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

const Stack = createStackNavigator<AuthStackParamList>();

/**
 * @component AuthStack
 * @description Stack Navigator para telas de autenticação (login e cadastro). Usado quando o usuário não está autenticado.
 *
 * @props
 *   - Nenhuma prop direta. Configuração estática do stack de navegação.
 *
 * @state
 *   - Nenhum estado interno. Componente de configuração de navegação.
 *
 * @screens
 *   - `Login`: Tela de login do aplicativo.
 *   - `Register`: Tela de cadastro de novos usuários.
 *
 * @configuration
 *   - Header desabilitado (`headerShown: false`) para todas as telas.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...(Platform.OS === 'web' && {
          cardStyle: styles.webCardStyle,
        }),
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  webCardStyle: {
    flex: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    height: '100vh' as unknown as any,
  },
});

export default AuthStack;
