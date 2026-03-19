/**
 * Declaracao minima para crypto-js quando @types/crypto-js nao esta em node_modules.
 */
declare module 'crypto-js' {
  const CryptoJS: {
    SHA256(text: string): { toString(): string };
    AES: {
      encrypt(message: string, key: string): { toString(): string };
      decrypt(
        ciphertext: string,
        key: string
      ): { toString(enc?: unknown): string };
    };
    enc: {
      Utf8: { parse(s: string): string };
      Base64: { stringify(data: unknown): string };
    };
    [key: string]: unknown;
  };
  export default CryptoJS;
}
