import dataService from '../services/dataService';
import { validateCPF } from '../utils/validation';
import { compareHash } from '../utils/hash';
import type { Usuario } from '../services/dataService';

/**
 * Resultado de uma tentativa de login
 */
export interface LoginResult {
  success: boolean;
  usuario?: Usuario;
  error?: string;
}

/**
 * ViewModel para gerenciar lógica de login
 */
class LoginViewModel {
  private _loading: boolean = false;
  private _error: string | null = null;

  /**
   * Estado de carregamento
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Mensagem de erro atual
   */
  get error(): string | null {
    return this._error;
  }

  /**
   * Faz login do usuário
   * @param cpf - CPF do usuário (aceita formatado ou não formatado)
   * @param senha - Senha do usuário
   * @returns Resultado do login
   */
  async login(cpf: string, senha: string): Promise<LoginResult> {
    try {
      this._loading = true;
      this._error = null;

      // Limpa o CPF removendo formatação para garantir consistência
      const cpfLimpo = cpf.replace(/\D/g, '');

      // Validação de CPF
      if (!validateCPF(cpfLimpo)) {
        return {
          success: false,
          error: 'CPF inválido',
        };
      }

      // Validação de senha
      if (!senha || senha.trim().length === 0) {
        return {
          success: false,
          error: 'Senha é obrigatória',
        };
      }

      // Busca usuário no banco usando CPF limpo
      const usuario = await dataService.buscarUsuarioPorCPF(cpfLimpo);

      if (!usuario) {
        if (__DEV__) {
          console.log(
            '❌ Login falhou: Usuário não encontrado para CPF:',
            cpfLimpo
          );
        }
        return {
          success: false,
          error: 'CPF ou senha incorretos',
        };
      }

      // Verifica senha
      const senhaCorreta = compareHash(senha, usuario.senhaHash);
      if (__DEV__) {
        console.log('🔍 Debug Login:', {
          cpf: cpfLimpo,
          usuarioEncontrado: !!usuario,
          senhaHashNoBanco: usuario.senhaHash,
          senhaCorreta,
        });
      }

      if (!senhaCorreta) {
        if (__DEV__) {
          console.log('❌ Login falhou: Senha incorreta');
        }
        return {
          success: false,
          error: 'CPF ou senha incorretos',
        };
      }

      return {
        success: true,
        usuario,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao fazer login';
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      this._loading = false;
    }
  }

  /**
   * Limpa o estado de erro
   */
  clearError(): void {
    this._error = null;
  }
}

export default LoginViewModel;
