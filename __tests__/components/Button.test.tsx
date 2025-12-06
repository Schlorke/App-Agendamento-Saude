import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Button from '../../src/components/Button';

// Mock das animações
jest.mock('../../src/utils/animations', () => {
  const actual = jest.requireActual('../../src/utils/animations');
  return {
    ...actual,
    scalePress: jest.fn(() => ({
      start: jest.fn(),
    })),
    scaleRelease: jest.fn(() => ({
      start: jest.fn((callback) => {
        // Executa o callback imediatamente para os testes
        if (callback) {
          callback();
        }
      }),
    })),
  };
});

describe('Button Component', () => {
  it('deve renderizar corretamente', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Clique aqui" onPress={onPress} />
    );

    expect(getByText('Clique aqui')).toBeTruthy();
  });

  it('deve chamar onPress quando pressionado', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <Button title="Clique aqui" onPress={onPress} />
    );

    const button = getByLabelText('Clique aqui');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onPress).toHaveBeenCalled();
    });
  });

  it('não deve chamar onPress quando desabilitado', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <Button title="Clique aqui" onPress={onPress} disabled />
    );

    const button = getByLabelText('Clique aqui');
    fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
  });

  it('não deve chamar onPress quando está carregando', () => {
    const onPress = jest.fn();
    const { queryByText } = render(
      <Button title="Clique aqui" onPress={onPress} loading />
    );

    expect(queryByText('Clique aqui')).toBeNull();
  });
});
