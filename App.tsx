import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * @component App
 * @description Componente raiz do aplicativo. Configura o SafeAreaProvider e o NavigationContainer.
 *
 * @props
 *   - Nenhuma prop. Componente raiz que não recebe props.
 *
 * @state
 *   - Nenhum estado interno. Componente puramente estrutural.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
