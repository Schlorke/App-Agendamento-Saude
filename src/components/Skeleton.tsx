/**
 * @component Skeleton
 * @description Componente de skeleton loading para exibir placeholders enquanto conteúdo carrega.
 * Fornece feedback visual de que algo está sendo carregado.
 *
 * @props
 *   - `variant`: {'text' | 'card' | 'listItem'} - Variante visual do skeleton (padrão: 'text').
 *   - `width`: {number | string} - Largura do skeleton (padrão: '100%').
 *   - `height`: {number} - Altura do skeleton em pixels (opcional, varia por variant).
 *   - `style`: {ViewStyle} - Estilos customizados para o container do skeleton.
 *
 * @state
 *   - `opacityAnim`: {Animated.Value} - Valor animado para animação de pulso.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente Skeleton com animação de pulso.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';
import { pulse } from '../utils/animations';

export interface SkeletonProps {
  variant?: 'text' | 'card' | 'listItem';
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    pulse(opacityAnim, 0.3, 0.7, 1500).start();
  }, [opacityAnim]);

  const getDefaultHeight = () => {
    switch (variant) {
      case 'card':
        return 200;
      case 'listItem':
        return 80;
      default:
        return 16;
    }
  };

  const getBorderRadius = () => {
    switch (variant) {
      case 'card':
        return theme.borderRadius.lg;
      case 'listItem':
        return theme.borderRadius.md;
      default:
        return theme.borderRadius.sm;
    }
  };

  const widthStyle =
    typeof width === 'string' ? { width: width as `${number}%` } : { width };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        widthStyle,
        {
          height: height || getDefaultHeight(),
          borderRadius: getBorderRadius(),
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.border,
  },
});

export default Skeleton;
