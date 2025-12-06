import NewsViewModel from '../../src/viewmodels/NewsViewModel';
import dataService from '../../src/services/dataService';
import type { Noticia } from '../../src/services/dataService';

jest.mock('../../src/services/dataService');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;

describe('NewsViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscar notícias', () => {
    it('deve buscar notícias com sucesso', async () => {
      const noticiasMock: Noticia[] = [
        {
          id: '1',
          titulo: 'Campanha de Vacinação',
          conteudo: 'A campanha está disponível',
          data: '2024-12-01',
          imagem: null,
        },
      ];

      mockedDataService.buscarNoticias.mockResolvedValue(noticiasMock);

      const viewModel = new NewsViewModel();
      const noticias = await viewModel.buscarNoticias();

      expect(noticias).toEqual(noticiasMock);
      expect(mockedDataService.buscarNoticias).toHaveBeenCalled();
    });

    it('deve retornar array vazio em caso de erro', async () => {
      mockedDataService.buscarNoticias.mockRejectedValue(
        new Error('Erro ao buscar')
      );

      const viewModel = new NewsViewModel();
      const noticias = await viewModel.buscarNoticias();

      expect(noticias).toEqual([]);
      expect(viewModel.error).toBeTruthy();
    });
  });
});
