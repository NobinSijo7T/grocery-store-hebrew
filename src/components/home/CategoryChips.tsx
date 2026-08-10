// ============================================================
// CategoryChips Component
// ============================================================

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../ui/Text';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing } from '@/constants/theme';
import type { Category } from '@/types/models';

interface CategoryChipsProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  showAll?: boolean;
}

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
  showAll = true,
}: CategoryChipsProps) {
  const theme = useThemeColor();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      // Since it's RTL, we want it to start from the right
      inverted={false} // React Native handles RTL scrollview automatically when I18nManager is configured
    >
      {showAll && (
        <AnimatedPressable
          onPress={() => onSelect(undefined)}
          style={[
            styles.chip,
            {
              backgroundColor: !selectedId ? theme.primary : theme.surfaceElevated,
              borderColor: !selectedId ? theme.primary : theme.border,
            },
          ]}
        >
          <Text
            variant="sm"
            weight={!selectedId ? 'semiBold' : 'medium'}
            color={!selectedId ? '#FFFFFF' : theme.text}
          >
            הכל
          </Text>
        </AnimatedPressable>
      )}

      {categories.map((category) => {
        const isSelected = selectedId === category.id;
        return (
          <AnimatedPressable
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.primary : theme.surfaceElevated,
                borderColor: isSelected ? theme.primary : theme.border,
              },
            ]}
          >
            <View style={styles.content}>
              {category.icon && (
                <Text style={styles.icon}>{category.icon}</Text>
              )}
              <Text
                variant="sm"
                weight={isSelected ? 'semiBold' : 'medium'}
                color={isSelected ? '#FFFFFF' : theme.text}
              >
                {category.name_he}
              </Text>
            </View>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 16,
  },
});
