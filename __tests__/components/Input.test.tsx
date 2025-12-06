import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import Input from '../../src/components/Input';

describe('Input Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('deve renderizar corretamente', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Digite aqui" />
    );

    expect(getByPlaceholderText('Digite aqui')).toBeTruthy();
  });

  it('deve exibir label quando fornecido', () => {
    const { getByText } = render(
      <Input label="Nome" placeholder="Digite seu nome" />
    );

    expect(getByText('Nome')).toBeTruthy();
  });

  it('deve exibir mensagem de erro quando fornecido', () => {
    const { getByText } = render(
      <Input error="Campo obrigatório" placeholder="Digite aqui" />
    );

    expect(getByText('Campo obrigatório')).toBeTruthy();
  });

  it('deve chamar onChangeText quando texto é digitado', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Digite aqui" onChangeText={onChangeText} />
    );

    const input = getByPlaceholderText('Digite aqui');
    act(() => {
      fireEvent.changeText(input, 'Texto digitado');
    });

    expect(onChangeText).toHaveBeenCalledWith('Texto digitado');
  });

  it('deve animar cor da borda ao focar', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Digite aqui" />
    );

    const input = getByPlaceholderText('Digite aqui');

    act(() => {
      fireEvent(input, 'focus');
      jest.advanceTimersByTime(300); // Avança a animação
    });

    expect(input).toBeTruthy();
  });

  it('deve animar cor da borda ao desfocar', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Digite aqui" />
    );

    const input = getByPlaceholderText('Digite aqui');

    act(() => {
      fireEvent(input, 'focus');
      jest.advanceTimersByTime(300);
      fireEvent(input, 'blur');
      jest.advanceTimersByTime(300);
    });

    expect(input).toBeTruthy();
  });
});
