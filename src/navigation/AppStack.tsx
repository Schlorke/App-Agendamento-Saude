import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { AppStackParamList } from './types';
import { theme } from '../styles/theme';

import HomeScreen from '../screens/App/HomeScreen';
import ScheduleScreen from '../screens/App/ScheduleScreen';
import HistoryScreen from '../screens/App/HistoryScreen';
import ProfileScreen from '../screens/App/ProfileScreen';

const Tab = createBottomTabNavigator<AppStackParamList>();

/**
 * @component AppStack
 * @description Tab Navigator principal do aplicativo. Usado quando o usuário está autenticado. Fornece navegação por abas na parte inferior.
 *
 * @props
 *   - Nenhuma prop direta. Configuração estática do tab navigator.
 *
 * @state
 *   - Nenhum estado interno. Componente de configuração de navegação.
 *
 * @tabs
 *   - `Home`: Tela inicial com menu de navegação rápida.
 *   - `Schedule`: Tela de agendamento de consultas.
 *   - `History`: Tela de histórico de consultas.
 *   - `Profile`: Tela de perfil do usuário.
 *
 * @configuration
 *   - Header habilitado com estilo verde primário.
 *   - Tab bar customizada com cores do tema.
 *   - Altura da tab bar: 60px.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 */
const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Agendar',
          tabBarLabel: 'Agendar',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          tabBarLabel: 'Histórico',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
