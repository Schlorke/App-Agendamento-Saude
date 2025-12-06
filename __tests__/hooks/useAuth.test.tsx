import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/hooks/useAuth';
import storageService from '../../src/services/storageService';
import dataService, { Usuario } from '../../src/services/dataService';

jest.mock('../../src/services/storageService');
jest.mock('../../src/services/dataService');

const mockUser: Usuario = {
  id: '1',
  nome: 'Teste',
  cpf: '12345678900',
  dataNascimento: '2000-01-01',
  senhaHash: 'hash',
};

const Consumer = () => {
  const { isAuthenticated, login, loading } = useAuth();

  useEffect(() => {
    login(mockUser);
  }, [login]);

  if (loading) {
    return <Text>loading</Text>;
  }

  return <Text>{isAuthenticated ? 'autenticado' : 'anonimo'}</Text>;
};

const BadConsumer = () => {
  useAuth();
  return <Text>invalid</Text>;
};

describe('useAuth', () => {
  beforeEach(() => {
    (storageService.buscarSessao as jest.Mock).mockResolvedValue(null);
    (storageService.salvarSessao as jest.Mock).mockResolvedValue(undefined);
    (storageService.salvarDadosUsuario as jest.Mock).mockResolvedValue(
      undefined
    );
    (storageService.removerSessao as jest.Mock).mockResolvedValue(undefined);
    (dataService.buscarUsuarioPorId as jest.Mock).mockResolvedValue(null);
  });

  it('atualiza estado global ao fazer login', async () => {
    const { getByText } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('autenticado')).toBeTruthy();
    });
  });

  it('gera erro ao usar fora do AuthProvider', () => {
    expect(() => render(<BadConsumer />)).toThrow(
      'useAuth deve ser usado dentro de AuthProvider'
    );
  });
});
