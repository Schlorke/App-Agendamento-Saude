import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
  Animated,
} from 'react-native';
import { theme } from '../styles/theme';
import { scalePress, scaleRelease } from '../utils/animations';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

/**
 * @component Button
 * @description Componente de botão reutilizável com suporte a múltiplas variantes, estados de loading e acessibilidade.
 *
 * @props
 *   - `title`: {string} - Texto exibido no botão.
 *   - `onPress`: {() => void} - Função chamada quando o botão é pressionado.
 *   - `variant`: {'primary' | 'secondary' | 'outline'} - Variante visual do botão. 'primary' usa verde saúde, 'secondary' usa azul, 'outline' é transparente com borda (padrão: 'primary').
 *   - `disabled`: {boolean} - Se true, desabilita a interação com o botão e aplica estilo desabilitado (padrão: false).
 *   - `loading`: {boolean} - Se true, exibe um ActivityIndicator no lugar do texto (padrão: false).
 *   - `style`: {ViewStyle} - Estilos customizados para o container do botão.
 *   - `textStyle`: {TextStyle} - Estilos customizados para o texto do botão.
 *   - `fullWidth`: {boolean} - Se true, o botão ocupa 100% da largura disponível (padrão: false).
 *
 * @state
 *   - Nenhum estado interno. Componente controlado via props.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Adicionadas props de acessibilidade com labels e roles padrão.
 *   - 2025-12-06 - IA - Adicionada animação de scale ao pressionar para melhor feedback visual.
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButtonText;
      default:
        return styles.buttonText;
    }
  };

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scalePress(scaleAnim).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scaleRelease(scaleAnim).start();
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      scaleRelease(scaleAnim).start(() => {
        onPress();
      });
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
        fullWidth && styles.fullWidth,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          getButtonStyle(),
          disabled && styles.buttonDisabled,
          fullWidth && styles.fullWidth,
          style,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
      >
        {loading ? (
          <ActivityIndicator
            color={
              variant === 'outline'
                ? theme.colors.primary
                : theme.colors.textLight
            }
          />
        ) : (
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.6,
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  outlineButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
