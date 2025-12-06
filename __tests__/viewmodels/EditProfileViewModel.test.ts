import EditProfileViewModel from '../../src/viewmodels/EditProfileViewModel';
import dataService from '../../src/services/dataService';
import type { Usuario } from '../../src/services/dataService';

jest.mock('../../src/services/dataService');

const mockedDataService = dataService as jest.Mocked<typeof dataService>;

describe('EditProfileViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validação de dados', () => {
    it('deve validar dados corretos', () => {
      const viewModel = new EditProfileViewModel();
      const validacao = viewModel.validarDados({
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123',
      });

      expect(validacao.isValid).toBe(true);
    });

    it('deve rejeitar telefone vazio', () => {
      const viewModel = new EditProfileViewModel();
      const validacao = viewModel.validarDados({
        telefone: '   ',
        endereco: 'Rua das Flores, 123',
      });

      expect(validacao.isValid).toBe(false);
      expect(validacao.error).toContain('Telefone');
    });

    it('deve rejeitar endereço vazio', () => {
      const viewModel = new EditProfileViewModel();
      const validacao = viewModel.validarDados({
        telefone: '(11) 98765-4321',
        endereco: '   ',
      });

      expect(validacao.isValid).toBe(false);
      expect(validacao.error).toContain('Endereço');
    });
  });

  describe('atualização de perfil', () => {
    it('deve atualizar perfil com sucesso', async () => {
      const usuarioAtualizado: Usuario = {
        id: '1',
        nome: 'Maria Silva',
        cpf: '12345678901',
        dataNascimento: '1990-05-15',
        senhaHash: 'hash',
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123',
      };

      mockedDataService.atualizarUsuario.mockResolvedValue(usuarioAtualizado);

      const viewModel = new EditProfileViewModel();
      const resultado = await viewModel.atualizarPerfil('1', {
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123',
      });

      expect(resultado.success).toBe(true);
      expect(resultado.usuario).toEqual(usuarioAtualizado);
    });

    it('deve retornar erro quando validação falha', async () => {
      const viewModel = new EditProfileViewModel();
      const resultado = await viewModel.atualizarPerfil('1', {
        telefone: '   ',
        endereco: 'Rua das Flores, 123',
      });

      expect(resultado.success).toBe(false);
      expect(resultado.error).toBeTruthy();
      expect(mockedDataService.atualizarUsuario).not.toHaveBeenCalled();
    });
  });
});
