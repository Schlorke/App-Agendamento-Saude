import RegisterViewModel from '../../src/viewmodels/RegisterViewModel';
import dataService from '../../src/services/dataService';
import { hashPassword } from '../../src/utils/hash';

jest.mock('../../src/services/dataService');
jest.mock('../../src/utils/hash');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;
const mockedHashPassword = hashPassword as jest.MockedFunction<
  typeof hashPassword
>;

describe('RegisterViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validação de campos', () => {
    it('deve retornar erro quando nome está vazio', async () => {
      const viewModel = new RegisterViewModel();
      const resultado = await viewModel.cadastrar({
        nome: '',
        cpf: '11144477735',
        dataNascimento: '1990-01-01',
        senha: 'senha123',
      });

      expect(resultado.success).toBe(false);
      expect(resultado.error?.toLowerCase()).toContain('nome');
    });

    it('deve retornar erro quando CPF é inválido', async () => {
      const viewModel = new RegisterViewModel();
      const resultado = await viewModel.cadastrar({
        nome: 'João Silva',
        cpf: '123',
        dataNascimento: '1990-01-01',
        senha: 'senha123',
      });

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('CPF');
    });

    it('deve retornar erro quando data de nascimento é inválida', async () => {
      const viewModel = new RegisterViewModel();
      const resultado = await viewModel.cadastrar({
        nome: 'João Silva',
        cpf: '11144477735',
        dataNascimento: '2050-01-01',
        senha: 'senha123',
      });

      expect(resultado.success).toBe(false);
      expect(resultado.error).toBeDefined();
    });

    it('deve retornar erro quando senha é muito curta', async () => {
      const viewModel = new RegisterViewModel();
      const resultado = await viewModel.cadastrar({
        nome: 'João Silva',
        cpf: '11144477735',
        dataNascimento: '1990-01-01',
        senha: '12345',
      });

      expect(resultado.success).toBe(false);
      expect(resultado.error?.toLowerCase()).toContain('senha');
    });
  });

  describe('verificação de CPF já cadastrado', () => {
    it('deve retornar erro quando CPF já está cadastrado', async () => {
      mockedDataService.cpfJaCadastrado.mockResolvedValue(true);

      const viewModel = new RegisterViewModel();
      const resultado = await viewModel.cadastrar({
        nome: 'João Silva',
        cpf: '11144477735',
        dataNascimento: '1990-01-01',
        senha: 'senha123',
      });

      expect(resultado.success).toBe(false);
      expect(resultado.error?.toLowerCase()).toContain('cadastrado');
    });
  });

  describe('cadastro bem-sucedido', () => {
    it('deve criar usuário com sucesso quando todos os dados são válidos', async () => {
      mockedDataService.cpfJaCadastrado.mockResolvedValue(false);
      mockedHashPassword.mockReturnValue('hash_da_senha');

      const novoUsuario = {
        id: '3',
        nome: 'João Silva',
        cpf: '11144477735',
        dataNascimento: '1990-01-01',
        senhaHash: 'hash_da_senha',
      };

      mockedDataService.criarUsuario.mockResolvedValue(novoUsuario);

      const viewModel = new RegisterViewModel();
      const resultado = await viewModel.cadastrar({
        nome: 'João Silva',
        cpf: '11144477735',
        dataNascimento: '1990-01-01',
        senha: 'senha123',
      });

      expect(resultado.success).toBe(true);
      expect(resultado.usuario).toEqual(novoUsuario);
      expect(mockedHashPassword).toHaveBeenCalledWith('senha123');
      expect(mockedDataService.criarUsuario).toHaveBeenCalled();
    });
  });
});
