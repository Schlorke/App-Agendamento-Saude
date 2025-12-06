import dataService from '../services/dataService';
import notificationService from '../services/notificationService';
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
   * Valida se há pelo menos 24 horas de antecedência para cancelar uma consulta
   */
  validarAntecedencia24h(consulta: Consulta): {
    isValid: boolean;
    error?: string;
  } {
    const agora = new Date();
    const dataConsulta = new Date(`${consulta.data}T${consulta.horario}:00`);

    // Calcula a diferença em milissegundos
    const diferencaMs = dataConsulta.getTime() - agora.getTime();

    // 24 horas = 24 * 60 * 60 * 1000 milissegundos
    const vinteQuatroHorasMs = 24 * 60 * 60 * 1000;

    if (diferencaMs < vinteQuatroHorasMs) {
      return {
        isValid: false,
        error:
          'Não é possível cancelar uma consulta com menos de 24 horas de antecedência',
      };
    }

    return { isValid: true };
  }

  /**
   * Cancela uma consulta
   */
  async cancelarConsulta(consultaId: string): Promise<CancelamentoResult> {
    try {
      this._loading = true;
      this._error = null;

      // Busca a consulta primeiro para validar
      const consulta = await dataService.buscarConsultaPorId(consultaId);

      if (!consulta) {
        return {
          success: false,
          error: 'Consulta não encontrada',
        };
      }

      // Valida se há pelo menos 24h de antecedência
      const validacao = this.validarAntecedencia24h(consulta);
      if (!validacao.isValid) {
        return {
          success: false,
          error: validacao.error || 'Não é possível cancelar esta consulta',
        };
      }

      // Cancela a consulta
      const consultaCancelada = await dataService.cancelarConsulta(consultaId);

      // Cancela notificações relacionadas à consulta
      try {
        const notificacoesAgendadas =
          await notificationService.buscarNotificacoesAgendadas();
        for (const notificacao of notificacoesAgendadas) {
          const dados = notificacao.content.data as {
            tipo?: string;
            dataConsulta?: string;
            horario?: string;
          };
          if (
            dados?.dataConsulta === consulta.data &&
            dados?.horario === consulta.horario
          ) {
            await notificationService.cancelarNotificacao(
              notificacao.identifier
            );
          }
        }
      } catch (error) {
        // Não falha o cancelamento se houver erro ao cancelar notificações
        console.error('Erro ao cancelar notificações:', error);
      }

      return {
        success: true,
        consulta: consultaCancelada,
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
