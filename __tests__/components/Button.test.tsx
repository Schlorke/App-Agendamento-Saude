import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  it('deve renderizar corretamente', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Clique aqui" onPress={onPress} />
    );

    expect(getByText('Clique aqui')).toBeTruthy();
  });

  it('deve chamar onPress quando pressionado', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Clique aqui" onPress={onPress} />
    );

    fireEvent.press(getByText('Clique aqui'));

    expect(onPress).toHaveBeenCalled();
  });

  it('não deve chamar onPress quando desabilitado', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Clique aqui" onPress={onPress} disabled />
    );

    fireEvent.press(getByText('Clique aqui'));

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
