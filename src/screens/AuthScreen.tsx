import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES, isIOS } from '../constants';
import {
  isBiometricAvailable,
  authenticateBiometric,
  setupPasscode,
  verifyPasscode,
  isFirstLaunch,
} from '../utils/auth';
import { database } from '../storage/database';
import { getEncryptionKey } from '../utils/auth';

export default function AuthScreen() {
  const navigation = useNavigation();
  const [isNewUser, setIsNewUser] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const firstTime = await isFirstLaunch();
      const biometricsAvailable = await isBiometricAvailable();

      setIsNewUser(firstTime);
      setCanUseBiometrics(biometricsAvailable);

      if (!firstTime && biometricsAvailable) {
        // Try biometric authentication
        const success = await authenticateBiometric();
        if (success) {
          const key = await getEncryptionKey();
          if (key) {
            await database.init(key);
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' as never }],
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking first time:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupPasscode = async () => {
    if (passcode.length < 4) {
      Alert.alert('Passcode too short', 'Please use at least 4 digits/characters');
      return;
    }

    if (passcode !== confirmPasscode) {
      Alert.alert('Passcodes do not match', 'Please ensure both passcodes match');
      return;
    }

    try {
      setIsLoading(true);
      await setupPasscode(passcode);

      const key = await getEncryptionKey();
      if (key) {
        await database.init(key);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
      }
    } catch (error) {
      console.error('Error setting up passcode:', error);
      Alert.alert('Error', 'Failed to setup passcode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    try {
      setIsLoading(true);
      const success = await verifyPasscode(passcode);

      if (success) {
        const key = await getEncryptionKey();
        if (key) {
          await database.init(key);
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' as never }],
          });
        }
      } else {
        Alert.alert('Incorrect passcode', 'Please try again');
        setPasscode('');
      }
    } catch (error) {
      console.error('Error unlocking:', error);
      Alert.alert('Error', 'Failed to unlock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isNewUser) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={isIOS ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to RememberMe</Text>
            <Text style={styles.subtitle}>
              Set up a secure passcode to protect your data
            </Text>
            {canUseBiometrics && (
              <Text style={styles.biometricText}>
                You can use Face ID/Touch ID after setup
              </Text>
            )}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Create Passcode</Text>
            <TextInput
              style={styles.input}
              value={passcode}
              onChangeText={setPasscode}
              placeholder="Enter passcode (min 4 chars)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Confirm Passcode</Text>
            <TextInput
              style={styles.input}
              value={confirmPasscode}
              onChangeText={setConfirmPasscode}
              placeholder="Confirm your passcode"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSetupPasscode}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Setting up...' : 'Setup Passcode'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Unlock RememberMe</Text>
          <Text style={styles.subtitle}>
            Enter your passcode to access your memory cards
          </Text>
          {canUseBiometrics && (
            <TouchableOpacity onPress={checkFirstTime}>
              <Text style={styles.biometricText}>Use Face ID / Touch ID</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Passcode</Text>
          <TextInput
            style={styles.input}
            value={passcode}
            onChangeText={setPasscode}
            placeholder="Enter your passcode"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleUnlock}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Unlocking...' : 'Unlock'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xxl * 2,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  biometricText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.text.dark,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});
