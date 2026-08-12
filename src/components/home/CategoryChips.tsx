// ============================================================
// CategoryChips Component
// ============================================================

import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import type { Category } from '@/types/models';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { Text } from '../ui/Text';

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
  const { t, language } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      // In RTL, content flows from right to left, so "All" will appear at the right (left in LTR terms)
    >
      {/* "All" chip - appears first (rightmost in RTL) */}
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
            {t.home.seeAll}
          </Text>
        </AnimatedPressable>
      )}

      {categories.map((category) => {
        const isSelected = selectedId === category.id;
        const categoryName = language === 'he' ? category.name_he : category.name_en || category.name_he;
        
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
                {categoryName}
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
