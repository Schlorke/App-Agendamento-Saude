import dataService from '../services/dataService';
import notificationService from '../services/notificationService';
import type {
  Especialidade,
  Profissional,
  Consulta,
} from '../services/dataService';

/**
 * Dados para agendamento de consulta
 */
export interface AgendamentoData {
  usuarioId: string;
  especialidadeId: string;
  profissionalId: string;
  data: string;
  horario: string;
}

/**
 * Dados de seleção para validação
 */
export interface SelecaoData {
  especialidadeId: string;
  profissionalId: string;
  data: string;
  horario: string;
}

/**
 * Resultado de uma tentativa de agendamento
 */
export interface AgendamentoResult {
  success: boolean;
  consulta?: Consulta;
  error?: string;
}

/**
 * Resultado de validação
 */
export interface ValidacaoResult {
  isValid: boolean;
  error?: string;
}

/**
 * ViewModel para gerenciar lógica de agendamento de consulta
 */
class ScheduleViewModel {
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
   * Carrega todas as especialidades disponíveis
   */
  async carregarEspecialidades(): Promise<Especialidade[]> {
    try {
      this._loading = true;
      return await dataService.buscarEspecialidades();
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error);
      return [];
    } finally {
      this._loading = false;
    }
  }

  /**
   * Carrega profissionais de uma especialidade
   */
  async carregarProfissionais(
    especialidadeId: string
  ): Promise<Profissional[]> {
    try {
      this._loading = true;
      if (!especialidadeId) {
        return [];
      }
      return await dataService.buscarProfissionaisPorEspecialidade(
        especialidadeId
      );
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      return [];
    } finally {
      this._loading = false;
    }
  }

  /**
   * Carrega horários disponíveis para uma data e profissional
   */
  async carregarHorariosDisponiveis(
    data: string,
    profissionalId: string
  ): Promise<string[]> {
    try {
      this._loading = true;
      if (!data || !profissionalId) {
        return [];
      }
      return await dataService.buscarHorariosDisponiveis(data, profissionalId);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      return [];
    } finally {
      this._loading = false;
    }
  }

  /**
   * Valida se todas as seleções foram feitas
   */
  validarSelecao(selecao: SelecaoData): ValidacaoResult {
    if (!selecao.especialidadeId) {
      return {
        isValid: false,
        error: 'Selecione uma especialidade',
      };
    }

    if (!selecao.profissionalId) {
      return {
        isValid: false,
        error: 'Selecione um profissional',
      };
    }

    if (!selecao.data) {
      return {
        isValid: false,
        error: 'Selecione uma data',
      };
    }

    if (!selecao.horario) {
      return {
        isValid: false,
        error: 'Selecione um horário',
      };
    }

    return {
      isValid: true,
    };
  }

  /**
   * Agenda uma consulta
   */
  async agendarConsulta(dados: AgendamentoData): Promise<AgendamentoResult> {
    try {
      this._loading = true;
      this._error = null;

      // Validação
      const validacao = this.validarSelecao({
        especialidadeId: dados.especialidadeId,
        profissionalId: dados.profissionalId,
        data: dados.data,
        horario: dados.horario,
      });

      if (!validacao.isValid) {
        return {
          success: false,
          error: validacao.error,
        };
      }

      // Cria a consulta
      const consulta = await dataService.criarConsulta({
        usuarioId: dados.usuarioId,
        especialidadeId: dados.especialidadeId,
        profissionalId: dados.profissionalId,
        data: dados.data,
        horario: dados.horario,
      });

      // Agenda notificações
      try {
        const especialidade = await dataService
          .buscarEspecialidades()
          .then((especialidades) =>
            especialidades.find((e) => e.id === dados.especialidadeId)
          );

        if (especialidade) {
          // Notificação de confirmação (imediatamente)
          await notificationService.agendarConfirmacaoConsulta(
            dados.data,
            dados.horario,
            especialidade.nome
          );

          // Notificação de lembrete (1 dia antes)
          await notificationService.agendarLembreteConsulta(
            dados.data,
            dados.horario,
            especialidade.nome
          );
        }
      } catch (error) {
        // Não falha o agendamento se houver erro nas notificações
        console.error('Erro ao agendar notificações:', error);
      }

      return {
        success: true,
        consulta,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao agendar consulta';

      let mensagemErro = errorMessage;
      if (errorMessage.includes('ocupado')) {
        mensagemErro = 'Horário já está ocupado. Escolha outro horário.';
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

export default ScheduleViewModel;
