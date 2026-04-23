import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Plus, Share } from 'lucide-react-native';
import Button from './Button';
import { theme } from '../styles/theme';
import type { BeforeInstallPromptEvent } from '../types/beforeInstallPrompt';
import {
  PwaInstallBannerViewModel,
  computePwaBannerVisible,
} from '../viewmodels/PwaInstallBannerViewModel';

const IOS_SAFARI_A11Y_LABEL =
  'Instalar HoW no Safari em dois passos. Passo 1: na barra inferior do Safari, toque no botão Partilhar, o ícone com seta a sair de um quadrado, por vezes no centro ou à direita da barra. Passo 2: na folha que abre, deslize se necessário e toque em Adicionar ao ecrã principal.';

/** Ícone aproximado das abas do Safari (dois quadrados sobrepostos). */
function SafariTabsGlyph({ color }: { color: string }) {
  return (
    <View
      style={styles.tabsGlyphWrap}
      accessibilityLabel="Ícone de separadores do Safari"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.tabsGlyphBack, { borderColor: color }]} />
      <View style={[styles.tabsGlyphFront, { borderColor: color }]} />
    </View>
  );
}

/** Passo a passo visual inspirado na barra inferior do Safari e na linha «Adicionar ao ecrã principal». */
function IosSafariInstallSteps() {
  const barIcon = '#5C5C5C';
  const barMuted = '#C4C4C4';

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={IOS_SAFARI_A11Y_LABEL}
    >
      <Text style={styles.stepTitle}>1. Na barra inferior do Safari</Text>
      <Text style={styles.stepHint}>
        Toque no botão Partilhar — o mesmo tipo de ícone que está destacado a
        seguir (seta a sair de um quadrado).
      </Text>

      <View
        style={styles.safariBarOuter}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.safariBarInner}>
          <View style={styles.safariBarRow}>
            <View style={styles.safariBarThirdLeft} accessibilityElementsHidden>
              <View style={styles.safariBarIconPair}>
                <ChevronLeft size={17} color={barMuted} strokeWidth={2} />
                <ChevronRight size={17} color="#D8D8D8" strokeWidth={2} />
              </View>
            </View>
            <View
              style={styles.safariBarThirdCenter}
              accessibilityElementsHidden
            >
              <View style={styles.shareHighlight}>
                <Share size={15} color={barIcon} strokeWidth={2} />
              </View>
            </View>
            <View
              style={styles.safariBarThirdRight}
              accessibilityElementsHidden
            >
              <SafariTabsGlyph color={barIcon} />
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.stepTitleSecond}>2. Na folha Partilhar</Text>
      <Text style={styles.stepHint}>
        Deslize a lista para baixo, se precisar, e escolha a opção com o sinal
        de mais, como no exemplo:
      </Text>

      <View
        style={styles.sheetRow}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.sheetPlusWrap}>
          <Plus
            size={14}
            color={theme.colors.textLight}
            strokeWidth={2.75}
            accessibilityElementsHidden
          />
        </View>
        <Text style={styles.sheetRowLabel}>Adicionar ao ecrã principal</Text>
      </View>
    </View>
  );
}

/**
 * @component PwaInstallBanner
 * @description Banner na web móvel (Android/iOS) que convida a instalar a PWA: Chrome usa `beforeinstallprompt`; Safari mostra instruções com referência visual à barra inferior e à opção «Adicionar ao ecrã principal».
 *
 * @props
 * - Nenhuma. Componente opcional montado na raiz apenas quando faz sentido na web.
 *
 * @state
 * - `visible`: {boolean} - Controla exibição após verificar standalone, sessão e plataforma.
 * - `installReady`: {boolean} - Atualizado quando o evento `beforeinstallprompt` fica disponível (Android).
 *
 * @known_issues
 * - O evento `beforeinstallprompt` depende de heurísticas do Chrome e dos critérios de “instalabilidade” (HTTPS, manifesto e, em geral, service worker); sem SW o navegador pode nunca emitir o evento — o texto alternativo orienta pela opção do menu.
 * - No iOS não existe API de instalação programática; apenas texto de ajuda e referências visuais aproximadas aos controlos do Safari.
 *
 * @changelog
 * - 2026-04-23 - IA - Criação do banner PWA com ViewModel, tema e acessibilidade.
 * - 2026-04-23 - IA - Passo a passo iOS com barra estilo Safari (voltar, Partilhar destacado, separadores) e linha «Adicionar ao ecrã principal».
 * - 2026-04-23 - IA - Alinhamento: barra Safari em três colunas iguais, linha da folha Partilhar centrada, Fechar em largura total no iOS; Android com dois botões usa `flex:1` em linha.
 * - 2026-04-23 - IA - Réplicas da barra Safari e da linha «Adicionar ao ecrã principal» mais compactas (ícones e padding reduzidos).
 * - 2026-04-23 - IA - Quadrado azul do passo 2: `Plus` do Lucide em vez de texto, para o «+» ficar centrado no bloco.
 * - 2026-04-23 - IA - Efeito PWA: estado inicial após microtarefa (`Promise.resolve().then`) + cancelamento no cleanup para satisfazer `react-hooks/set-state-in-effect`.
 */
const PwaInstallBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const viewModel = useMemo(() => new PwaInstallBannerViewModel(), []);
  const [visible, setVisible] = useState(false);
  const [installReady, setInstallReady] = useState(false);

  const syncInstallButton = useCallback(() => {
    setInstallReady(viewModel.shouldShowInstallButton);
  }, [viewModel]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      viewModel.setDeferredPrompt(e as BeforeInstallPromptEvent);
      syncInstallButton();
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    let cancelled = false;
    // Adia leitura do DOM/sessão para fora do flush síncrono do efeito (react-hooks/set-state-in-effect).
    void Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }
      const dismissed = PwaInstallBannerViewModel.readDismissedFromSession();
      const standalone = PwaInstallBannerViewModel.isLikelyStandalone();
      const show = computePwaBannerVisible({
        isStandalone: standalone,
        dismissedFromStorage: dismissed,
        userKind: viewModel.userKind,
      });
      setVisible(show);
      syncInstallButton();
    });

    return () => {
      cancelled = true;
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, [viewModel, syncInstallButton]);

  const handleDismiss = useCallback(() => {
    PwaInstallBannerViewModel.writeDismissedToSession();
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    const outcome = await viewModel.promptInstall();
    syncInstallButton();
    if (outcome === 'accepted') {
      PwaInstallBannerViewModel.writeDismissedToSession();
      setVisible(false);
    }
  }, [viewModel, syncInstallButton]);

  if (Platform.OS !== 'web' || !visible) {
    return null;
  }

  const isIos = viewModel.userKind === 'ios';
  /** Só um botão de ação (Fechar sozinho, ou iOS). */
  const singlePrimaryAction = isIos || !installReady;
  const helperText = isIos
    ? ''
    : installReady
      ? 'Toque em Instalar para adicionar a HoW ao ecrã principal.'
      : 'No Chrome: abra o menu (⋮) e escolha «Instalar app» ou «Adicionar à página inicial». O botão Instalar aparece quando o navegador permitir.';

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: Math.max(insets.top, theme.spacing.sm),
          width,
        },
      ]}
      accessibilityRole="none"
    >
      <View style={styles.inner}>
        <Text style={styles.title} accessibilityRole="header">
          Instalar HoW
        </Text>
        {isIos ? (
          <>
            <Text style={styles.body}>
              Use os mesmos botões do Safari que utiliza no dia a dia — o guia
              abaixo imita a barra inferior e o menu Partilhar.
            </Text>
            <IosSafariInstallSteps />
          </>
        ) : (
          <Text style={styles.body}>{helperText}</Text>
        )}
        <View
          style={[
            styles.actions,
            singlePrimaryAction && styles.actionsColumnStretch,
          ]}
        >
          {!isIos && installReady ? (
            <Button
              title="Instalar"
              onPress={handleInstall}
              variant="primary"
              accessibilityLabel="Instalar aplicação no dispositivo"
              accessibilityHint="Abre o pedido de instalação do navegador para adicionar HoW ao ecrã principal"
              style={{ ...styles.btn, ...styles.btnInRow }}
            />
          ) : null}
          <Button
            title="Fechar"
            onPress={handleDismiss}
            variant={!isIos && installReady ? 'outline' : 'primary'}
            accessibilityLabel="Fechar aviso de instalação"
            accessibilityHint="Oculta este aviso nesta sessão do navegador"
            style={{
              ...styles.btn,
              ...(!singlePrimaryAction ? styles.btnInRow : {}),
            }}
            fullWidth={singlePrimaryAction}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: theme.colors.primaryDark,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.primary,
  },
  inner: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  body: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    opacity: 0.95,
    marginBottom: theme.spacing.md,
  },
  stepTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  stepTitleSecond: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  stepHint: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    opacity: 0.92,
    marginBottom: theme.spacing.sm,
  },
  safariBarOuter: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    maxWidth: 320,
    alignSelf: 'center',
    width: '100%',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    }),
  },
  safariBarInner: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.xs,
  },
  safariBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
  },
  /** Cada terço da barra centra o respetivo grupo (como no Safari). */
  safariBarThirdLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safariBarThirdCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safariBarThirdRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safariBarIconPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  shareHighlight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.warning,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  tabsGlyphWrap: {
    width: 22,
    height: 18,
    position: 'relative',
  },
  tabsGlyphBack: {
    position: 'absolute',
    right: 0,
    top: 2,
    width: 12,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  tabsGlyphFront: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 12,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    maxWidth: 320,
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
    minHeight: 40,
  },
  sheetPlusWrap: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sheetRowLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'left',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  /** Um único botão (iOS ou só Fechar): coluna e largura total. */
  actionsColumnStretch: {
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
  btn: {
    minWidth: 120,
  },
  /** Par Instalar + Fechar (Android): mesma largura em linha. */
  btnInRow: {
    flex: 1,
    minWidth: 0,
  },
});

export default PwaInstallBanner;
