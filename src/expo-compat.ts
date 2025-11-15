// Expo compatibility layer for web
// Mock implementations of Expo modules for web environment

// Mock local authentication (biometrics)
export const LocalAuthentication = {
  hasHardwareAsync: async (): Promise<boolean> => {
    console.log('Web: Checking for biometric hardware...');
    // Web doesn't have biometric hardware access
    return false;
  },

  isEnrolledAsync: async (): Promise<boolean> => {
    console.log('Web: Checking if biometrics are enrolled...');
    return false;
  },

  authenticateAsync: async (options?: any): Promise<{ success: boolean }> => {
    console.log('Web: Attempting biometric authentication...', options);
    // Biometrics not available on web, return failure
    return { success: false };
  },

  supportedAuthenticationTypesAsync: async (): Promise<any[]> => {
    return [];
  },
};

// Default export
export default LocalAuthentication;
