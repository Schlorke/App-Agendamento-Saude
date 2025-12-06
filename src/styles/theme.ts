/**
 * Tema global do aplicativo
 * Cores e estilos pensados para simplicidade e acessibilidade
 */

import { Platform } from 'react-native';

// Helper para criar sombras compatíveis com web e native
const createShadow = (
  shadowColor: string,
  shadowOffset: { width: number; height: number },
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number
) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0, 0, 0, ${shadowOpacity})`,
      elevation, // Mantém para compatibilidade
    };
  }
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

export const theme = {
  colors: {
    primary: '#2E7D32', // Verde saúde
    primaryDark: '#1B5E20',
    primaryLight: '#4CAF50',
    secondary: '#1976D2', // Azul
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#D32F2F',
    warning: '#F57C00',
    success: '#388E3C',
    text: '#212121',
    textSecondary: '#757575',
    textLight: '#FFFFFF',
    border: '#E0E0E0',
    disabled: '#BDBDBD',
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  shadow: {
    small: createShadow('#000', { width: 0, height: 1 }, 0.18, 1.0, 1),
    medium: createShadow('#000', { width: 0, height: 2 }, 0.23, 2.62, 4),
    large: createShadow('#000', { width: 0, height: 4 }, 0.3, 4.65, 8),
  },
};

export type Theme = typeof theme;
