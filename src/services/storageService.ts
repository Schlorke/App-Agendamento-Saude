import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Chaves de armazenamento
 */
const STORAGE_KEYS = {
  USER_SESSION: '@health_app:user_session',
  USER_DATA: '@health_app:user_data',
};

/**
 * Serviço para gerenciar persistência local usando AsyncStorage
 */
class StorageService {
  /**
   * Salva a sessão do usuário logado
   */
  async salvarSessao(usuarioId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, usuarioId);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
      throw error;
    }
  }

  /**
   * Busca o ID do usuário logado
   */
  async buscarSessao(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      return null;
    }
  }

  /**
   * Remove a sessão do usuário (logout)
   */
  async removerSessao(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Erro ao remover sessão:', error);
      throw error;
    }
  }

  /**
   * Salva dados do usuário localmente
   */
  async salvarDadosUsuario(dados: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }
  }

  /**
   * Busca dados do usuário salvos localmente
   */
  async buscarDadosUsuario(): Promise<unknown | null> {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return dados ? JSON.parse(dados) : null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }
}

export default new StorageService();
