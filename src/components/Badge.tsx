/**
 * @component Badge
 * @description Componente de badge reutilizável para exibir status, tags ou contadores.
 * Usado para indicar estados visuais como sucesso, erro, aviso, etc.
 *
 * @props
 *   - `text`: {string} - Texto exibido no badge.
 *   - `variant`: {'primary' | 'success' | 'error' | 'warning' | 'neutral'} - Variante visual do badge (padrão: 'primary').
 *   - `size`: {'small' | 'medium' | 'large'} - Tamanho do badge (padrão: 'medium').
 *   - `style`: {ViewStyle} - Estilos customizados para o container do badge.
 *   - `textStyle`: {TextStyle} - Estilos customizados para o texto do badge.
 *
 * @state
 *   - Nenhum estado interno. Componente puramente apresentacional.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente Badge com variantes e tamanhos.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';

export interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      case 'neutral':
        return styles.neutral;
      default:
        return styles.primary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  return (
    <View style={[styles.badge, getVariantStyle(), getSizeStyle(), style]}>
      <Text style={[getTextSizeStyle(), textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  success: {
    backgroundColor: theme.colors.success,
  },
  error: {
    backgroundColor: theme.colors.error,
  },
  warning: {
    backgroundColor: theme.colors.warning,
  },
  neutral: {
    backgroundColor: theme.colors.textSecondary,
  },
  small: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  large: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  textSmall: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  textMedium: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  textLarge: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
});

export default Badge;
