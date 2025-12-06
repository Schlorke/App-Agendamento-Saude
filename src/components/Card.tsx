import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * @component Card
 * @description Componente de card reutilizável com estilo consistente, sombra e bordas arredondadas.
 *
 * @props
 *   - `children`: {React.ReactNode} - Conteúdo a ser exibido dentro do card.
 *   - `style`: {ViewStyle} - Estilos customizados para o card. Será mesclado com os estilos padrão.
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
const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.medium,
  },
});

export default Card;
