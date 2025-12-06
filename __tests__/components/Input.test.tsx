import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../../src/components/Input';

describe('Input Component', () => {
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
    fireEvent.changeText(input, 'Texto digitado');

    expect(onChangeText).toHaveBeenCalledWith('Texto digitado');
  });
});
