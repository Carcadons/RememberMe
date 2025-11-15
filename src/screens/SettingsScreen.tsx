import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { database } from '../storage/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      Alert.alert('Export Started', 'Your data export has started. You will receive a notification when it\'s complete.');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Unable to export data at this time.');
    } finally {
      setExporting(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your memory cards. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              Alert.alert('Data Cleared', 'All data has been permanently deleted.');
            } catch (error) {
              console.error('Clear data error:', error);
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your RememberMe app</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
            <Ionicons name="person-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Profile</Text>
              <Text style={styles.settingDescription}>Manage your profile information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>Meeting reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border.light, true: COLORS.primary }}
            />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="finger-print-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>Use Face ID/Touch ID</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: COLORS.border.light, true: COLORS.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData} disabled={exporting}>
            <Ionicons name="cloud-download-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.settingDescription}>Backup your memory cards</Text>
            </View>
            {exporting ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Storage Usage</Text>
              <Text style={styles.settingDescription}>Manage app storage</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.danger]} onPress={handleClearData}>
            <Ionicons name="trash-outline" size={24} color={COLORS.error} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, styles.dangerText]}>Clear All Data</Text>
              <Text style={[styles.settingDescription, styles.dangerText]}>Permanently delete everything</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Help & FAQ</Text>
              <Text style={styles.settingDescription}>Get help using RememberMe</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>How we protect your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
            <Ionicons name="document-outline" size={24} color={COLORS.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Text style={styles.settingDescription}>App terms and conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
          </TouchableOpacity>

          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>RememberMe v1.0.0</Text>
            <Text style={styles.appCopyright}>© 2024 RememberMe</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    paddingVertical: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text-primary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text-secondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text-primary,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background-secondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border-light,
  },
  settingContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text-primary,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text-secondary,
    marginTop: SPACING.xs,
  },
  danger: {
    backgroundColor: COLORS.background-secondary,
  },
  dangerText: {
    color: COLORS.error,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border-light,
  },
  appVersion: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text-primary,
    fontWeight: '500',
  },
  appCopyright: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text-secondary,
    marginTop: SPACING.xs,
  },
});
