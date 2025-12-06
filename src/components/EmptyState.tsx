/**
 * @component EmptyState
 * @description Componente padronizado para exibir estados vazios (quando não há dados para exibir).
 * Fornece uma experiência consistente quando listas ou seções estão vazias.
 *
 * @props
 *   - `icon`: {string} - Emoji ou texto do ícone a ser exibido (opcional).
 *   - `title`: {string} - Título principal da mensagem de estado vazio.
 *   - `description`: {string} - Descrição adicional explicando o estado vazio (opcional).
 *   - `action`: {React.ReactNode} - Componente de ação (botão) a ser exibido (opcional).
 *   - `style`: {ViewStyle} - Estilos customizados para o container.
 *
 * @state
 *   - Nenhum estado interno. Componente puramente apresentacional.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente EmptyState.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    maxWidth: 300,
  },
  actionContainer: {
    marginTop: theme.spacing.md,
  },
});

export default EmptyState;
