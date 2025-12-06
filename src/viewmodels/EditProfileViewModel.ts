import dataService from '../services/dataService';
import type { Usuario } from '../services/dataService';

/**
 * Dados para edição de perfil
 */
export interface EditProfileData {
  telefone?: string;
  endereco?: string;
}

/**
 * Resultado de uma tentativa de edição de perfil
 */
export interface EditProfileResult {
  success: boolean;
  usuario?: Usuario;
  error?: string;
}

/**
 * ViewModel para gerenciar lógica de edição de perfil
 */
class EditProfileViewModel {
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
   * Valida os dados de edição
   */
  validarDados(dados: EditProfileData): { isValid: boolean; error?: string } {
    if (dados.telefone && dados.telefone.trim().length === 0) {
      return {
        isValid: false,
        error: 'Telefone não pode estar vazio',
      };
    }

    if (dados.endereco && dados.endereco.trim().length === 0) {
      return {
        isValid: false,
        error: 'Endereço não pode estar vazio',
      };
    }

    return { isValid: true };
  }

  /**
   * Atualiza o perfil do usuário
   */
  async atualizarPerfil(
    usuarioId: string,
    dados: EditProfileData
  ): Promise<EditProfileResult> {
    try {
      this._loading = true;
      this._error = null;

      // Validação
      const validacao = this.validarDados(dados);
      if (!validacao.isValid) {
        return {
          success: false,
          error: validacao.error,
        };
      }

      // Atualiza o usuário
      const usuarioAtualizado = await dataService.atualizarUsuario(
        usuarioId,
        dados
      );

      return {
        success: true,
        usuario: usuarioAtualizado,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar perfil. Tente novamente.';

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

export default EditProfileViewModel;
