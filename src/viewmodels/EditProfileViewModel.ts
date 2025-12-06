import dataService from '../services/dataService';
import { validateCPF, validateDataNascimento } from '../utils/validation';
import type { Usuario } from '../services/dataService';

/**
 * Dados para edição de perfil
 */
export interface EditProfileData {
  nome?: string;
  cpf?: string;
  dataNascimento?: string;
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
    if (dados.nome !== undefined) {
      if (!dados.nome || dados.nome.trim().length === 0) {
        return {
          isValid: false,
          error: 'Nome é obrigatório',
        };
      }
    }

    if (dados.cpf !== undefined) {
      const cpfLimpo = dados.cpf.replace(/\D/g, '');
      if (!validateCPF(cpfLimpo)) {
        return {
          isValid: false,
          error: 'CPF deve ter 11 dígitos',
        };
      }
    }

    if (dados.dataNascimento !== undefined && dados.dataNascimento) {
      const validacaoData = validateDataNascimento(dados.dataNascimento);
      if (!validacaoData.isValid) {
        return {
          isValid: false,
          error: validacaoData.error || 'Data de nascimento inválida',
        };
      }
    }

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

      // Prepara dados para atualização
      const dadosAtualizacao: Partial<EditProfileData> = {};
      if (dados.nome !== undefined) {
        dadosAtualizacao.nome = dados.nome.trim();
      }
      if (dados.cpf !== undefined) {
        dadosAtualizacao.cpf = dados.cpf.replace(/\D/g, '');
      }
      if (dados.dataNascimento !== undefined && dados.dataNascimento) {
        dadosAtualizacao.dataNascimento = dados.dataNascimento;
      }
      if (dados.telefone !== undefined) {
        dadosAtualizacao.telefone = dados.telefone.trim() || undefined;
      }
      if (dados.endereco !== undefined) {
        dadosAtualizacao.endereco = dados.endereco.trim() || undefined;
      }

      // Atualiza o usuário
      const usuarioAtualizado = await dataService.atualizarUsuario(
        usuarioId,
        dadosAtualizacao
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
   * Exclui a conta do usuário
   */
  async excluirConta(
    usuarioId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      this._loading = true;
      this._error = null;

      await dataService.excluirUsuario(usuarioId);

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao excluir conta. Tente novamente.';

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
