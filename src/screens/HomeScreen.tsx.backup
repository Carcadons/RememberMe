import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { database } from '../storage/database';
import { PersonCard } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [people, setPeople] = useState<PersonCard[]>([]);
  const [starredPeople, setStarredPeople] = useState<PersonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'starred'>('all');

  const loadPeople = useCallback(async () => {
    try {
      setLoading(true);
      const [all, starred] = await Promise.all([
        database.getAllPeople(),
        database.getStarredPeople(),
      ]);
      setPeople(all.slice(0, 50)); // Limit initial load
      setStarredPeople(starred);
    } catch (error) {
      console.error('Error loading people:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  useFocusEffect(
    useCallback(() => {
      loadPeople();
    }, [loadPeople])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPeople();
  };

  const PersonCardItem: React.FC<{ person: PersonCard }> = ({ person }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PersonDetail', { personId: person.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.personName} numberOfLines={1}>
            {person.preferredName || person.fullName}
          </Text>
          {person.title && (
            <Text style={styles.personTitle} numberOfLines={1}>
              {person.title}
            </Text>
          )}
          {person.oneLineContext && (
            <Text style={styles.personContext} numberOfLines={1}>
              {person.oneLineContext}
            </Text>
          )}
        </View>
        {person.starred && (
          <Ionicons name="star" size={20} color={COLORS.warning} />
        )}
      </View>

      {person.quickFacts.length > 0 && (
        <View style={styles.quickFacts}>
          {person.quickFacts.slice(0, 2).map((fact) => (
            <View key={fact.id} style={styles.quickFact}>
              {fact.icon && (
                <Ionicons name={fact.icon as any} size={14} color={COLORS.text.secondary} />
              )}
              <Text style={styles.quickFactText} numberOfLines={1}>
                {fact.label}: {fact.value.length > 20 ? `${fact.value.substring(0, 20)}...` : fact.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      {person.tags.length > 0 && (
        <View style={styles.tags}>
          {person.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const displayData = activeTab === 'starred' ? starredPeople : people;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your memory cards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Memory Cards</Text>
        <Text style={styles.headerSubtitle}>
          {people.length} {people.length === 1 ? 'person' : 'people'} remembered
        </Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'starred' && styles.tabActive]}
          onPress={() => setActiveTab('starred')}
        >
          <Text style={styles.tabText}>Starred</Text>
        </TouchableOpacity>
      </View>

      {displayData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={COLORS.text.light} />
          <Text style={styles.emptyTitle}>
            {activeTab === 'starred'
              ? 'No starred people yet'
              : 'No memory cards yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'starred'
              ? 'Star people to see them here first'
              : 'Add your first person to remember important details'}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddPerson')}
          >
            <Ionicons name="add" size={24} color={COLORS.text.dark} />
            <Text style={styles.emptyButtonText}>Add Person</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayData}
          renderItem={({ item }) => <PersonCardItem person={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background.primary,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  tabActiveText: {
    color: COLORS.text.dark,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  cardInfo: {
    flex: 1,
  },
  personName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  personTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  personContext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  quickFacts: {
    marginTop: SPACING.md,
  },
  quickFact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  quickFactText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  tag: {
    backgroundColor: COLORS.chip.blue,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginTop: SPACING.xs,
  },
  tagText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyButtonText: {
    color: COLORS.text.dark,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});
