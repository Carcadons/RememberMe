import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { database } from '../storage/database';
import { PersonCard } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PrepCardRouteProp = RouteProp<RootStackParamList, 'PrepCard'>;

type Props = {
  navigation: NavigationProp;
  route: PrepCardRouteProp;
};

export default function PrepCardScreen({ navigation, route }: Props) {
  const { personId } = route.params;
  const [person, setPerson] = useState<PersonCard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPerson = useCallback(async () => {
    try {
      setLoading(true);
      const data = await database.getPerson(personId);
      setPerson(data);
    } catch (error) {
      console.error('Error loading prep card:', error);
      Alert.alert('Error', 'Failed to load prep card data');
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    loadPerson();
  }, [loadPerson]);

  useFocusEffect(
    useCallback(() => {
      loadPerson();
    }, [loadPerson])
  );

  const handleCopyToClipboard = () => {
    if (!person) return;

    const prepNote = `
Meeting Prep: ${person.preferredName || person.fullName}

${person.oneLineContext ? `Context: ${person.oneLineContext}` : ''}
${person.title ? `Title: ${person.title}` : ''}
${person.company ? `Company: ${person.company}` : ''}

Quick Facts:
${person.quickFacts.map(fact => `- ${fact.label}: ${fact.value}`).join('\n')}

${person.linkedContacts?.phone ? `Phone: ${person.linkedContacts.phone}` : ''}
${person.linkedContacts?.email ? `Email: ${person.linkedContacts.email}` : ''}
    `.trim();

    Alert.alert('Copied to Clipboard', 'Meeting prep notes copied to clipboard');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!person) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>Person not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Meeting Prep Card</Text>
          </View>
          <TouchableOpacity onPress={handleCopyToClipboard}>
            <Ionicons name="copy-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {person.oneLineContext && (
          <View style={styles.contextSection}>
            <View style={styles.contextHeader}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
              <Text style={styles.contextTitle}>Context</Text>
            </View>
            <Text style={styles.contextText}>{person.oneLineContext}</Text>
          </View>
        )}

        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{person.preferredName || person.fullName}</Text>
            {person.starred && <Ionicons name="star" size={20} color={COLORS.warning} />}
          </View>
          {person.title && (
            <Text style={styles.cardTitle}>{person.title}</Text>
          )}
          {person.company && (
            <Text style={styles.cardCompany}>{person.company}</Text>
          )}
        </View>

        {person.quickFacts.length > 0 && (
          <View style={styles.quickFactsSection}>
            <Text style={styles.sectionTitle}>Quick Facts (Mention These)</Text>
            {person.quickFacts.map((fact, index) => (
              <View key={fact.id} style={styles.quickFactRow}>
                <View style={styles.quickFactNumber}>
                  <Text style={styles.quickFactNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.quickFactContent}>
                  <Text style={styles.quickFactLabel}>{fact.label}</Text>
                  <Text style={styles.quickFactValue}>{fact.value}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {person.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {person.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Meeting Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
            <Text style={styles.tipText}>Mention a quick fact within first 5 minutes</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.tipText}>Ask about something specific since last meeting</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="people-outline" size={20} color={COLORS.success} />
            <Text style={styles.tipText}>Make a personal connection</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="create-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.tipText}>Update this card after your meeting</Text>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {person.linkedContacts.phone && (
            <View style={styles.contactMethod}>
              <Ionicons name="call-outline" size={20} color={COLORS.success} />
              <Text style={styles.contactLabel}>Call:</Text>
              <Text style={styles.contactValue}>{person.linkedContacts.phone}</Text>
            </View>
          )}
          {person.linkedContacts.email && (
            <View style={styles.contactMethod}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactValue}>{person.linkedContacts.email}</Text>
            </View>
          )}
          {person.linkedContacts.linkedinURL && (
            <View style={styles.contactMethod}>
              <Ionicons name="logo-linkedin" size={20} color={COLORS.primary} />
              <Text style={styles.contactLabel}>LinkedIn:</Text>
              <Text style={styles.contactValue}>{person.linkedContacts.linkedinURL}</Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    marginTop: SPACING.md,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  contextSection: {
    backgroundColor: COLORS.chip.yellow,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  contextTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  contextText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  cardContainer: {
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardName: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  cardCompany: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  quickFactsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  quickFactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  quickFactNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  quickFactNumberText: {
    color: COLORS.text.dark,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  quickFactContent: {
    flex: 1,
    paddingTop: SPACING.xs,
  },
  quickFactLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  quickFactValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  tagsSection: {
    marginBottom: SPACING.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.chip.blue,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tagText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  tipsSection: {
    marginBottom: SPACING.lg,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
  },
  tipText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  contactSection: {
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  contactLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
    marginRight: SPACING.md,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    flex: 1,
  },
});
