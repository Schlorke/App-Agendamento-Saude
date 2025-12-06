/**
 * @component Toast
 * @description Sistema de notificações toast para feedback ao usuário.
 * Exibe mensagens temporárias que desaparecem automaticamente.
 *
 * @props
 *   - `visible`: {boolean} - Controla a visibilidade do toast.
 *   - `type`: {'success' | 'error' | 'warning' | 'info'} - Tipo visual do toast (padrão: 'info').
 *   - `message`: {string} - Mensagem a ser exibida.
 *   - `position`: {'top' | 'bottom' | 'center'} - Posição do toast na tela (padrão: 'top').
 *   - `duration`: {number} - Duração em ms antes de auto-dismiss (padrão: 3000). 0 para não auto-dismiss.
 *   - `onDismiss`: {() => void} - Função chamada quando o toast é fechado (opcional).
 *   - `style`: {ViewStyle} - Estilos customizados para o container do toast.
 *
 * @state
 *   - `opacityAnim`: {Animated.Value} - Valor animado para animação de fade.
 *   - `translateYAnim`: {Animated.Value} - Valor animado para animação de slide.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente Toast com animações e auto-dismiss.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { theme } from '../styles/theme';
import { fadeIn, fadeOut } from '../utils/animations';

export interface ToastProps {
  visible: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  position?: 'top' | 'bottom' | 'center';
  duration?: number;
  onDismiss?: () => void;
  style?: ViewStyle;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  type = 'info',
  message,
  position = 'top',
  duration = 3000,
  onDismiss,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(
    new Animated.Value(
      position === 'top' ? -100 : position === 'bottom' ? 100 : 0
    )
  ).current;

  const handleDismiss = React.useCallback(() => {
    Animated.parallel([
      fadeOut(opacityAnim, 200),
      Animated.timing(translateYAnim, {
        toValue: position === 'top' ? -50 : position === 'bottom' ? 50 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  }, [opacityAnim, translateYAnim, position, onDismiss]);

  useEffect(() => {
    if (visible) {
      opacityAnim.setValue(0);
      translateYAnim.setValue(
        position === 'top' ? -50 : position === 'bottom' ? 50 : 0
      );

      Animated.parallel([
        fadeIn(opacityAnim, 300),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      handleDismiss();
    }
  }, [visible, duration, position, opacityAnim, translateYAnim, handleDismiss]);

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return styles.positionTop;
      case 'bottom':
        return styles.positionBottom;
      default:
        return styles.positionCenter;
    }
  };

  if (!visible) return null;

  return (
    <View
      style={[styles.container, getPositionStyle()]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.toast,
          {
            opacity: opacityAnim,
            transform: [{ translateY: translateYAnim }],
            borderLeftColor: getTypeColor(),
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={handleDismiss}
          activeOpacity={0.8}
          style={styles.content}
        >
          <Text style={styles.message}>{message}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  positionTop: {
    top: 60,
  },
  positionBottom: {
    bottom: 60,
  },
  positionCenter: {
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  toast: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    borderLeftWidth: 4,
    ...theme.shadow.medium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
});

export default Toast;
