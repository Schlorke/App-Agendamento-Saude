import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PwaInstallBanner from '../../src/components/PwaInstallBanner';

describe('PwaInstallBanner', () => {
  it('não renderiza conteúdo na plataforma nativa (ex.: iOS nos testes)', () => {
    expect(Platform.OS).not.toBe('web');
    const { queryByText } = render(
      <SafeAreaProvider>
        <PwaInstallBanner />
      </SafeAreaProvider>
    );
    expect(queryByText('Instalar HoW')).toBeNull();
  });
});
