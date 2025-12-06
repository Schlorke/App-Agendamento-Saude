import MedicationsViewModel from '../../src/viewmodels/MedicationsViewModel';
import dataService from '../../src/services/dataService';
import type { Medicamento } from '../../src/services/dataService';

jest.mock('../../src/services/dataService');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;

describe('MedicationsViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscar medicamentos', () => {
    it('deve buscar medicamentos com sucesso', async () => {
      const medicamentosMock: Medicamento[] = [
        {
          id: '1',
          nome: 'Paracetamol',
          descricao: 'Analgésico e antitérmico',
          dosagem: '500mg',
        },
      ];

      mockedDataService.buscarMedicamentos.mockResolvedValue(medicamentosMock);

      const viewModel = new MedicationsViewModel();
      const medicamentos = await viewModel.buscarMedicamentos();

      expect(medicamentos).toEqual(medicamentosMock);
      expect(mockedDataService.buscarMedicamentos).toHaveBeenCalled();
    });

    it('deve retornar array vazio em caso de erro', async () => {
      mockedDataService.buscarMedicamentos.mockRejectedValue(
        new Error('Erro ao buscar')
      );

      const viewModel = new MedicationsViewModel();
      const medicamentos = await viewModel.buscarMedicamentos();

      expect(medicamentos).toEqual([]);
      expect(viewModel.error).toBeTruthy();
    });
  });
});
