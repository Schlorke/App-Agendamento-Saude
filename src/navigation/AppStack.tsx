import React from 'react';
import { Platform, Pressable, ViewStyle } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
 * @component TabBarButton
 * @description Componente customizado de botão de tab usado APENAS no mobile para garantir ocupação de 100% do espaço.
 * Na web, o React Navigation usa componente padrão com href para preservar navegação nativa.
 *
 * @props
 *   - Todas as props do BottomTabBarButtonProps do React Navigation são passadas via spread operator.
 *
 * @state
 *   - Nenhum estado interno. Componente funcional puro.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criado componente TabBarButton customizado para mobile. Na web, usa componente padrão do React Navigation com estilos via tabBarButtonStyle para preservar navegação nativa com href.
 */
const TabBarButton = (props: BottomTabBarButtonProps) => {
  const { style, onPress, children, ...restProps } = props;

  return (
    // @ts-expect-error - Pressable ref type incompatibility with BottomTabBarButtonProps
    <Pressable
      {...restProps}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          height: '100%',
          minWidth: 0,
          margin: 0,
          padding: 0,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
        },
        style as ViewStyle,
        pressed && { opacity: 0.7 },
      ]}
    >
      {children}
    </Pressable>
  );
};

/**
 * Tab Navigator interno com as 4 telas principais
 */
const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  // Calcula altura da tab bar considerando safe area no iOS
  // A tab bar ocupa toda a altura incluindo safe area
  const tabBarHeight = Platform.OS === 'ios' ? 60 + insets.bottom : 60;

  // Na web, injeta CSS para garantir que botões e background ocupem 100% do espaço
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.id = 'tab-bar-fix';
      style.textContent = `
        /* Remove todos os espaçamentos da tab bar */
        [role="tablist"],
        [role="tablist"] *,
        [role="tablist"] > *,
        [role="tablist"] > a,
        [role="tablist"] > div {
          margin: 0 !important;
          padding: 0 !important;
          gap: 0 !important;
        }
        [role="tablist"] {
          display: flex !important;
          flex-direction: row !important;
          width: 100% !important;
        }
        [role="tablist"] > *,
        [role="tablist"] > a,
        [role="tablist"] > div {
          flex: 1 1 0% !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        /* FORÇA div wrapper a ocupar 100% */
        [role="tablist"] > div {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          flex: 1 1 0% !important;
        }
        /* FORÇA elemento <a> DENTRO do div a ocupar 100% do espaço do div pai */
        /* Mantém display e align-items originais para não quebrar layout interno */
        [role="tablist"] > div > a {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          height: 100% !important;
        }
        /* FORÇA elemento <a> com background selecionado DENTRO do div a ocupar 100% */
        [role="tablist"] > div > a[aria-selected="true"] {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          height: 100% !important;
        }
        /* FORÇA TODOS os elementos <a> diretos (caso não tenha div wrapper) a ocupar 100% */
        [role="tablist"] > a {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          height: 100% !important;
        }
        /* Garante layout vertical (ícone em cima, texto embaixo) nos botões */
        [role="tablist"] > div > a,
        [role="tablist"] > a {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        const toRemove = document.getElementById('tab-bar-fix');
        if (toRemove) {
          document.head.removeChild(toRemove);
        }
      };
    }
  }, []);

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
        tabBarActiveBackgroundColor: theme.colors.tabActiveBackground,
        // Mobile: usa componente customizado | Web: usa componente padrão (preserva href)
        ...(Platform.OS !== 'web' && { tabBarButton: TabBarButton }),
        tabBarStyle: {
          paddingBottom: 0,
          paddingTop: 0,
          height: tabBarHeight,
          borderTopWidth: 0,
          elevation: 0,
          paddingHorizontal: 0,
          gap: 0,
          flexDirection: 'row',
          width: '100%',
        },
        tabBarItemStyle: {
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          margin: 0,
          alignSelf: 'stretch',
        },
        // Web: estilos via tabBarButtonStyle (preserva navegação com href)
        ...(Platform.OS === 'web' && {
          tabBarButtonStyle: {
            flex: 1,
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            minWidth: 0,
            margin: 0,
            padding: 0,
            alignSelf: 'stretch',
            boxSizing: 'border-box',
          },
        }),
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          marginTop: 0,
          marginBottom: 0,
          fontSize: 12,
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
 *   - `MainTabs`: Tab Navigator principal contendo Home, Schedule, History e Profile.
 *   - `News`: Tela de notícias e campanhas de saúde.
 *   - `Pharmacies`: Tela de farmácias de plantão.
 *   - `Medications`: Tela de informações sobre medicamentos.
 *   - `EditProfile`: Tela de edição de perfil do usuário.
 *
 * @configuration
 *   - Header habilitado com estilo verde primário.
 *   - Tab bar customizada com cores do tema.
 *   - Altura da tab bar: 60px.
 *   - Botões de tab com background slate gray quando ativos para melhor orientação do usuário.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2024-01-15 - IA - Convertido para Stack Navigator contendo Tab Navigator e novas rotas.
 *   - 2025-12-06 - IA - Renomeada tela do Stack Navigator de "Home" para "MainTabs" para evitar conflito de nomes com a tela "Home" do Tab Navigator interno.
 *   - 2025-12-06 - IA - Adicionado background slate gray nos botões de tab quando ativos para melhorar orientação do usuário.
 *   - 2025-12-06 - IA - Corrigido espaçamento da tab bar no iOS para respeitar safe area. Tab bar agora tem padding bottom dinâmico baseado nos insets de safe area do dispositivo.
 *   - 2025-12-06 - IA - Criado componente TabBarButton customizado que ocupa 100% da altura e largura da tab bar. Os botões agora preenchem completamente o espaço disponível, incluindo a área de safe area no iOS, sem espaços vazios nas laterais ou na parte inferior. Removido todo padding da tab bar e dos itens para garantir ocupação total do espaço.
 *   - 2025-12-06 - IA - Corrigido problema de navegação onde clicar em tabs redirecionava sempre para Home. Simplificado TabBarButton para passar todas as props do React Navigation diretamente via spread operator, garantindo que eventos de navegação (onPress, etc.) sejam propagados corretamente.
 *   - 2025-12-06 - IA - Corrigido bug visual de lateral cortada nos botões de tab. Mobile: usa componente TabBarButton customizado. Web: usa componente padrão do React Navigation com estilos via tabBarButtonStyle + CSS injetado para forçar elementos internos (incluindo background) a ocupar 100% do espaço. Solução garante ocupação total em ambas as plataformas sem quebrar navegação na web.
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
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false, title: 'Início' }}
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
