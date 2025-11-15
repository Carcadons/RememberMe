import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { database } from '../storage/database';
import { PersonCard, QuickFact, LinkedContacts, PrivacySettings } from '../types';
import { COLORS, SPACING, FONT_SIZES, isIOS } from '../constants';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type AddPersonRouteProp = RouteProp<RootStackParamList, 'AddPerson'>;
type EditPersonRouteProp = RouteProp<RootStackParamList, 'EditPerson'>;

type Props = {
  navigation: NavigationProp;
  route: AddPersonRouteProp | EditPersonRouteProp;
};

export default function AddEditPersonScreen({ navigation, route }: Props) {
  const isEdit = route.name === 'EditPerson';
  const personId = 'personId' in route.params ? route.params.personId : undefined;

  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [oneLineContext, setOneLineContext] = useState('');
  const [quickFacts, setQuickFacts] = useState<QuickFact[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [linkedinURL, setLinkedinURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [showQuickFactModal, setShowQuickFactModal] = useState(false);
  const [quickFactLabel, setQuickFactLabel] = useState('');
  const [quickFactValue, setQuickFactValue] = useState('');
  const [quickFactIcon, setQuickFactIcon] = useState('');

  useEffect(() => {
    if (isEdit && personId) {
      loadPerson();
    }
  }, [isEdit, personId]);

  const loadPerson = async () => {
    try {
      if (!personId) return;
      const person = await database.getPerson(personId);
      if (person) {
        setFullName(person.fullName);
        setPreferredName(person.preferredName || '');
        setTitle(person.title || '');
        setCompany(person.company || '');
        setOneLineContext(person.oneLineContext || '');
        setQuickFacts(person.quickFacts);
        setTags(person.tags);
        setPhone(person.linkedContacts.phone || '');
        setEmail(person.linkedContacts.email || '');
        setLinkedinURL(person.linkedinURL || '');
      }
    } catch (error) {
      console.error('Error loading person:', error);
      Alert.alert('Error', 'Failed to load person data');
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Missing Information', 'Please enter at least a name');
      return;
    }

    try {
      setSaving(true);

      const linkedContacts: LinkedContacts = {
        phone: phone || undefined,
        email: email || undefined,
        linkedinURL: linkedinURL || undefined,
      };

      const privacy: PrivacySettings = {
        sharedWith: [],
        consentGiven: false,
      };

      const personData: PersonCard = {
        id: isEdit ? personId! : Date.now().toString(),
        fullName: fullName.trim(),
        preferredName: preferredName || undefined,
        title: title || undefined,
        company: company || undefined,
        oneLineContext: oneLineContext || undefined,
        quickFacts: quickFacts.map((fact, index) => ({
          ...fact,
          id: fact.id || `${Date.now()}-${index}`,
        })),
        tags,
        linkedContacts,
        privacy,
        notes: [],
        starred: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (isEdit) {
        await database.updatePerson(personData);
        Alert.alert('Success', 'Person updated successfully');
      } else {
        await database.addPerson(personData);
        Alert.alert('Success', 'Person added successfully');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving person:', error);
      Alert.alert('Error', `Failed to ${isEdit ? 'update' : 'add'} person`);
    } finally {
      setSaving(false);
    }
  };

  const addQuickFact = () => {
    if (!quickFactLabel || !quickFactValue) {
      Alert.alert('Missing Information', 'Please enter both label and value');
      return;
    }

    const newFact: QuickFact = {
      id: Date.now().toString(),
      label: quickFactLabel,
      value: quickFactValue,
      icon: quickFactIcon || undefined,
    };

    setQuickFacts([...quickFacts, newFact]);
    setQuickFactLabel('');
    setQuickFactValue('');
    setQuickFactIcon('');
    setShowQuickFactModal(false);
  };

  const removeQuickFact = (id: string) => {
    setQuickFacts(quickFacts.filter(fact => fact.id !== id));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;

    const newTag = tagInput.trim().toLowerCase();
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEdit ? 'Edit Person' : 'Add New Person'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor={COLORS.text.light}
            />

            <Text style={styles.label}>Preferred Name (Optional)</Text>
            <TextInput
              style={styles.input}
              value={preferredName}
              onChangeText={setPreferredName}
              placeholder="John (or nickname)"
              placeholderTextColor={COLORS.text.light}
            />

            <Text style={styles.label}>Title (Optional)</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Senior Product Manager"
              placeholderTextColor={COLORS.text.light}
            />

            <Text style={styles.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="Acme Inc."
              placeholderTextColor={COLORS.text.light}
            />

            <Text style={styles.label}>One Line Context (Optional)</Text>
            <TextInput
              style={styles.input}
              value={oneLineContext}
              onChangeText={setOneLineContext}
              placeholder="How you met or know them"
              placeholderTextColor={COLORS.text.light}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Facts</Text>
            <Text style={styles.sectionSubtitle}>2-3 quick facts to remember</Text>

            {quickFacts.length > 0 && (
              <View style={styles.quickFactsList}>
                {quickFacts.map((fact) => (
                  <View key={fact.id} style={styles.quickFactItem}>
                    <View style={styles.quickFactContent}>
                      {fact.icon && (
                        <Ionicons name={fact.icon as any} size={16} color={COLORS.primary} style={styles.quickFactIcon} />
                      )}
                      <Text style={styles.quickFactLabel}>{fact.label}:</Text>
                      <Text style={styles.quickFactValue}>{fact.value}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeQuickFact(fact.id)}>
                      <Ionicons name="close-circle" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowQuickFactModal(true)}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Add Quick Fact</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <Text style={styles.sectionSubtitle}>Categories to organize by</Text>

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <Ionicons name="close" size={16} color={COLORS.text.dark} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="Enter tag and press return"
                placeholderTextColor={COLORS.text.light}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Ionicons name="add" size={20} color={COLORS.text.dark} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={COLORS.text.light}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor={COLORS.text.light}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>LinkedIn URL (Optional)</Text>
            <TextInput
              style={styles.input}
              value={linkedinURL}
              onChangeText={setLinkedinURL}
              placeholder="https://linkedin.com/in/johndoe"
              placeholderTextColor={COLORS.text.light}
              autoCapitalize="none"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showQuickFactModal}
        animationType="slide"
        transparent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Quick Fact</Text>

            <Text style={styles.label}>Label</Text>
            <TextInput
              style={styles.input}
              value={quickFactLabel}
              onChangeText={setQuickFactLabel}
              placeholder="e.g., Kids names"
              placeholderTextColor={COLORS.text.light}
            />

            <Text style={styles.label}>Value</Text>
            <TextInput
              style={styles.input}
              value={quickFactValue}
              onChangeText={setQuickFactValue}
              placeholder="e.g., Emma & Liam"
              placeholderTextColor={COLORS.text.light}
            />

            <Text style={styles.label}>Icon (Optional)</Text>
            <TextInput
              style={styles.input}
              value={quickFactIcon}
              onChangeText={setQuickFactIcon}
              placeholder="Ionicons name, e.g., heart-outline"
              placeholderTextColor={COLORS.text.light}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowQuickFactModal(false);
                  setQuickFactLabel('');
                  setQuickFactValue('');
                  setQuickFactIcon('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addQuickFact}
              >
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  keyboardView: {
    flex: 1,
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
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  saveButton: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: COLORS.text.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl + 40,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
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
  quickFactsList: {
    marginTop: SPACING.sm,
  },
  quickFactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  quickFactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickFactIcon: {
    marginRight: SPACING.sm,
  },
  quickFactLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  quickFactValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    marginLeft: SPACING.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.chip.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tagText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    marginRight: SPACING.sm,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  tagInput: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    marginRight: SPACING.sm,
  },
  addTagButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background.primary,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  saveButtonText: {
    color: COLORS.text.dark,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});
