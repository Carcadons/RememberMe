import React, { useEffect, useState } from 'react';
import { AppRegistry, Platform, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { registerRootComponent } from 'expo';
import { AppNavigator } from './src/navigation/AppNavigator';
import { database } from './src/storage/database';
import { getEncryptionKey } from './src/utils/auth';
import { isFirstLaunch } from './src/utils/auth';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const firstLaunch = await isFirstLaunch();

      if (!firstLaunch) {
        const encryptionKey = await getEncryptionKey();
        if (encryptionKey) {
          await database.init(encryptionKey);
        }
      }

      setIsReady(true);
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to initialize app</Text>
        <Text style={styles.errorDetails}>{error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Initializing RememberMe...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

// Register the app for both Expo and RN web
if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
} else {
  registerRootComponent(App);
}

// Export for web
export default App;
