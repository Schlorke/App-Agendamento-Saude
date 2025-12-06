import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react';
import storageService from '../services/storageService';
import dataService from '../services/dataService';
import type { Usuario } from '../services/dataService';

/**
 * @component AuthProvider
 * @description Provedor global de autenticação que compartilha sessão entre telas (Web e Expo). Usa AsyncStorage para persistir sessão e dados do usuário.
 *
 * @props
 *   - `children`: {React.ReactNode} - Elementos que receberão o contexto de autenticação.
 *
 * @state
 *   - `usuario`: {Usuario | null} - Usuário logado, quando houver.
 *   - `loading`: {boolean} - Indica se a sessão está sendo carregada.
 *   - `isAuthenticated`: {boolean} - Flag de autenticação global.
 *
 * @known_issues
 *   - Sessões abertas em múltiplas abas podem ser sobrescritas, pois não há sincronização cross-tab.
 *
 * @changelog
 *   - 2025-12-06 - IA - Convertido para Context API com provider global e persistência para Web/Expo.
 *   - 2025-12-06 - IA - Corrigido useMemo para usar useCallback nas funções e garantir atualização correta do contexto.
 */

interface AuthContextValue {
  usuario: Usuario | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (usuarioData: Usuario) => Promise<void>;
  logout: () => Promise<void>;
  atualizarUsuario: (usuarioData: Usuario) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const carregarSessao = async () => {
      try {
        const usuarioId = await storageService.buscarSessao();
        if (usuarioId) {
          const usuarioData = await dataService.buscarUsuarioPorId(usuarioId);
          if (usuarioData) {
            setUsuario(usuarioData);
            setIsAuthenticated(true);
          } else {
            await storageService.removerSessao();
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarSessao();
  }, []);

  const login = useCallback(async (usuarioData: Usuario) => {
    await storageService.salvarSessao(usuarioData.id);
    await storageService.salvarDadosUsuario(usuarioData);
    setUsuario(usuarioData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await storageService.removerSessao();
    setUsuario(null);
    setIsAuthenticated(false);
  }, []);

  const atualizarUsuario = useCallback(async (usuarioData: Usuario) => {
    await storageService.salvarDadosUsuario(usuarioData);
    setUsuario(usuarioData);
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      loading,
      isAuthenticated,
      login,
      logout,
      atualizarUsuario,
    }),
    [usuario, loading, isAuthenticated, login, logout, atualizarUsuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
