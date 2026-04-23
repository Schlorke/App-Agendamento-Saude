/**
 * @module PwaInstallBannerViewModel
 * @description Regras de visibilidade e interação do banner de instalação PWA (web móvel).
 *
 * @changelog
 * - 2026-04-23 - IA - Funções puras de deteção de plataforma, visibilidade, sessão e `beforeinstallprompt`.
 */
import type { BeforeInstallPromptEvent } from '../types/beforeInstallPrompt';

const SESSION_DISMISS_KEY = 'how_pwa_install_banner_dismissed_v1';

export type PwaUserKind = 'ios' | 'android' | 'desktop';

/**
 * Identifica dispositivo móvel a partir do user-agent (apenas para decisão de UI PWA).
 */
export function detectPwaUserKind(userAgent: string): PwaUserKind {
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios';
  }
  if (/Android/i.test(userAgent)) {
    return 'android';
  }
  return 'desktop';
}

/**
 * Define se o banner de instalação PWA deve ser considerado para exibição.
 */
export function computePwaBannerVisible(params: {
  isStandalone: boolean;
  dismissedFromStorage: boolean;
  userKind: PwaUserKind;
}): boolean {
  if (params.isStandalone) {
    return false;
  }
  if (params.dismissedFromStorage) {
    return false;
  }
  return params.userKind === 'ios' || params.userKind === 'android';
}

/**
 * ViewModel do banner “Adicionar à página inicial” / instalação PWA (apenas web móvel).
 */
export class PwaInstallBannerViewModel {
  readonly userKind: PwaUserKind;

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  constructor(
    userAgent: string =
      typeof globalThis.navigator !== 'undefined' && globalThis.navigator?.userAgent
        ? globalThis.navigator.userAgent
        : ''
  ) {
    this.userKind = detectPwaUserKind(userAgent);
  }

  static readDismissedFromSession(): boolean {
    try {
      return (
        typeof globalThis.sessionStorage !== 'undefined' &&
        globalThis.sessionStorage.getItem(SESSION_DISMISS_KEY) === '1'
      );
    } catch {
      return false;
    }
  }

  static writeDismissedToSession(): void {
    try {
      if (typeof globalThis.sessionStorage !== 'undefined') {
        globalThis.sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
      }
    } catch {
      // quota ou modo privado restrito
    }
  }

  setDeferredPrompt(event: BeforeInstallPromptEvent | null): void {
    this.deferredPrompt = event;
  }

  get hasDeferredInstallPrompt(): boolean {
    return this.deferredPrompt !== null;
  }

  get shouldShowInstallButton(): boolean {
    return this.userKind === 'android' && this.hasDeferredInstallPrompt;
  }

  async promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      return 'unavailable';
    }
    await this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    return outcome === 'accepted' ? 'accepted' : 'dismissed';
  }

  /** App já aberta como PWA / “Adicionada ao ecrã principal” no iOS. */
  static isLikelyStandalone(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      const mq = window.matchMedia?.('(display-mode: standalone)');
      if (mq?.matches) {
        return true;
      }
    } catch {
      // ignore
    }
    const nav = globalThis.navigator as { standalone?: boolean } | undefined;
    const standalone = nav?.standalone;
    return standalone === true;
  }
}
