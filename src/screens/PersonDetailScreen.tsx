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
type PersonDetailRouteProp = RouteProp<RootStackParamList, 'PersonDetail'>;

type Props = {
  navigation: NavigationProp;
  route: PersonDetailRouteProp;
};

export default function PersonDetailScreen({ navigation, route }: Props) {
  const { personId } = route.params;
  const [person, setPerson] = useState<PersonCard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPerson = useCallback(async () => {
    try {
      setLoading(true);
      const data = await database.getPerson(personId);
      setPerson(data);
    } catch (error) {
      console.error('Error loading person:', error);
      Alert.alert('Error', 'Failed to load person data');
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

  const handleEdit = () => {
    if (person) {
      navigation.navigate('EditPerson', { personId: person.id });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Person',
      'Are you sure you want to delete this person? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.deletePerson(personId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting person:', error);
              Alert.alert('Error', 'Failed to delete person');
            }
          },
        },
      ]
    );
  };

  const handleToggleStar = async () => {
    if (!person) return;

    try {
      const updatedPerson = {
        ...person,
        starred: !person.starred,
        updatedAt: new Date(),
      };
      await database.updatePerson(updatedPerson);
      setPerson(updatedPerson);
    } catch (error) {
      console.error('Error updating starred status:', error);
    }
  };

  const handleOpenPrepCard = () => {
    if (person) {
      navigation.navigate('PrepCard', { personId: person.id });
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <Text style={styles.title}>{person.fullName}</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleToggleStar}>
              <Ionicons
                name={person.starred ? 'star' : 'star-outline'}
                size={28}
                color={person.starred ? COLORS.warning : COLORS.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {person.preferredName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Name</Text>
            <Text style={styles.sectionContent}>{person.preferredName}</Text>
          </View>
        )}

        {person.title && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title</Text>
            <Text style={styles.sectionContent}>{person.title}</Text>
          </View>
        )}

        {person.company && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company</Text>
            <Text style={styles.sectionContent}>{person.company}</Text>
          </View>
        )}

        {person.oneLineContext && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Context</Text>
            <Text style={styles.sectionContent}>{person.oneLineContext}</Text>
          </View>
        )}

        {person.quickFacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Facts</Text>
            <View style={styles.quickFactsContainer}>
              {person.quickFacts.map((fact) => (
                <View key={fact.id} style={styles.quickFact}>
                  {fact.icon && (
                    <Ionicons name={fact.icon as any} size={20} color={COLORS.primary} style={styles.quickFactIcon} />
                  )}
                  <View style={styles.quickFactContent}>
                    <Text style={styles.quickFactLabel}>{fact.label}</Text>
                    <Text style={styles.quickFactValue}>{fact.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {person.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {person.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {person.linkedContacts?.phone || person.linkedContacts?.email || person.linkedContacts?.linkedinURL ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactContainer}>
              {person.linkedContacts.phone && (
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.contactText}>{person.linkedContacts.phone}</Text>
                </View>
              )}
              {person.linkedContacts.email && (
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.contactText}>{person.linkedContacts.email}</Text>
                </View>
              )}
              {person.linkedContacts.linkedinURL && (
                <View style={styles.contactItem}>
                  <Ionicons name="logo-linkedin" size={20} color={COLORS.primary} />
                  <Text style={styles.contactText}>{person.linkedContacts.linkedinURL}</Text>
                </View>
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metadata</Text>
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.text.secondary} />
              <Text style={styles.metadataLabel}>Created:</Text>
              <Text style={styles.metadataValue}>{formatDate(person.createdAt)}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.text.secondary} />
              <Text style={styles.metadataLabel}>Updated:</Text>
              <Text style={styles.metadataValue}>{formatDate(person.updatedAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleOpenPrepCard}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.text.dark} />
            <Text style={styles.primaryButtonText}>View Prep Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleEdit}>
            <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Edit Person</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            <Text style={styles.deleteButtonText}>Delete Person</Text>
          </TouchableOpacity>
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
    paddingBottom: SPACING.xxl + 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerContent: {
    flex: 1,
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
    flex: 1,
    marginRight: SPACING.md,
  },
  headerActions: {
    flexDirection: 'row',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  sectionContent: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  quickFactsContainer: {
    marginTop: SPACING.sm,
  },
  quickFact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  quickFactIcon: {
    marginRight: SPACING.sm,
  },
  quickFactContent: {
    flex: 1,
  },
  quickFactLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  quickFactValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.chip.blue,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
    marginTop: SPACING.sm,
  },
  tagText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  contactContainer: {
    paddingVertical: SPACING.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  contactText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  metadataContainer: {
    paddingVertical: SPACING.sm,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  metadataLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  metadataValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
  },
  actionSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    color: COLORS.text.dark,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  secondaryButton: {
    backgroundColor: COLORS.background.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  deleteButton: {
    backgroundColor: COLORS.background.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});
