import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { database } from '../storage/database';
import { PersonCard } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PersonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    // In a real app, you'd store recent searches
    setRecentSearches([]);
  };

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const performSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const searchResults = await database.searchPeople(query);
      setResults(searchResults);

      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
        return updated;
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchRecent = (searchTerm: string) => {
    setQuery(searchTerm);
    setTimeout(() => {
      performSearch();
    }, 100);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    Keyboard.dismiss();
  };

  const PersonResultItem: React.FC<{ person: PersonCard }> = ({ person }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('PersonDetail', { personId: person.id })}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultName} numberOfLines={1}>
          {person.preferredName || person.fullName}
        </Text>
        {person.starred && <Ionicons name="star" size={16} color={COLORS.warning} />}
      </View>
      {person.title && (
        <Text style={styles.resultTitle} numberOfLines={1}>
          {person.title}
        </Text>
      )}
      {person.company && (
        <Text style={styles.resultCompany} numberOfLines={1}>
          {person.company}
        </Text>
      )}
      {person.tags.length > 0 && (
        <View style={styles.resultTags}>
          {person.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.resultTag}>
              <Text style={styles.resultTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.resultQuickFact}>
        {person.quickFacts[0] && (
          <Text style={styles.resultQuickFactText} numberOfLines={1}>
            {person.quickFacts[0].label}: {person.quickFacts[0].value}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, company, title, tags, or facts..."
            placeholderTextColor={COLORS.text.light}
            value={query}
            onChangeText={setQuery}
            autoFocus={true}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.text.light} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {!loading && query.trim().length > 0 && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={COLORS.text.light} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>Try searching for names, companies, titles, tags, or fact values</Text>
          </View>
        )}

        {!loading && results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsCount}>
              {results.length} {results.length === 1 ? 'person' : 'people'} found
            </Text>
            <FlatList
              data={results}
              renderItem={({ item }) => <PersonResultItem person={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
            />
          </View>
        )}

        {!loading && query.trim().length === 0 && recentSearches.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <View style={styles.recentList}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleSearchRecent(search)}
                >
                  <Ionicons name="time-outline" size={18} color={COLORS.text.secondary} />
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {!loading && query.trim().length === 0 && recentSearches.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Ionicons name="search" size={64} color={COLORS.primary} />
            <Text style={styles.welcomeTitle}>Search Your Memory Cards</Text>
            <View style={styles.welcomeTips}>
              <Text style={styles.welcomeTip}>
                <Ionicons name="checkmark" size={16} color={COLORS.success} /> Search by name, company, or title
              </Text>
              <Text style={styles.welcomeTip}>
                <Ionicons name="checkmark" size={16} color={COLORS.success} /> Find tags or quick facts
              </Text>
              <Text style={styles.welcomeTip}>
                <Ionicons name="checkmark" size={16} color={COLORS.success} /> Instant results as you type
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  clearButton: {
    marginLeft: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: SPACING.sm,
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  resultsList: {
    paddingBottom: SPACING.xl,
  },
  resultItem: {
    backgroundColor: COLORS.background.secondary,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  resultName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  resultTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  resultCompany: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  resultTag: {
    backgroundColor: COLORS.chip.blue,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
  },
  resultTagText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
  },
  resultQuickFact: {
    marginTop: SPACING.sm,
  },
  resultQuickFactText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  recentContainer: {
    padding: SPACING.lg,
  },
  recentTitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  recentList: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  recentText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.title,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  welcomeTips: {
    marginTop: SPACING.xl,
    alignItems: 'flex-start',
  },
  welcomeTip: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginVertical: SPACING.xs,
  },
});
