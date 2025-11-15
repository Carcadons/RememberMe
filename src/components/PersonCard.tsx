import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonCard as PersonCardType } from '../types';
import { COLORS, SPACING, FONT_SIZES, ICON_SIZES } from '../constants';

interface PersonCardProps {
  person: PersonCardType;
  onPress?: () => void;
  compact?: boolean;
  showStar?: boolean;
}

export default function PersonCard({ person, onPress, compact = false, showStar = false }: PersonCardProps) {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    const initials = parts.map(p => p[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  const displayName = person.preferredName || person.fullName.split(' ')[0];
  const subtitle = [person.title, person.company].filter(Boolean).join(' • ');

  const renderPhoto = () => {
    if (person.photoURI) {
      return (
        <Image
          source={{ uri: person.photoURI }}
          style={compact ? styles.smallPhoto : styles.photo}
        />
      );
    }

    return (
      <View style={[compact ? styles.smallPhoto : styles.photo, styles.initialsContainer]}>
        <Text style={styles.initials}>{getInitials(person.fullName)}</Text>
      </View>
    );
  };

  const renderQuickFactsCompact = () => {
    if (compact || person.quickFacts.length === 0) return null;

    return (
      <View style={styles.quickFactsContainer}>
        {person.quickFacts.slice(0, 1).map((fact, index) => (
          <View key={fact.id} style={[styles.factChip, getChipColor(index)]}>
            <Ionicons
              name={fact.icon as any || 'pricetag'}
              size={12}
              color={COLORS.text.primary}
              style={styles.factIcon}
            />
            <Text style={styles.factText} numberOfLines={1}>
              {fact.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const getChipColor = (index: number) => {
    const colors = [
      { backgroundColor: COLORS.chip.blue },
      { backgroundColor: COLORS.chip.green },
      { backgroundColor: COLORS.chip.yellow },
    ];
    return colors[index % colors.length];
  };

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.containerCompact]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {renderPhoto()}

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={compact ? styles.nameCompact : styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            {showStar && person.starred && (
              <Ionicons name="star" size={16} color={COLORS.warning} style={styles.star} />
            )}
          </View>

          {!compact && subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}

          {person.lastMet && !compact && (
            <Text style={styles.lastMet} numberOfLines={1}>
              Last met: {new Date(person.lastMet).toLocaleDateString()}
            </Text>
          )}

          {renderQuickFactsCompact()}
        </View>
      </View>

      {person.oneLineContext && !compact && (
        <View style={styles.contextContainer}>
          <Text style={styles.contextLabel}>How you know them:</Text>
          <Text style={styles.contextText} numberOfLines={1}>
            {person.oneLineContext}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerCompact: {
    padding: SPACING.md,
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.md,
  },
  smallPhoto: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
  },
  initialsContainer: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: COLORS.text.dark,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  nameCompact: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  star: {
    marginLeft: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  lastMet: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.light,
    marginBottom: SPACING.xs,
  },
  quickFactsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  factChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  factIcon: {
    marginRight: SPACING.xs,
  },
  factText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.primary,
    maxWidth: 120,
  },
  contextContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  contextLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.light,
    marginBottom: SPACING.xs,
  },
  contextText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontStyle: 'italic',
  },
});
