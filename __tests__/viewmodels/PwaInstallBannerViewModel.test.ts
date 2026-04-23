import {
  PwaInstallBannerViewModel,
  computePwaBannerVisible,
  detectPwaUserKind,
} from '../../src/viewmodels/PwaInstallBannerViewModel';

describe('detectPwaUserKind', () => {
  it('classifica iPhone', () => {
    expect(
      detectPwaUserKind(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
      )
    ).toBe('ios');
  });

  it('classifica iPad', () => {
    expect(
      detectPwaUserKind('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')
    ).toBe('ios');
  });

  it('classifica Android', () => {
    expect(detectPwaUserKind('Mozilla/5.0 (Linux; Android 14; Pixel 7)')).toBe(
      'android'
    );
  });

  it('classifica desktop', () => {
    expect(detectPwaUserKind('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe(
      'desktop'
    );
  });
});

describe('computePwaBannerVisible', () => {
  it('oculta em modo standalone', () => {
    expect(
      computePwaBannerVisible({
        isStandalone: true,
        dismissedFromStorage: false,
        userKind: 'android',
      })
    ).toBe(false);
  });

  it('oculta quando utilizador fechou o aviso na sessão', () => {
    expect(
      computePwaBannerVisible({
        isStandalone: false,
        dismissedFromStorage: true,
        userKind: 'ios',
      })
    ).toBe(false);
  });

  it('mostra em iOS móvel não standalone', () => {
    expect(
      computePwaBannerVisible({
        isStandalone: false,
        dismissedFromStorage: false,
        userKind: 'ios',
      })
    ).toBe(true);
  });

  it('mostra em Android não standalone', () => {
    expect(
      computePwaBannerVisible({
        isStandalone: false,
        dismissedFromStorage: false,
        userKind: 'android',
      })
    ).toBe(true);
  });

  it('não mostra em desktop', () => {
    expect(
      computePwaBannerVisible({
        isStandalone: false,
        dismissedFromStorage: false,
        userKind: 'desktop',
      })
    ).toBe(false);
  });
});

describe('PwaInstallBannerViewModel — sessão', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(store).forEach((k) => {
      delete store[k];
    });
    Object.defineProperty(global, 'sessionStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => (key in store ? store[key] : null),
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          Object.keys(store).forEach((k) => {
            delete store[k];
          });
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).sessionStorage;
  });

  it('lê e grava dismissed na sessão', () => {
    expect(PwaInstallBannerViewModel.readDismissedFromSession()).toBe(false);
    PwaInstallBannerViewModel.writeDismissedToSession();
    expect(PwaInstallBannerViewModel.readDismissedFromSession()).toBe(true);
  });
});

describe('PwaInstallBannerViewModel — promptInstall', () => {
  it('retorna unavailable sem evento', async () => {
    const vm = new PwaInstallBannerViewModel('Mozilla/5.0 (Linux; Android 14)');
    await expect(vm.promptInstall()).resolves.toBe('unavailable');
  });

  it('executa prompt e devolve accepted', async () => {
    const vm = new PwaInstallBannerViewModel('Mozilla/5.0 (Linux; Android 14)');
    const fakeEvent = {
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({
        outcome: 'accepted' as const,
        platform: 'web',
      }),
    };
    vm.setDeferredPrompt(fakeEvent as never);
    await expect(vm.promptInstall()).resolves.toBe('accepted');
    expect(fakeEvent.prompt).toHaveBeenCalled();
    expect(vm.hasDeferredInstallPrompt).toBe(false);
  });
});

describe('PwaInstallBannerViewModel — isLikelyStandalone', () => {
  const originalWindow = global.window;
  const originalNavigator = global.navigator;

  afterEach(() => {
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });

  it('retorna false sem window', () => {
    // @ts-expect-error teste sem DOM global
    delete global.window;
    expect(PwaInstallBannerViewModel.isLikelyStandalone()).toBe(false);
  });

  it('detecta display-mode standalone', () => {
    global.window = {
      matchMedia: (q: string) => ({
        matches: q === '(display-mode: standalone)',
        media: q,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    } as unknown as Window & typeof globalThis;
    global.navigator = { standalone: false } as unknown as Navigator;
    expect(PwaInstallBannerViewModel.isLikelyStandalone()).toBe(true);
  });

  it('detecta navigator.standalone no iOS', () => {
    global.window = {
      matchMedia: () => ({
        matches: false,
        media: '',
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    } as unknown as Window & typeof globalThis;
    global.navigator = { standalone: true } as unknown as Navigator;
    expect(PwaInstallBannerViewModel.isLikelyStandalone()).toBe(true);
  });
});
