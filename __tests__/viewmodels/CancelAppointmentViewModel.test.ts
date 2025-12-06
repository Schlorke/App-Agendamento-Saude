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

  describe('cancelamento de consulta', () => {
    it('deve cancelar consulta com sucesso', async () => {
      const consultaMock: Consulta = {
        id: '1',
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: '2024-12-20',
        horario: '09:00',
        status: 'agendada',
        criadaEm: '2024-12-15T10:00:00Z',
      };

      const consultaCancelada: Consulta = {
        ...consultaMock,
        status: 'cancelada',
      };

      mockedDataService.cancelarConsulta.mockResolvedValue(consultaCancelada);

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('1');

      expect(resultado.success).toBe(true);
      expect(resultado.consulta).toEqual(consultaCancelada);
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
      mockedDataService.cancelarConsulta.mockRejectedValue(
        new Error('Consulta já foi cancelada')
      );

      const viewModel = new CancelAppointmentViewModel();
      const resultado = await viewModel.cancelarConsulta('1');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('cancelada');
    });

    it('deve retornar erro quando consulta já foi realizada', async () => {
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
