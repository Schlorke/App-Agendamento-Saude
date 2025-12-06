/**
 * @file animations.ts
 * @description Utilitários de animação reutilizáveis para o aplicativo.
 * Fornece funções helper para criar animações comuns seguindo o design system.
 *
 * @usage
 *   import { fadeIn, slideUp, scalePress } from '../utils/animations';
 *
 * @changelog
 *   - 2024-01-15 - IA - Criação inicial do sistema de animações.
 *   - 2025-12-06 - IA - Adicionada verificação de plataforma para useNativeDriver (não suportado na web).
 */

import { Animated, Easing, Platform } from 'react-native';

// useNativeDriver não é suportado na web para transformações que não sejam opacity/transform
const canUseNativeDriver = Platform.OS !== 'web';

/**
 * Durações padrão de animação (em milissegundos)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

/**
 * Easing functions padrão
 */
export const EASING = {
  easeInOut: Easing.bezier(0.4, 0.0, 0.2, 1),
  easeOut: Easing.bezier(0.0, 0.0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0.0, 1, 1),
} as const;

/**
 * Cria uma animação de fade in
 * @param animatedValue - Valor animado (Animated.Value)
 * @param duration - Duração da animação (padrão: 250ms)
 * @param delay - Delay antes de iniciar (padrão: 0ms)
 * @returns Animated.CompositeAnimation
 */
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.normal,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: EASING.easeOut,
    useNativeDriver: canUseNativeDriver,
  });
};

/**
 * Cria uma animação de fade out
 * @param animatedValue - Valor animado (Animated.Value)
 * @param duration - Duração da animação (padrão: 250ms)
 * @returns Animated.CompositeAnimation
 */
export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.normal
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASING.easeIn,
    useNativeDriver: canUseNativeDriver,
  });
};

/**
 * Cria uma animação de slide up (desliza de baixo para cima)
 * @param animatedValue - Valor animado (Animated.Value) - deve ser inicializado com distance
 * @param distance - Distância do slide em pixels (padrão: 20) - usado apenas para documentação
 * @param duration - Duração da animação (padrão: 250ms)
 * @param delay - Delay antes de iniciar (padrão: 0ms)
 * @returns Animated.CompositeAnimation
 * @note O parâmetro distance é apenas para documentação. O animatedValue deve ser inicializado com o valor de distance antes de chamar esta função.
 */
export const slideUp = (
  animatedValue: Animated.Value,
  _distance: number = 20, // Parâmetro para documentação - não usado na implementação
  duration: number = ANIMATION_DURATION.normal,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: EASING.easeOut,
    useNativeDriver: canUseNativeDriver,
  });
};

/**
 * Cria uma animação de scale para feedback de press
 * @param animatedValue - Valor animado (Animated.Value)
 * @param scale - Escala final (padrão: 0.95)
 * @param duration - Duração da animação (padrão: 150ms)
 * @returns Animated.CompositeAnimation
 */
export const scalePress = (
  animatedValue: Animated.Value,
  scale: number = 0.95,
  duration: number = ANIMATION_DURATION.fast
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: scale,
    duration,
    easing: EASING.easeInOut,
    useNativeDriver: canUseNativeDriver,
  });
};

/**
 * Cria uma animação de scale para release (voltar ao normal)
 * @param animatedValue - Valor animado (Animated.Value)
 * @param duration - Duração da animação (padrão: 150ms)
 * @returns Animated.CompositeAnimation
 */
export const scaleRelease = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.fast
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: EASING.easeInOut,
    useNativeDriver: canUseNativeDriver,
  });
};

/**
 * Cria uma animação de pulso (para loading states)
 * @param animatedValue - Valor animado (Animated.Value)
 * @param minOpacity - Opacidade mínima (padrão: 0.3)
 * @param maxOpacity - Opacidade máxima (padrão: 1)
 * @param duration - Duração de um ciclo (padrão: 1000ms)
 * @returns Animated.CompositeAnimation
 */
export const pulse = (
  animatedValue: Animated.Value,
  minOpacity: number = 0.3,
  maxOpacity: number = 1,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxOpacity,
        duration: duration / 2,
        easing: EASING.easeInOut,
        useNativeDriver: canUseNativeDriver,
      }),
      Animated.timing(animatedValue, {
        toValue: minOpacity,
        duration: duration / 2,
        easing: EASING.easeInOut,
        useNativeDriver: canUseNativeDriver,
      }),
    ])
  );
};

/**
 * Cria uma animação de shake (para erros)
 * @param animatedValue - Valor animado (Animated.Value)
 * @param distance - Distância do shake em pixels (padrão: 10)
 * @param duration - Duração total (padrão: 500ms)
 * @returns Animated.CompositeAnimation
 */
export const shake = (
  animatedValue: Animated.Value,
  distance: number = 10,
  duration: number = 500
): Animated.CompositeAnimation => {
  const shakeDuration = duration / 4;
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: distance,
      duration: shakeDuration,
      easing: EASING.easeInOut,
      useNativeDriver: canUseNativeDriver,
    }),
    Animated.timing(animatedValue, {
      toValue: -distance,
      duration: shakeDuration * 2,
      easing: EASING.easeInOut,
      useNativeDriver: canUseNativeDriver,
    }),
    Animated.timing(animatedValue, {
      toValue: distance,
      duration: shakeDuration * 2,
      easing: EASING.easeInOut,
      useNativeDriver: canUseNativeDriver,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: shakeDuration,
      easing: EASING.easeInOut,
      useNativeDriver: canUseNativeDriver,
    }),
  ]);
  // distance is used in toValue above
};

/**
 * Cria uma animação de entrada escalonada para listas
 * @param index - Índice do item na lista
 * @param animatedValue - Valor animado (Animated.Value)
 * @param baseDelay - Delay base em ms (padrão: 50)
 * @param duration - Duração da animação (padrão: 250ms)
 * @returns Animated.CompositeAnimation
 */
export const staggerFadeIn = (
  index: number,
  animatedValue: Animated.Value,
  baseDelay: number = 50,
  duration: number = ANIMATION_DURATION.normal
): Animated.CompositeAnimation => {
  return fadeIn(animatedValue, duration, baseDelay * index);
};
