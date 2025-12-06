import CancelAppointmentViewModel from '../../src/viewmodels/CancelAppointmentViewModel';
import dataService from '../../src/services/dataService';
import type { Consulta } from '../../src/services/dataService';

jest.mock('../../src/services/dataService');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;

describe('CancelAppointmentViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscar consultas do usuário', () => {
    it('deve buscar consultas do usuário com sucesso', async () => {
      const consultasMock: Consulta[] = [
        {
          id: '1',
          usuarioId: '1',
          especialidadeId: '1',
          profissionalId: '1',
          data: '2024-12-20',
          horario: '09:00',
          status: 'agendada',
          criadaEm: '2024-12-15T10:00:00Z',
        },
      ];

      mockedDataService.buscarConsultasPorUsuario.mockResolvedValue(
        consultasMock
      );

      const viewModel = new CancelAppointmentViewModel();
      const consultas = await viewModel.buscarConsultasDoUsuario('1');

      expect(consultas).toEqual(consultasMock);
      expect(mockedDataService.buscarConsultasPorUsuario).toHaveBeenCalledWith(
        '1'
      );
    });
  });

  describe('validação de 24h', () => {
    it('deve validar que consulta com mais de 24h pode ser cancelada', () => {
      const viewModel = new CancelAppointmentViewModel();

      // Consulta agendada para daqui a 25 horas
      const dataFutura = new Date();
      dataFutura.setHours(dataFutura.getHours() + 25);
      const dataStr = dataFutura.toISOString().split('T')[0];
      const horarioStr = `${String(dataFutura.getHours()).padStart(2, '0')}:00`;

      const consulta: Consulta = {
        id: '1',
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: dataStr,
        horario: horarioStr,
        status: 'agendada',
        criadaEm: new Date().toISOString(),
      };

      const validacao = viewModel.validarAntecedencia24h(consulta);
      expect(validacao.isValid).toBe(true);
    });

    it('deve bloquear cancelamento com menos de 24h de antecedência', () => {
      const viewModel = new CancelAppointmentViewModel();

      // Consulta agendada para daqui a 23 horas
      const dataFutura = new Date();
      dataFutura.setHours(dataFutura.getHours() + 23);
      const dataStr = dataFutura.toISOString().split('T')[0];
      const horarioStr = `${String(dataFutura.getHours()).padStart(2, '0')}:00`;

      const consulta: Consulta = {
        id: '1',
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: dataStr,
        horario: horarioStr,
        status: 'agendada',
        criadaEm: new Date().toISOString(),
      };

      const validacao = viewModel.validarAntecedencia24h(consulta);
      expect(validacao.isValid).toBe(false);
      expect(validacao.error).toContain('24 horas');
    });
  });

  describe('cancelamento de consulta', () => {
    it('deve cancelar consulta com sucesso quando há mais de 24h de antecedência', async () => {
      // Consulta agendada para daqui a 25 horas
      const dataFutura = new Date();
      dataFutura.setHours(dataFutura.getHours() + 25);
      const dataStr = dataFutura.toISOString().split('T')[0];
      const horarioStr = `${String(dataFutura.getHours()).padStart(2, '0')}:00`;

      const consultaMock: Consulta = {
        id: '1',
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: dataStr,
        horario: horarioStr,
        status: 'agendada',
        criadaEm: new Date().toISOString(),
      };

      const consultaCancelada: Consulta = {
        ...consultaMock,
        status: 'cancelada',
      };

      mockedDataService.buscarConsultaPorId.mockResolvedValue(consultaMock);
      mockedDataService.cancelarConsulta.mockResolvedValue(consultaCancelada);

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('1');

      expect(resultado.success).toBe(true);
      expect(resultado.consulta).toEqual(consultaCancelada);
    });

    it('deve bloquear cancelamento quando há menos de 24h de antecedência', async () => {
      // Consulta agendada para daqui a 23 horas
      const dataFutura = new Date();
      dataFutura.setHours(dataFutura.getHours() + 23);
      const dataStr = dataFutura.toISOString().split('T')[0];
      const horarioStr = `${String(dataFutura.getHours()).padStart(2, '0')}:00`;

      const consultaMock: Consulta = {
        id: '1',
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: dataStr,
        horario: horarioStr,
        status: 'agendada',
        criadaEm: new Date().toISOString(),
      };

      mockedDataService.buscarConsultaPorId.mockResolvedValue(consultaMock);

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('1');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('24 horas');
      expect(mockedDataService.cancelarConsulta).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando consulta não é encontrada', async () => {
      mockedDataService.buscarConsultaPorId.mockResolvedValue(null);

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('999');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('não encontrada');
    });

    it('deve retornar erro quando consulta não é encontrada', async () => {
      mockedDataService.cancelarConsulta.mockRejectedValue(
        new Error('Consulta não encontrada')
      );

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('999');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('não encontrada');
    });

    it('deve retornar erro quando consulta já foi cancelada', async () => {
      const dataFutura = new Date();
      dataFutura.setHours(dataFutura.getHours() + 25);
      const dataStr = dataFutura.toISOString().split('T')[0];
      const horarioStr = `${String(dataFutura.getHours()).padStart(2, '0')}:00`;

      const consultaMock: Consulta = {
        id: '1',
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: dataStr,
        horario: horarioStr,
        status: 'agendada',
        criadaEm: new Date().toISOString(),
      };

      mockedDataService.buscarConsultaPorId.mockResolvedValue(consultaMock);
      mockedDataService.cancelarConsulta.mockRejectedValue(
        new Error('Consulta já foi cancelada')
      );

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('1');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('cancelada');
    });

    it('deve retornar erro quando consulta já foi realizada', async () => {
      const dataFutura = new Date();
      dataFutura.setHours(dataFutura.getHours() + 25);
      const dataStr = dataFutura.toISOString().split('T')[0];
      const horarioStr = `${String(dataFutura.getHours()).padStart(2, '0')}:00`;

      const consultaMock: Consulta = {
        id: '1',
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: dataStr,
        horario: horarioStr,
        status: 'agendada',
        criadaEm: new Date().toISOString(),
      };

      mockedDataService.buscarConsultaPorId.mockResolvedValue(consultaMock);
      mockedDataService.cancelarConsulta.mockRejectedValue(
        new Error('Não é possível cancelar uma consulta já realizada')
      );

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('1');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('realizada');
    });
  });
});
