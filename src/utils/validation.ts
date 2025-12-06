/**
 * Utilitários de validação
 */

/**
 * Remove caracteres não numéricos de uma string
 */
const apenasNumeros = (str: string): string => {
  return str.replace(/\D/g, '');
};

/**
 * Valida se um CPF é válido
 * @param cpf - CPF a ser validado (com ou sem formatação)
 * @returns true se o CPF for válido, false caso contrário
 */
export const validateCPF = (cpf: string): boolean => {
  const cpfLimpo = apenasNumeros(cpf);

  if (cpfLimpo.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  // Valida primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) {
    return false;
  }

  // Valida segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) {
    return false;
  }

  return true;
};

/**
 * Formata um CPF no padrão XXX.XXX.XXX-XX
 * @param cpf - CPF a ser formatado
 * @returns CPF formatado
 */
export const formatCPF = (cpf: string): string => {
  const cpfLimpo = apenasNumeros(cpf);

  if (cpfLimpo.length !== 11) {
    return cpf;
  }

  return cpfLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

/**
 * Valida se uma senha atende aos requisitos mínimos
 * @param password - Senha a ser validada
 * @param minLength - Tamanho mínimo da senha (padrão: 6)
 * @returns true se a senha for válida, false caso contrário
 */
export const validatePassword = (
  password: string,
  minLength: number = 6
): boolean => {
  if (!password || password.length < minLength) {
    return false;
  }
  return true;
};

/**
 * Valida se uma data de nascimento é válida e se o usuário tem pelo menos 18 anos
 * @param dataNascimento - Data no formato YYYY-MM-DD
 * @returns objeto com isValid e mensagem de erro se houver
 */
export const validateDataNascimento = (
  dataNascimento: string
): { isValid: boolean; error?: string } => {
  if (!dataNascimento) {
    return { isValid: false, error: 'Data de nascimento é obrigatória' };
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dataNascimento)) {
    return {
      isValid: false,
      error: 'Formato de data inválido. Use YYYY-MM-DD',
    };
  }

  // Valida se a data é válida (ex: não permite 31/02)
  const [ano, mes, dia] = dataNascimento.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);

  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return {
      isValid: false,
      error: 'Data de nascimento inválida',
    };
  }

  const hoje = new Date();
  const idade = hoje.getFullYear() - data.getFullYear();
  const mesAtual = hoje.getMonth() - data.getMonth();

  if (mesAtual < 0 || (mesAtual === 0 && hoje.getDate() < data.getDate())) {
    // Ainda não fez aniversário este ano
    if (idade - 1 < 0) {
      return {
        isValid: false,
        error: 'Data de nascimento não pode ser no futuro',
      };
    }
  }

  if (data > hoje) {
    return {
      isValid: false,
      error: 'Data de nascimento não pode ser no futuro',
    };
  }

  return { isValid: true };
};

/**
 * Valida se um telefone está no formato correto
 * @param telefone - Telefone a ser validado
 * @returns true se o telefone for válido
 */
export const validateTelefone = (telefone: string): boolean => {
  const telefoneLimpo = apenasNumeros(telefone);
  // Aceita telefone com 10 ou 11 dígitos (fixo ou celular)
  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
};

/**
 * Formata um telefone no padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatTelefone = (telefone: string): string => {
  const telefoneLimpo = apenasNumeros(telefone);

  if (telefoneLimpo.length === 11) {
    return telefoneLimpo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  if (telefoneLimpo.length === 10) {
    return telefoneLimpo.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }

  return telefone;
};
