import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { theme } from '../styles/theme';
import { pulse } from '../utils/animations';

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
 *   - 2025-12-06 - IA - Adicionada animação de pulso sutil no texto da mensagem.
 */
const Loading: React.FC<LoadingProps> = ({
  message = 'Carregando...',
  size = 'large',
}) => {
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    pulse(opacityAnim, 0.5, 1, 1500).start();
  }, [opacityAnim]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Animated.Text
          style={[
            styles.message,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          {message}
        </Animated.Text>
      )}
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
