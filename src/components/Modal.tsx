/**
 * @component Modal
 * @description Componente de modal seguindo o design system.
 * Suporta variantes (alert, confirm, info) e animações de entrada/saída.
 *
 * @props
 *   - `visible`: {boolean} - Controla a visibilidade do modal.
 *   - `variant`: {'alert' | 'confirm' | 'info'} - Variante visual do modal (padrão: 'info').
 *   - `title`: {string} - Título do modal.
 *   - `message`: {string} - Mensagem principal do modal.
 *   - `primaryAction`: {Object} - Ação primária { label: string, onPress: () => void }.
 *   - `secondaryAction`: {Object} - Ação secundária { label: string, onPress: () => void } (opcional).
 *   - `icon`: {React.ComponentType} - Ícone Lucide opcional para exibir antes do título.
 *   - `showTopBorder`: {boolean} - Se false, remove a borda superior colorida do modal (padrão: true).
 *   - `onClose`: {() => void} - Função chamada ao fechar o modal (opcional).
 *   - `style`: {ViewStyle} - Estilos customizados para o container do modal.
 *
 * @state
 *   - `opacityAnim`: {Animated.Value} - Valor animado para animação de fade.
 *   - `scaleAnim`: {Animated.Value} - Valor animado para animação de scale.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente Modal com animações e variantes.
 *   - 2025-12-06 - IA - Adicionado suporte a ícone opcional e controle da borda superior (showTopBorder).
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableWithoutFeedback,
  Animated,
  ViewStyle,
} from 'react-native';
import { theme } from '../styles/theme';
import { fadeIn, fadeOut } from '../utils/animations';
import Button from './Button';

export interface ModalProps {
  visible: boolean;
  variant?: 'alert' | 'confirm' | 'info';
  title: string;
  message: string;
  primaryAction: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  showTopBorder?: boolean;
  onClose?: () => void;
  style?: ViewStyle;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  variant = 'info',
  title,
  message,
  primaryAction,
  secondaryAction,
  icon: Icon,
  showTopBorder = true,
  onClose,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.9);
      Animated.parallel([
        fadeIn(opacityAnim, 250),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        fadeOut(opacityAnim, 200),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacityAnim, scaleAnim]);

  const getVariantColor = () => {
    switch (variant) {
      case 'alert':
        return theme.colors.error;
      case 'confirm':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  const handleBackdropPress = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
                style,
              ]}
            >
              <View
                style={[
                  styles.header,
                  showTopBorder && { borderTopColor: getVariantColor() },
                  !showTopBorder && styles.headerNoBorder,
                ]}
              >
                <View style={styles.titleContainer}>
                  {Icon && (
                    <Icon
                      size={24}
                      color={
                        variant === 'alert'
                          ? theme.colors.error
                          : variant === 'confirm'
                            ? theme.colors.success
                            : theme.colors.primary
                      }
                    />
                  )}
                  <Text style={styles.title}>{title}</Text>
                </View>
              </View>
              <View style={styles.content}>
                <Text style={styles.message}>{message}</Text>
              </View>
              <View style={styles.actions}>
                {secondaryAction && (
                  <Button
                    title={secondaryAction.label}
                    onPress={secondaryAction.onPress}
                    variant="outline"
                    style={styles.secondaryButton}
                  />
                )}
                <Button
                  title={primaryAction.label}
                  onPress={primaryAction.onPress}
                  variant="primary"
                  style={
                    secondaryAction
                      ? styles.primaryButtonWithSecondary
                      : styles.primaryButton
                  }
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    ...theme.shadow.large,
  },
  header: {
    borderTopWidth: 4,
    padding: theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  headerNoBorder: {
    borderTopWidth: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  primaryButton: {
    flex: 1,
  },
  primaryButtonWithSecondary: {
    flex: 0,
  },
  secondaryButton: {
    flex: 0,
  },
});

export default Modal;
