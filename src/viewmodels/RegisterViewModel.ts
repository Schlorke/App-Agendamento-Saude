import dataService from '../services/dataService';
import {
  validateCPF,
  validatePassword,
  validateDataNascimento,
} from '../utils/validation';
import { hashPassword } from '../utils/hash';
import type { Usuario } from '../services/dataService';

/**
 * Dados para cadastro de usuário
 */
export interface CadastroData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  senha: string;
  telefone?: string;
  endereco?: string;
}

/**
 * Resultado de uma tentativa de cadastro
 */
export interface CadastroResult {
  success: boolean;
  usuario?: Usuario;
  error?: string;
}

/**
 * ViewModel para gerenciar lógica de cadastro de usuário
 */
class RegisterViewModel {
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
   * Cadastra um novo usuário
   * @param dados - Dados do usuário para cadastro
   * @returns Resultado do cadastro
   */
  async cadastrar(dados: CadastroData): Promise<CadastroResult> {
    try {
      this._loading = true;
      this._error = null;

      // Validação de nome
      if (!dados.nome || dados.nome.trim().length === 0) {
        return {
          success: false,
          error: 'Nome é obrigatório',
        };
      }

      // Validação de CPF
      if (!validateCPF(dados.cpf)) {
        return {
          success: false,
          error: 'CPF inválido',
        };
      }

      // Validação de data de nascimento
      const validacaoData = validateDataNascimento(dados.dataNascimento);
      if (!validacaoData.isValid) {
        return {
          success: false,
          error: validacaoData.error || 'Data de nascimento inválida',
        };
      }

      // Validação de senha
      if (!validatePassword(dados.senha, 6)) {
        return {
          success: false,
          error: 'Senha deve ter pelo menos 6 caracteres',
        };
      }

      // Verifica se CPF já está cadastrado
      const cpfLimpo = dados.cpf.replace(/\D/g, '');
      const cpfJaCadastrado = await dataService.cpfJaCadastrado(cpfLimpo);

      if (cpfJaCadastrado) {
        return {
          success: false,
          error: 'CPF já está cadastrado',
        };
      }

      // Hash da senha
      const senhaHash = hashPassword(dados.senha);

      // Cria o usuário
      const novoUsuario = await dataService.criarUsuario({
        nome: dados.nome.trim(),
        cpf: cpfLimpo,
        dataNascimento: dados.dataNascimento,
        senhaHash,
        telefone: dados.telefone,
        endereco: dados.endereco,
      });

      return {
        success: true,
        usuario: novoUsuario,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao cadastrar usuário';
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

export default RegisterViewModel;
