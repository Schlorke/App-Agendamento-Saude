import { useState, useEffect } from 'react';
import storageService from '../services/storageService';
import dataService from '../services/dataService';
import type { Usuario } from '../services/dataService';

/**
 * Hook para gerenciar autenticação do usuário
 */
export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Carrega a sessão do usuário ao inicializar
   */
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
            // Sessão inválida, limpar
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

  /**
   * Faz login do usuário
   */
  const login = async (usuarioData: Usuario) => {
    try {
      await storageService.salvarSessao(usuarioData.id);
      await storageService.salvarDadosUsuario(usuarioData);
      setUsuario(usuarioData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    try {
      await storageService.removerSessao();
      setUsuario(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  /**
   * Atualiza os dados do usuário na sessão
   */
  const atualizarUsuario = async (usuarioData: Usuario) => {
    try {
      await storageService.salvarDadosUsuario(usuarioData);
      setUsuario(usuarioData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  return {
    usuario,
    loading,
    isAuthenticated,
    login,
    logout,
    atualizarUsuario,
  };
};
