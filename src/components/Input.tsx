import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Animated,
} from 'react-native';
import { theme } from '../styles/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * @component Input
 * @description Componente de input reutilizável com suporte a label, validação de erros e estilos customizados.
 *
 * @props
 *   - `label`: {string} - Texto do label exibido acima do input (opcional).
 *   - `error`: {string} - Mensagem de erro exibida abaixo do input. Quando presente, aplica estilo de erro (borda vermelha) (opcional).
 *   - `containerStyle`: {ViewStyle} - Estilos customizados para o container do input (opcional).
 *   - Todas as props de `TextInputProps` do React Native são suportadas (value, onChangeText, placeholder, etc.).
 *
 * @state
 *   - `focused`: {boolean} - Indica se o input está focado.
 *   - `borderColorAnim`: {Animated.Value} - Valor animado para a cor da borda.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Adicionada animação de foco com transição suave da cor da borda.
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderColorAnim, {
      toValue: focused && !error ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, error, borderColorAnim]);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? theme.colors.error : theme.colors.border,
      theme.colors.primary,
    ],
  });

  const handleFocus = (
    e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]
  ) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (
    e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]
  ) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
          },
          error && styles.inputErrorContainer,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  inputErrorContainer: {
    borderColor: theme.colors.error,
  },
  input: {
    ...theme.typography.body,
    height: 50,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'transparent',
    color: theme.colors.text,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default Input;
