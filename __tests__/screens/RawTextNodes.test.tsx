import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/Auth/LoginScreen';
import RegisterScreen from '../../src/screens/Auth/RegisterScreen';
import { useAuth } from '../../src/hooks/useAuth';
import type { AuthScreenProps } from '../../src/navigation/types';

jest.mock('../../src/hooks/useAuth');
jest.mock('../../src/viewmodels/LoginViewModel', () => {
  return jest.fn().mockImplementation(() => ({
    login: jest.fn().mockResolvedValue({ success: true }),
  }));
});
jest.mock('../../src/viewmodels/RegisterViewModel', () => {
  return jest.fn().mockImplementation(() => ({
    cadastrar: jest.fn().mockResolvedValue({
      success: true,
      usuario: {
        id: 'user-1',
        nome: 'Usuário Teste',
        cpf: '12345678901',
        dataNascimento: '1990-01-01',
        senhaHash: 'hash',
      },
    }),
  }));
});

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const loginNavigation = {
  navigate: jest.fn(),
} as unknown as AuthScreenProps<'Login'>['navigation'];

const registerNavigation = {
  navigate: jest.fn(),
} as unknown as AuthScreenProps<'Register'>['navigation'];

const registerRoute = {} as unknown as AuthScreenProps<'Register'>['route'];

const loginRoute = {} as unknown as AuthScreenProps<'Login'>['route'];

type RenderNode =
  | string
  | number
  | Array<RenderNode>
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: string | (() => any);
      children?: Array<RenderNode>;
    }
  | null
  | undefined;

const collectRawText = (
  node: RenderNode,
  parentType: string | null,
  found: Array<{ parent: string | null; text: string }>
) => {
  if (!node) {
    return;
  }

  if (typeof node === 'string' || typeof node === 'number') {
    if (parentType !== 'Text') {
      found.push({ parent: parentType, text: String(node) });
    }
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((child) => collectRawText(child, parentType, found));
    return;
  }

  const nodeType =
    typeof node === 'object' && 'type' in node
      ? typeof node.type === 'string'
        ? node.type
        : parentType
      : parentType;
  const children =
    typeof node === 'object' && 'children' in node ? (node.children ?? []) : [];
  children.forEach((child: RenderNode) =>
    collectRawText(child, nodeType, found)
  );
};

describe('Auth screens do not render raw text in non-Text components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      atualizarUsuario: jest.fn(),
      usuario: null,
      loading: false,
      isAuthenticated: false,
    });
  });

  it('LoginScreen evita texto cru em componentes View', () => {
    const rendered = render(
      <LoginScreen navigation={loginNavigation} route={loginRoute} />
    );

    const raw: Array<{ parent: string | null; text: string }> = [];
    collectRawText(rendered.toJSON(), null, raw);

    expect(raw).toEqual([]);
  });

  it('RegisterScreen evita texto cru em componentes View', () => {
    const rendered = render(
      <RegisterScreen navigation={registerNavigation} route={registerRoute} />
    );

    const raw: Array<{ parent: string | null; text: string }> = [];
    collectRawText(rendered.toJSON(), null, raw);

    expect(raw).toEqual([]);
  });
});
