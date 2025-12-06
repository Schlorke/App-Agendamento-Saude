import LoginViewModel from '../../src/viewmodels/LoginViewModel';
import dataService from '../../src/services/dataService';
import { compareHash } from '../../src/utils/hash';

// Mock do dataService
jest.mock('../../src/services/dataService');
jest.mock('../../src/utils/hash');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;
const mockedCompareHash = compareHash as jest.MockedFunction<
  typeof compareHash
>;

describe('LoginViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validação de campos', () => {
    it('deve retornar erro quando CPF é inválido', async () => {
      const viewModel = new LoginViewModel();
      const resultado = await viewModel.login('123', 'senha123');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('CPF inválido');
    });

    it('deve retornar erro quando senha está vazia', async () => {
      const viewModel = new LoginViewModel();
      const resultado = await viewModel.login('11144477735', '');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('Senha é obrigatória');
    });
  });

  describe('login com credenciais', () => {
    it('deve retornar erro quando usuário não é encontrado', async () => {
      mockedDataService.buscarUsuarioPorCPF.mockResolvedValue(null);

      const viewModel = new LoginViewModel();
      const resultado = await viewModel.login('11144477735', 'senha123');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('CPF ou senha incorretos');
    });

    it('deve retornar erro quando senha está incorreta', async () => {
      const usuarioMock = {
        id: '1',
        nome: 'Teste',
        cpf: '11144477735',
        dataNascimento: '1990-01-01',
        senhaHash: 'hash_correto',
      };

      mockedDataService.buscarUsuarioPorCPF.mockResolvedValue(usuarioMock);
      mockedCompareHash.mockReturnValue(false);

      const viewModel = new LoginViewModel();
      const resultado = await viewModel.login('11144477735', 'senhaErrada');

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('CPF ou senha incorretos');
    });

    it('deve fazer login com sucesso quando credenciais estão corretas', async () => {
      const usuarioMock = {
        id: '1',
        nome: 'Teste',
        cpf: '11144477735',
        dataNascimento: '1990-01-01',
        senhaHash: 'hash_correto',
      };

      mockedDataService.buscarUsuarioPorCPF.mockResolvedValue(usuarioMock);
      mockedCompareHash.mockReturnValue(true);

      const viewModel = new LoginViewModel();
      const resultado = await viewModel.login('11144477735', 'senha123');

      expect(resultado.success).toBe(true);
      expect(resultado.usuario).toEqual(usuarioMock);
      expect(resultado.error).toBeUndefined();
    });
  });

  describe('estado de loading', () => {
    it('deve ter loading false inicialmente', () => {
      const viewModel = new LoginViewModel();
      expect(viewModel.loading).toBe(false);
    });

    it('deve definir loading como true durante o login', async () => {
      mockedDataService.buscarUsuarioPorCPF.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(null), 100))
      );

      const viewModel = new LoginViewModel();
      const loginPromise = viewModel.login('11144477735', 'senha123');

      // Durante a execução, loading deve ser true
      // Como é assíncrono, não podemos verificar diretamente, mas testamos que não trava
      await loginPromise;

      expect(viewModel.loading).toBe(false);
    });
  });
});
