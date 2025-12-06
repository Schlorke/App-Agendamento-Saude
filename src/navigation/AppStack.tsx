import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import type { AppStackParamList } from './types';
import { theme } from '../styles/theme';

import HomeScreen from '../screens/App/HomeScreen';
import ScheduleScreen from '../screens/App/ScheduleScreen';
import HistoryScreen from '../screens/App/HistoryScreen';
import ProfileScreen from '../screens/App/ProfileScreen';
import NewsScreen from '../screens/App/NewsScreen';
import PharmaciesScreen from '../screens/App/PharmaciesScreen';
import MedicationsScreen from '../screens/App/MedicationsScreen';
// EditProfileScreen is used in Stack.Screen component prop (line 148)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import EditProfileScreen from '../screens/App/EditProfileScreen';

const Tab = createBottomTabNavigator<AppStackParamList>();
const Stack = createStackNavigator<AppStackParamList>();

/**
 * Tab Navigator interno com as 4 telas principais
 */
const TabNavigator = () => {
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

/**
 * @component AppStack
 * @description Stack Navigator principal do aplicativo. Usado quando o usuário está autenticado. Contém o Tab Navigator e rotas adicionais para telas secundárias.
 *
 * @props
 *   - Nenhuma prop direta. Configuração estática do stack navigator.
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
 * @stack_screens
 *   - `News`: Tela de notícias e campanhas de saúde.
 *   - `Pharmacies`: Tela de farmácias de plantão.
 *   - `Medications`: Tela de informações sobre medicamentos.
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
 *   - 2024-01-15 - IA - Convertido para Stack Navigator contendo Tab Navigator e novas rotas.
 */
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="News"
        component={NewsScreen}
        options={{ title: 'Notícias e Campanhas' }}
      />
      <Stack.Screen
        name="Pharmacies"
        component={PharmaciesScreen}
        options={{ title: 'Farmácias de Plantão' }}
      />
      <Stack.Screen
        name="Medications"
        component={MedicationsScreen}
        options={{ title: 'Medicamentos' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
