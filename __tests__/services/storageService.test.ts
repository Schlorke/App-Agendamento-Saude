import AsyncStorage from '@react-native-async-storage/async-storage';
import storageService from '../../src/services/storageService';

describe('storageService - criptografia', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('deve salvar e recuperar sessão criptografada', async () => {
    await storageService.salvarSessao('usuario-123');

    const rawStored = await AsyncStorage.getItem('@health_app:user_session');
    expect(rawStored).not.toBeNull();
    expect(rawStored).not.toBe('usuario-123');

    const session = await storageService.buscarSessao();
    expect(session).toBe('usuario-123');
  });

  it('deve salvar e recuperar dados do usuário criptografados', async () => {
    const dadosUsuario = { id: '1', nome: 'Maria', cpf: '12345678901' };

    await storageService.salvarDadosUsuario(dadosUsuario);

    const rawStored = await AsyncStorage.getItem('@health_app:user_data');
    expect(rawStored).not.toBeNull();
    expect(rawStored).not.toContain('Maria');
    expect(rawStored).not.toContain('12345678901');

    const dadosLidos = await storageService.buscarDadosUsuario();
    expect(dadosLidos).toEqual(dadosUsuario);
  });
});
