import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

/**
 * @component Navigation
 * @description Componente de navegação principal do aplicativo. Gerencia navegação condicional baseada no estado de autenticação.
 *
 * @props
 *   - Nenhuma prop direta. Utiliza o hook `useAuth` para determinar o estado de autenticação.
 *
 * @state
 *   - Nenhum estado interno. Utiliza `useAuth` para obter `isAuthenticated` e `loading`.
 *
 * @behavior
 *   - Se `loading` é true, retorna null (pode ser substituído por um loading screen).
 *   - Se `isAuthenticated` é true, renderiza `AppStack` (telas autenticadas).
 *   - Se `isAuthenticated` é false, renderiza `AuthStack` (telas de login/cadastro).
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 */
const Navigation = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Pode mostrar um loading screen aqui
    return null;
  }

  return (
    <NavigationContainer>
      {Platform.OS === 'web' ? (
        <View style={styles.webContainer}>
          {isAuthenticated ? <AppStack /> : <AuthStack />}
        </View>
      ) : (
        <>{isAuthenticated ? <AppStack /> : <AuthStack />}</>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      height: '100vh' as unknown as number,
      width: '100%',
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

export default Navigation;
