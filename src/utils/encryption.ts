import CryptoES from 'crypto-es';

const SALT_LENGTH = 16;
const IV_LENGTH = 16;
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

export const generateEncryptionKey = async (password: string, salt: string): Promise<string> => {
  const key = CryptoES.PBKDF2(password, salt, {
    keySize: KEY_LENGTH / 32,
    iterations: ITERATIONS
  });
  return key.toString();
};

export const generateSalt = (): string => {
  const salt = CryptoES.lib.WordArray.random(SALT_LENGTH);
  return salt.toString();
};

export const encryptData = (data: string, key: string): string => {
  const iv = CryptoES.lib.WordArray.random(IV_LENGTH);
  const encrypted = CryptoES.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7
  });

  // Combine IV and encrypted data for storage
  return iv.toString() + ':' + encrypted.toString();
};

export const decryptData = (encryptedData: string, key: string): string => {
  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = CryptoES.enc.Hex.parse(parts[0]);
  const encrypted = parts[1];

  const decrypted = CryptoES.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7
  });

  return decrypted.toString(CryptoES.enc.Utf8);
};

export const generateSecureKey = async (): Promise<string> => {
  const randomBytes = CryptoES.lib.WordArray.random(32);
  return randomBytes.toString();
};

export const hashPassword = (password: string, salt: string): string => {
  const hash = CryptoES.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: ITERATIONS
  });
  return hash.toString();
};
