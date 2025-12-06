import PharmaciesViewModel from '../../src/viewmodels/PharmaciesViewModel';
import dataService from '../../src/services/dataService';
import type { Farmacia } from '../../src/services/dataService';

jest.mock('../../src/services/dataService');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;

describe('PharmaciesViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscar farmácias', () => {
    it('deve buscar farmácias com sucesso', async () => {
      const farmaciasMock: Farmacia[] = [
        {
          id: '1',
          nome: 'Farmácia Popular',
          endereco: 'Rua Central, 100',
          telefone: '(11) 3456-7890',
          plantao: true,
          horario: '24 horas',
        },
      ];

      mockedDataService.buscarFarmacias.mockResolvedValue(farmaciasMock);

      const viewModel = new PharmaciesViewModel();
      const farmacias = await viewModel.buscarFarmacias();

      expect(farmacias).toEqual(farmaciasMock);
      expect(mockedDataService.buscarFarmacias).toHaveBeenCalled();
    });

    it('deve retornar array vazio em caso de erro', async () => {
      mockedDataService.buscarFarmacias.mockRejectedValue(
        new Error('Erro ao buscar')
      );

      const viewModel = new PharmaciesViewModel();
      const farmacias = await viewModel.buscarFarmacias();

      expect(farmacias).toEqual([]);
      expect(viewModel.error).toBeTruthy();
    });
  });
});
