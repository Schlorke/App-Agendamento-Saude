import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { theme } from '../styles/theme';
import { scalePress, scaleRelease } from '../utils/animations';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * @component Card
 * @description Componente de card reutilizável com estilo consistente, sombra e bordas arredondadas.
 * Suporta variantes visuais e animação quando clicável.
 *
 * @props
 *   - `children`: {React.ReactNode} - Conteúdo a ser exibido dentro do card.
 *   - `style`: {ViewStyle} - Estilos customizados para o card. Será mesclado com os estilos padrão.
 *   - `variant`: {'elevated' | 'outlined' | 'flat'} - Variante visual do card. 'elevated' tem sombra (padrão), 'outlined' tem apenas borda, 'flat' sem sombra nem borda.
 *   - `onPress`: {() => void} - Função chamada quando o card é pressionado. Quando presente, o card se torna clicável.
 *   - `disabled`: {boolean} - Se true, desabilita a interação quando o card é clicável (padrão: false).
 *
 * @state
 *   - `scaleAnim`: {Animated.Value} - Valor animado para animação de press quando clicável.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Adicionadas variantes (elevated, outlined, flat) e animação de press quando clicável.
 */
const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.cardOutlined;
      case 'flat':
        return styles.cardFlat;
      default:
        return styles.cardElevated;
    }
  };

  const handlePressIn = () => {
    if (!disabled && onPress) {
      scalePress(scaleAnim).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && onPress) {
      scaleRelease(scaleAnim).start();
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      scaleRelease(scaleAnim).start(() => {
        onPress();
      });
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        {
          transform: onPress ? [{ scale: scaleAnim }] : [],
        },
      ]}
    >
      <View style={[getCardStyle(), style]}>{children}</View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  cardElevated: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.medium,
  },
  cardOutlined: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardFlat: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
});

export default Card;
