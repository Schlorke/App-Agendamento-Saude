/**
 * @component Header
 * @description Componente de header consistente para telas do aplicativo.
 * Fornece título, subtítulo opcional e área de ações (botões) à direita.
 *
 * @props
 *   - `title`: {string} - Título principal do header.
 *   - `subtitle`: {string} - Subtítulo opcional exibido abaixo do título.
 *   - `actions`: {React.ReactNode} - Componentes de ação (botões) a serem exibidos à direita (opcional).
 *   - `showBackButton`: {boolean} - Se true, exibe botão de voltar (requer onBack) (padrão: false).
 *   - `onBack`: {() => void} - Função chamada quando o botão de voltar é pressionado (opcional).
 *   - `style`: {ViewStyle} - Estilos customizados para o container do header.
 *
 * @state
 *   - Nenhum estado interno. Componente puramente apresentacional.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente Header.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { theme } from '../styles/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  showBackButton = false,
  onBack,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {showBackButton && onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            accessibilityHint="Toque duas vezes para voltar à tela anterior"
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {actions && <View style={styles.actionsContainer}>{actions}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  backButtonText: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});

export default Header;
