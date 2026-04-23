import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import Navigation from './src/navigation';
import PwaInstallBanner from './src/components/PwaInstallBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/useAuth';
import dataService from './src/services/dataService';

// Importação condicional de notificações apenas em plataformas móveis
// Isso evita o warning no web onde push tokens não são suportados
type NotificationSubscription = {
  remove: () => void;
};

/**
 * @component App
 * @description Componente raiz do aplicativo. Configura SafeAreaProvider, NavigationContainer e handlers de notificacoes.
 *
 * @props
 *   - Nenhuma prop. Componente raiz que nao recebe props.
 *
 * @state
 *   - Nenhum estado interno. Utiliza useEffect para configurar notificacoes.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentacao JSDoc completo.
 *   - 2024-01-15 - IA - Adicionada configuracao de handlers de notificacoes e solicitacao de permissoes.
 *   - 2025-12-06 - IA - Envolvido em AuthProvider para compartilhar sessao global em Web e Expo.
 *   - 2025-12-06 - IA - Implementada importacao condicional de expo-notifications para evitar warnings na web.
 *   - 2026-04-23 - IA - Banner PWA (web móvel) montado acima da navegação para instalação / instruções iOS.
 */
export default function App() {
  const notificationListener = useRef<NotificationSubscription | undefined>(
    undefined
  );
  const responseListener = useRef<NotificationSubscription | undefined>(
    undefined
  );

  useEffect(() => {
    // Notificações push não são totalmente suportadas na web
    if (Platform.OS === 'web') {
      return;
    }

    // Carrega módulos de notificação de forma assíncrona apenas em plataformas móveis
    const initializeNotifications = async () => {
      try {
        const [NotificationsModule, NotificationServiceModule] =
          await Promise.all([
            import('expo-notifications'),
            import('./src/services/notificationService'),
          ]);

        // expo-notifications exporta como namespace (*), não como default
        const Notifications = NotificationsModule;
        const notificationService = NotificationServiceModule.default;

        // Solicita permissoes na inicializacao
        await notificationService.solicitarPermissoes();

        // Handler para quando uma notificacao eh recebida enquanto o app esta em foreground
        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            console.log('Notificacao recebida:', notification);
          });

        // Handler para quando o usuario toca em uma notificacao
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Resposta a notificacao:', response);
            // Aqui voce pode navegar para uma tela especifica baseada nos dados da notificacao
          });
      } catch (error) {
        console.warn('Erro ao inicializar notificações:', error);
      }
    };

    initializeNotifications();

    // Expor métodos de desenvolvimento no console (apenas em desenvolvimento)
    if (__DEV__ && typeof window !== 'undefined') {
      interface WindowWithDebug extends Window {
        resetDatabase?: () => Promise<void>;
        limparDatabase?: () => Promise<void>;
        debugUsuario?: (cpf: string) => Promise<void>;
        listarUsuarios?: () => Promise<void>;
        importarDados?: (dadosJson: string) => Promise<void>;
        exportarDados?: () => Promise<string>;
      }
      const windowWithDebug = window as WindowWithDebug;

      windowWithDebug.resetDatabase = async () => {
        await dataService.resetDatabase();
        console.log('✅ Banco de dados resetado! Recarregue a página.');
        window.location.reload();
      };
      windowWithDebug.limparDatabase = async () => {
        await dataService.limparDatabase();
        console.log('✅ Banco de dados limpo! Recarregue a página.');
        window.location.reload();
      };
      windowWithDebug.debugUsuario = async (cpf: string) => {
        const cpfLimpo = cpf.replace(/\D/g, '');
        const usuario = await dataService.buscarUsuarioPorCPF(cpfLimpo);
        if (usuario) {
          console.log('✅ Usuário encontrado:', {
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            senhaHash: usuario.senhaHash,
          });
        } else {
          console.log('❌ Usuário não encontrado para CPF:', cpfLimpo);
        }
      };
      windowWithDebug.listarUsuarios = async () => {
        const database = await dataService.exportarDatabase();
        console.log(
          '📋 Usuários cadastrados:',
          database.usuarios.map((u) => ({
            id: u.id,
            nome: u.nome,
            cpf: u.cpf,
          }))
        );
        console.log(`Total: ${database.usuarios.length} usuário(s)`);
      };
      windowWithDebug.importarDados = async (dadosJson: string) => {
        try {
          const dados = JSON.parse(dadosJson);
          await dataService.importarDatabase(dados);
          console.log('✅ Dados importados com sucesso! Recarregue a página.');
          window.location.reload();
        } catch (error) {
          console.error('❌ Erro ao importar dados:', error);
        }
      };
      windowWithDebug.exportarDados = async () => {
        const dados = await dataService.exportarDatabase();
        const json = JSON.stringify(dados, null, 2);
        console.log('📋 Dados exportados (copie o JSON abaixo):');
        console.log(json);
        return json;
      };
      console.log(
        '💡 Dica: Use window.resetDatabase(), window.limparDatabase(), window.debugUsuario("CPF"), window.listarUsuarios() ou window.importarDados(JSON) no console.'
      );
    }

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
    <SafeAreaProvider style={{ flex: 1 }}>
      <AuthProvider>
        <View style={{ flex: 1 }}>
          <PwaInstallBanner />
          <View style={{ flex: 1, minHeight: 0 }}>
            <Navigation />
          </View>
        </View>
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
