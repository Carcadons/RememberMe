import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateSecureKey, hashPassword } from './encryption';

const ENCRYPTION_KEY_STORAGE = '@RememberMe_encryption_key';
const PASSWORD_HASH_STORAGE = '@RememberMe_password_hash';
const SALT_STORAGE = '@RememberMe_salt';

export const isBiometricAvailable = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

export const authenticateBiometric = async (): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock RememberMe',
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
};

export const setupPasscode = async (passcode: string): Promise<void> => {
  // Generate salt and hash
  const salt = Math.random().toString(36).substring(2, 15);
  const hash = hashPassword(passcode, salt);
  const encryptionKey = await generateSecureKey();

  // Store securely
  await AsyncStorage.multiSet([
    [PASSWORD_HASH_STORAGE, hash],
    [SALT_STORAGE, salt],
    [ENCRYPTION_KEY_STORAGE, encryptionKey],
  ]);
};

export const verifyPasscode = async (passcode: string): Promise<boolean> => {
  const [storedHash, salt] = await AsyncStorage.multiGet([
    PASSWORD_HASH_STORAGE,
    SALT_STORAGE,
  ]);

  if (!storedHash[1] || !salt[1]) {
    return false;
  }

  const hash = hashPassword(passcode, salt[1]);
  return hash === storedHash[1];
};

export const getEncryptionKey = async (): Promise<string | null> => {
  const key = await AsyncStorage.getItem(ENCRYPTION_KEY_STORAGE);
  return key;
};

export const isFirstLaunch = async (): Promise<boolean> => {
  const key = await AsyncStorage.getItem(ENCRYPTION_KEY_STORAGE);
  return !key;
};

export const deleteAllAuthData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    ENCRYPTION_KEY_STORAGE,
    PASSWORD_HASH_STORAGE,
    SALT_STORAGE,
  ]);
};
