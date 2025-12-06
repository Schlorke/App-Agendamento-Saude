import ScheduleViewModel from '../../src/viewmodels/ScheduleViewModel';
import dataService from '../../src/services/dataService';
import type {
  Especialidade,
  Profissional,
  Consulta,
} from '../../src/services/dataService';

jest.mock('../../src/services/dataService');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;

describe('ScheduleViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('carregamento de especialidades', () => {
    it('deve carregar especialidades com sucesso', async () => {
      const especialidadesMock: Especialidade[] = [
        { id: '1', nome: 'Clínico Geral', descricao: 'Atendimento geral' },
        { id: '2', nome: 'Pediatria', descricao: 'Atendimento infantil' },
      ];

      mockedDataService.buscarEspecialidades.mockResolvedValue(
        especialidadesMock
      );

      const viewModel = new ScheduleViewModel();
      const especialidades = await viewModel.carregarEspecialidades();

      expect(especialidades).toEqual(especialidadesMock);
      expect(mockedDataService.buscarEspecialidades).toHaveBeenCalled();
    });
  });

  describe('carregamento de profissionais', () => {
    it('deve carregar profissionais por especialidade', async () => {
      const profissionaisMock: Profissional[] = [
        { id: '1', nome: 'Dr. João', especialidadeId: '1', crm: '12345-SP' },
      ];

      mockedDataService.buscarProfissionaisPorEspecialidade.mockResolvedValue(
        profissionaisMock
      );

      const viewModel = new ScheduleViewModel();
      const profissionais = await viewModel.carregarProfissionais('1');

      expect(profissionais).toEqual(profissionaisMock);
      expect(
        mockedDataService.buscarProfissionaisPorEspecialidade
      ).toHaveBeenCalledWith('1');
    });
  });

  describe('carregamento de horários', () => {
    it('deve carregar horários disponíveis', async () => {
      const horariosMock = ['08:00', '09:00', '10:00'];

      mockedDataService.buscarHorariosDisponiveis.mockResolvedValue(
        horariosMock
      );

      const viewModel = new ScheduleViewModel();
      const horarios = await viewModel.carregarHorariosDisponiveis(
        '2024-12-20',
        '1'
      );

      expect(horarios).toEqual(horariosMock);
      expect(mockedDataService.buscarHorariosDisponiveis).toHaveBeenCalledWith(
        '2024-12-20',
        '1'
      );
    });
  });

  describe('validação de seleções', () => {
    it('deve validar que especialidade é obrigatória', () => {
      const viewModel = new ScheduleViewModel();
      const valido = viewModel.validarSelecao({
        especialidadeId: '',
        profissionalId: '1',
        data: '2024-12-20',
        horario: '09:00',
      });

      expect(valido.isValid).toBe(false);
      expect(valido.error).toContain('especialidade');
    });

    it('deve validar que profissional é obrigatório', () => {
      const viewModel = new ScheduleViewModel();
      const valido = viewModel.validarSelecao({
        especialidadeId: '1',
        profissionalId: '',
        data: '2024-12-20',
        horario: '09:00',
      });

      expect(valido.isValid).toBe(false);
      expect(valido.error).toContain('profissional');
    });

    it('deve validar que data é obrigatória', () => {
      const viewModel = new ScheduleViewModel();
      const valido = viewModel.validarSelecao({
        especialidadeId: '1',
        profissionalId: '1',
        data: '',
        horario: '09:00',
      });

      expect(valido.isValid).toBe(false);
      expect(valido.error).toContain('data');
    });

    it('deve validar que horário é obrigatório', () => {
      const viewModel = new ScheduleViewModel();
      const valido = viewModel.validarSelecao({
        especialidadeId: '1',
        profissionalId: '1',
        data: '2024-12-20',
        horario: '',
      });

      expect(valido.isValid).toBe(false);
      expect(valido.error).toContain('horário');
    });
  });

  describe('criação de agendamento', () => {
    it('deve criar agendamento com sucesso', async () => {
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

      mockedDataService.criarConsulta.mockResolvedValue(consultaMock);

      const viewModel = new ScheduleViewModel();
      const resultado = await viewModel.agendarConsulta({
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: '2024-12-20',
        horario: '09:00',
      });

      expect(resultado.success).toBe(true);
      expect(resultado.consulta).toEqual(consultaMock);
    });

    it('deve retornar erro quando horário está ocupado', async () => {
      mockedDataService.criarConsulta.mockRejectedValue(
        new Error('Horário já está ocupado')
      );

      const viewModel = new ScheduleViewModel();
      const resultado = await viewModel.agendarConsulta({
        usuarioId: '1',
        especialidadeId: '1',
        profissionalId: '1',
        data: '2024-12-20',
        horario: '09:00',
      });

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('ocupado');
    });
  });
});
