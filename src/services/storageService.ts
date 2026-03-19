/**
 * @service StorageService
 * @description Serviço para gerenciar persistência local usando AsyncStorage.
 * Implementa criptografia opcional com fallback seguro para ambientes onde a criptografia
 * não está disponível (como Expo Go em iOS). Dados são salvos criptografados quando possível,
 * mas o serviço funciona mesmo sem criptografia para garantir compatibilidade.
 *
 * @features
 *   - Criptografia automática quando disponível
 *   - Fallback seguro para ambientes sem suporte a criptografia
 *   - Compatibilidade com dados legados (criptografados e não criptografados)
 *   - Tratamento robusto de erros que não quebra o fluxo da aplicação
 *
 * @known_issues
 *   - No Expo Go (especialmente iOS), a biblioteca crypto-js pode não funcionar.
 *     O serviço detecta isso automaticamente e usa fallback sem criptografia.
 *
 * @changelog
 *   - 2025-12-06 - IA - Adicionado fallback seguro para criptografia no Expo Go.
 *   - 2025-12-06 - IA - Melhorado tratamento de erros para não quebrar login quando criptografia falha.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

/**
 * Chaves de armazenamento
 */
const STORAGE_KEYS = {
  USER_SESSION: '@health_app:user_session',
  USER_DATA: '@health_app:user_data',
  ENCRYPTION_ENABLED: '@health_app:encryption_enabled',
};

/**
 * Chave de criptografia simétrica.
 * Em produção, essa chave deve vir de variável de ambiente segura.
 */
const ENCRYPTION_KEY = 'health_app_secure_key';

/**
 * Flag para controlar se a criptografia está disponível
 */
let encryptionAvailable: boolean | null = null;

/**
 * Verifica se a criptografia está disponível no ambiente atual
 */
const checkEncryptionAvailability = (): boolean => {
  if (encryptionAvailable !== null) {
    return encryptionAvailable;
  }

  try {
    // Tenta fazer uma operação simples de criptografia
    const testValue = 'test';
    CryptoJS.AES.encrypt(testValue, ENCRYPTION_KEY);
    encryptionAvailable = true;
    return true;
  } catch {
    if (__DEV__) {
      console.warn(
        '⚠️ Criptografia não disponível no ambiente atual. Dados serão salvos sem criptografia.'
      );
    }
    encryptionAvailable = false;
    return false;
  }
};

/**
 * Criptografa um valor com fallback seguro
 */
const encrypt = (value: string): string => {
  try {
    if (checkEncryptionAvailability()) {
      return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
    }
    // Fallback: retorna o valor sem criptografia com prefixo para identificação
    return `PLAIN:${value}`;
  } catch (error) {
    if (__DEV__) {
      console.warn('Erro ao criptografar, usando fallback:', error);
    }
    // Fallback seguro: salva sem criptografia
    encryptionAvailable = false;
    return `PLAIN:${value}`;
  }
};

/**
 * Descriptografa um valor ou retorna o valor original se não estiver criptografado
 */
const decrypt = (value: string): string => {
  try {
    // Verifica se é valor sem criptografia (prefixo PLAIN:)
    if (value.startsWith('PLAIN:')) {
      return value.substring(6); // Remove o prefixo 'PLAIN:'
    }

    // Tenta descriptografar
    if (checkEncryptionAvailability()) {
      const bytes = CryptoJS.AES.decrypt(value, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      // Se descriptografou com sucesso e não está vazio, retorna
      if (decrypted) {
        return decrypted;
      }
    }

    // Fallback: retorna o valor original (pode ser legado não criptografado)
    return value;
  } catch (error) {
    if (__DEV__) {
      console.warn('Erro ao descriptografar, tentando valor original:', error);
    }
    // Tenta retornar o valor original se falhar
    if (value.startsWith('PLAIN:')) {
      return value.substring(6);
    }
    return value;
  }
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
      // Em caso de erro, tenta salvar sem criptografia como fallback
      console.error('Erro ao salvar sessão com criptografia:', error);
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_SESSION,
          `PLAIN:${usuarioId}`
        );
        if (__DEV__) {
          console.warn('Sessão salva sem criptografia devido a erro');
        }
      } catch (fallbackError) {
        console.error(
          'Erro crítico ao salvar sessão (fallback falhou):',
          fallbackError
        );
        // Apenas em último caso lança o erro (cause para preserve-caught-error)
        throw new Error('Não foi possível salvar a sessão do usuário', {
          cause: fallbackError,
        });
      }
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
      await AsyncStorage.removeItem(STORAGE_KEYS.ENCRYPTION_ENABLED);
    } catch (error) {
      console.error('Erro ao remover sessão:', error);
      // Não lança erro para não quebrar o logout
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
      // Em caso de erro, tenta salvar sem criptografia como fallback
      console.error('Erro ao salvar dados do usuário com criptografia:', error);
      try {
        const serialized = JSON.stringify(dados);
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          `PLAIN:${serialized}`
        );
        if (__DEV__) {
          console.warn(
            'Dados do usuário salvos sem criptografia devido a erro'
          );
        }
      } catch (fallbackError) {
        console.error(
          'Erro crítico ao salvar dados do usuário (fallback falhou):',
          fallbackError
        );
        // Não lança erro para não quebrar o login, apenas loga
        if (__DEV__) {
          console.warn(
            'Não foi possível salvar dados do usuário, mas o login continuará'
          );
        }
      }
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
