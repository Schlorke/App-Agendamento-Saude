import {
  validateCPF,
  formatCPF,
  validatePassword,
  validateDataNascimento,
  validateTelefone,
  formatTelefone,
} from '../../src/utils/validation';

describe('validation utilities', () => {
  describe('validateCPF', () => {
    it('deve retornar true para CPF válido', () => {
      expect(validateCPF('12345678901')).toBe(true);
      expect(validateCPF('123.456.789-01')).toBe(true);
    });

    it('deve retornar false para CPF inválido', () => {
      expect(validateCPF('12345678900')).toBe(false);
      expect(validateCPF('00000000000')).toBe(false);
      expect(validateCPF('11111111111')).toBe(false);
    });

    it('deve retornar false para CPF com tamanho incorreto', () => {
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('123456789012')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPF corretamente', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('deve retornar CPF sem formatação se não tiver 11 dígitos', () => {
      expect(formatCPF('123')).toBe('123');
      expect(formatCPF('123456')).toBe('123456');
    });
  });

  describe('validatePassword', () => {
    it('deve retornar true para senha válida', () => {
      expect(validatePassword('senha123')).toBe(true);
      expect(validatePassword('123456')).toBe(true);
    });

    it('deve retornar false para senha muito curta', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });

    it('deve aceitar tamanho mínimo customizado', () => {
      expect(validatePassword('12345', 5)).toBe(true);
      expect(validatePassword('1234', 5)).toBe(false);
    });
  });

  describe('validateDataNascimento', () => {
    it('deve retornar válido para data válida', () => {
      const resultado = validateDataNascimento('1990-05-15');
      expect(resultado.isValid).toBe(true);
    });

    it('deve retornar inválido para data no futuro', () => {
      const dataFutura = new Date();
      dataFutura.setFullYear(dataFutura.getFullYear() + 1);
      const resultado = validateDataNascimento(
        dataFutura.toISOString().split('T')[0]
      );
      expect(resultado.isValid).toBe(false);
      expect(resultado.error).toContain('futuro');
    });

    it('deve retornar inválido para formato incorreto', () => {
      const resultado = validateDataNascimento('15/05/1990');
      expect(resultado.isValid).toBe(false);
    });

    it('deve retornar inválido para string vazia', () => {
      const resultado = validateDataNascimento('');
      expect(resultado.isValid).toBe(false);
    });
  });

  describe('validateTelefone', () => {
    it('deve retornar true para telefone válido (10 dígitos)', () => {
      expect(validateTelefone('1134567890')).toBe(true);
      expect(validateTelefone('(11) 3456-7890')).toBe(true);
    });

    it('deve retornar true para celular válido (11 dígitos)', () => {
      expect(validateTelefone('11987654321')).toBe(true);
      expect(validateTelefone('(11) 98765-4321')).toBe(true);
    });

    it('deve retornar false para telefone inválido', () => {
      expect(validateTelefone('12345')).toBe(false);
      expect(validateTelefone('123456789012')).toBe(false);
    });
  });

  describe('formatTelefone', () => {
    it('deve formatar celular corretamente', () => {
      expect(formatTelefone('11987654321')).toBe('(11) 98765-4321');
    });

    it('deve formatar telefone fixo corretamente', () => {
      expect(formatTelefone('1134567890')).toBe('(11) 3456-7890');
    });

    it('deve retornar sem formatação se não tiver tamanho válido', () => {
      expect(formatTelefone('123')).toBe('123');
    });
  });
});
