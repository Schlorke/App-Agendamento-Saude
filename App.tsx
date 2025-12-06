import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import Navigation from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import notificationService from './src/services/notificationService';

/**
 * @component App
 * @description Componente raiz do aplicativo. Configura o SafeAreaProvider, NavigationContainer e handlers de notificações.
 *
 * @props
 *   - Nenhuma prop. Componente raiz que não recebe props.
 *
 * @state
 *   - Nenhum estado interno. Utiliza useEffect para configurar notificações.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2024-01-15 - IA - Adicionada configuração de handlers de notificações e solicitação de permissões.
 */
export default function App() {
  const notificationListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );
  const responseListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );

  useEffect(() => {
    // Solicita permissões na inicialização
    notificationService.solicitarPermissoes();

    // Handler para quando uma notificação é recebida enquanto o app está em foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notificação recebida:', notification);
      });

    // Handler para quando o usuário toca em uma notificação
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Resposta à notificação:', response);
        // Aqui você pode navegar para uma tela específica baseada nos dados da notificação
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
