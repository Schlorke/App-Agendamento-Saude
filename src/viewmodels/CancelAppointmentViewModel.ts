import dataService from '../services/dataService';
import type { Consulta } from '../services/dataService';

/**
 * Resultado de uma tentativa de cancelamento
 */
export interface CancelamentoResult {
  success: boolean;
  consulta?: Consulta;
  error?: string;
}

/**
 * ViewModel para gerenciar lógica de cancelamento de consulta
 */
class CancelAppointmentViewModel {
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
   * Busca consultas de um usuário
   */
  async buscarConsultasDoUsuario(usuarioId: string): Promise<Consulta[]> {
    try {
      this._loading = true;
      return await dataService.buscarConsultasPorUsuario(usuarioId);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      return [];
    } finally {
      this._loading = false;
    }
  }

  /**
   * Cancela uma consulta
   */
  async cancelarConsulta(consultaId: string): Promise<CancelamentoResult> {
    try {
      this._loading = true;
      this._error = null;

      const consulta = await dataService.cancelarConsulta(consultaId);

      return {
        success: true,
        consulta,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao cancelar consulta';

      let mensagemErro = errorMessage;

      if (errorMessage.includes('não encontrada')) {
        mensagemErro = 'Consulta não encontrada';
      } else if (errorMessage.includes('já foi cancelada')) {
        mensagemErro = 'Esta consulta já foi cancelada';
      } else if (errorMessage.includes('já realizada')) {
        mensagemErro =
          'Não é possível cancelar uma consulta que já foi realizada';
      }

      return {
        success: false,
        error: mensagemErro,
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

export default CancelAppointmentViewModel;
