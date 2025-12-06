import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

/**
 * Chaves de armazenamento
 */
const STORAGE_KEYS = {
  USER_SESSION: '@health_app:user_session',
  USER_DATA: '@health_app:user_data',
};

/**
 * Chave de criptografia simétrica.
 * Em produção, essa chave deve vir de variável de ambiente segura.
 */
const ENCRYPTION_KEY = 'health_app_secure_key';

const encrypt = (value: string): string => {
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
};

const decrypt = (value: string): string => {
  const bytes = CryptoJS.AES.decrypt(value, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
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
      const encrypted = encrypt(usuarioId);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, encrypted);
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
      const encrypted = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (!encrypted) {
        return null;
      }
      return decrypt(encrypted);
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
      const serialized = JSON.stringify(dados);
      const encrypted = encrypt(serialized);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, encrypted);
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
      const encrypted = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!encrypted) {
        return null;
      }
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }
}

export default new StorageService();
