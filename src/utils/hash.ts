import CryptoJS from 'crypto-js';

/**
 * Gera hash SHA-256 de uma string (para senhas)
 * @param text - Texto a ser hasheado
 * @returns Hash SHA-256 em hexadecimal
 */
export const hashPassword = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

/**
 * Compara um texto com um hash
 * @param text - Texto a ser comparado
 * @param hash - Hash para comparação
 * @returns true se o hash do texto corresponder ao hash fornecido
 */
export const compareHash = (text: string, hash: string): boolean => {
  const textHash = hashPassword(text);
  return textHash === hash;
};
