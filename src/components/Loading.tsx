import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

/**
 * @component Loading
 * @description Componente de loading reutilizável que exibe um ActivityIndicator com mensagem opcional.
 *
 * @props
 *   - `message`: {string} - Mensagem de texto exibida abaixo do indicador de carregamento (padrão: 'Carregando...').
 *   - `size`: {'small' | 'large'} - Tamanho do ActivityIndicator (padrão: 'large').
 *
 * @state
 *   - Nenhum estado interno. Componente puramente apresentacional.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 */
const Loading: React.FC<LoadingProps> = ({
  message = 'Carregando...',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});

export default Loading;
