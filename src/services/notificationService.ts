import * as Notifications from 'expo-notifications';

/**
 * Configuração padrão para notificações
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Serviço para gerenciar notificações push
 */
class NotificationService {
  /**
   * Solicita permissões de notificação
   */
  async solicitarPermissoes(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissões de notificação:', error);
      return false;
    }
  }

  /**
   * Agenda uma notificação local
   */
  async agendarNotificacao(
    titulo: string,
    corpo: string,
    data: Date,
    dados?: Record<string, unknown>
  ): Promise<string | null> {
    try {
      const permissaoConcedida = await this.solicitarPermissoes();
      if (!permissaoConcedida) {
        console.warn('Permissão de notificação não concedida');
        return null;
      }

      // Para notificações imediatas, usar null. Para agendadas, usar formato com date
      const trigger = data
        ? ({
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: data,
          } as Notifications.DateTriggerInput)
        : null;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: corpo,
          data: dados || {},
        },
        trigger,
      });

      return id;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }

  /**
   * Agenda uma notificação de confirmação de consulta (imediatamente)
   */
  async agendarConfirmacaoConsulta(
    dataConsulta: string,
    horario: string,
    especialidade: string
  ): Promise<string | null> {
    const titulo = 'Consulta Agendada';
    const corpo = `Sua consulta de ${especialidade} foi agendada para ${dataConsulta} às ${horario}`;

    return this.agendarNotificacao(titulo, corpo, new Date(), {
      tipo: 'confirmacao',
      dataConsulta,
      horario,
    });
  }

  /**
   * Agenda uma notificação de lembrete (1 dia antes da consulta)
   */
  async agendarLembreteConsulta(
    dataConsulta: string,
    horario: string,
    especialidade: string
  ): Promise<string | null> {
    try {
      // Calcula a data do lembrete (1 dia antes)
      const dataConsultaObj = new Date(`${dataConsulta}T${horario}:00`);
      const dataLembrete = new Date(dataConsultaObj);
      dataLembrete.setDate(dataLembrete.getDate() - 1);

      // Se a data do lembrete já passou, não agenda
      if (dataLembrete <= new Date()) {
        return null;
      }

      const titulo = 'Lembrete de Consulta';
      const corpo = `Você tem uma consulta de ${especialidade} amanhã às ${horario}`;

      return this.agendarNotificacao(titulo, corpo, dataLembrete, {
        tipo: 'lembrete',
        dataConsulta,
        horario,
      });
    } catch (error) {
      console.error('Erro ao agendar lembrete:', error);
      return null;
    }
  }

  /**
   * Cancela uma notificação por ID
   */
  async cancelarNotificacao(notificacaoId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificacaoId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelarTodasNotificacoes(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  /**
   * Busca todas as notificações agendadas
   */
  async buscarNotificacoesAgendadas(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao buscar notificações agendadas:', error);
      return [];
    }
  }
}

export default new NotificationService();
