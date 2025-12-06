import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/Auth/LoginScreen';
import { useAuth } from '../../src/hooks/useAuth';
import type { AuthScreenProps } from '../../src/navigation/types';

// Mock do hook useAuth
jest.mock('../../src/hooks/useAuth');
jest.mock('../../src/viewmodels/LoginViewModel');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as AuthScreenProps<'Login'>['navigation'];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockedUseAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      atualizarUsuario: jest.fn(),
      usuario: null,
      loading: false,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('deve renderizar os campos de CPF e senha', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen
        navigation={mockNavigation}
        route={{} as AuthScreenProps<'Login'>['route']}
      />
    );

    expect(getByPlaceholderText('000.000.000-00')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
  });

  it('deve renderizar botão de login', () => {
    const { getByText } = render(
      <LoginScreen
        navigation={mockNavigation}
        route={{} as AuthScreenProps<'Login'>['route']}
      />
    );

    expect(getByText(/entrar/i)).toBeTruthy();
  });

  it('deve renderizar link para cadastro', () => {
    const { getByText } = render(
      <LoginScreen
        navigation={mockNavigation}
        route={{} as AuthScreenProps<'Login'>['route']}
      />
    );

    expect(getByText(/cadastrar/i)).toBeTruthy();
  });

  it('deve permitir digitar CPF e senha', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen
        navigation={mockNavigation}
        route={{} as AuthScreenProps<'Login'>['route']}
      />
    );

    const cpfInput = getByPlaceholderText('000.000.000-00');
    const senhaInput = getByPlaceholderText('Digite sua senha');

    act(() => {
      fireEvent.changeText(cpfInput, '11144477735');
      fireEvent.changeText(senhaInput, 'senha123');
      jest.advanceTimersByTime(300); // Avança animações
    });

    // O CPF é formatado automaticamente quando tem 11 dígitos
    expect(cpfInput.props.value).toBe('111.444.777-35');
    expect(senhaInput.props.value).toBe('senha123');
  });

  it('deve navegar para tela de cadastro quando link é pressionado', () => {
    const { getByText } = render(
      <LoginScreen
        navigation={mockNavigation}
        route={{} as AuthScreenProps<'Login'>['route']}
      />
    );

    const cadastroLink = getByText(/cadastrar/i);
    fireEvent.press(cadastroLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});
