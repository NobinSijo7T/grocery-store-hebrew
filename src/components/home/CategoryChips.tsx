// ============================================================
// CategoryChips Component — Organic Pill Filters
// ============================================================
// Emoji-first, pill-shaped chips with spring selection animation.
// Scrolls horizontally with fade-in stagger on first render.

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import type { Category } from '@/types/models';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInRight,
  FadeInLeft,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { Text } from '../ui/Text';
import { SPRING_CONFIGS } from '@/utils/animations';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ChipProps {
  label: string;
  emoji?: string | null;
  isSelected: boolean;
  onPress: () => void;
  index: number;
  isRTL: boolean;
}

function Chip({ label, emoji, isSelected, onPress, index, isRTL }: ChipProps) {
  const theme = useThemeColor();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.93, SPRING_CONFIGS.snappy);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIGS.gentle);
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const EntryAnim = isRTL ? FadeInRight : FadeInLeft;

  return (
    <Animated.View
      entering={EntryAnim.delay(index * 40).springify().damping(18).stiffness(100)}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.chip,
          animatedStyle,
          {
            backgroundColor: isSelected ? theme.primary : theme.surfaceElevated,
            ...(isSelected ? Shadows.sm : {}),
          },
        ]}
      >
        <View style={styles.chipContent}>
          {emoji && (
            <Text style={styles.emoji}>{emoji}</Text>
          )}
          <Text
            variant="sm"
            weight={isSelected ? 'semiBold' : 'medium'}
            color={isSelected ? '#FFFFFF' : theme.text}
          >
            {label}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

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
  const { t, language } = useTranslation();
  const isRTL = language === 'he';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* "All" chip */}
      {showAll && (
        <Chip
          label={t.home.seeAll}
          emoji="🛒"
          isSelected={!selectedId}
          onPress={() => onSelect(undefined)}
          index={0}
          isRTL={isRTL}
        />
      )}

      {categories.map((category, i) => {
        const isSelected = selectedId === category.id;
        const categoryName = language === 'he' ? category.name_he : category.name_en || category.name_he;

        return (
          <Chip
            key={category.id}
            label={categoryName}
            emoji={category.icon}
            isSelected={isSelected}
            onPress={() => onSelect(category.id)}
            index={showAll ? i + 1 : i}
            isRTL={isRTL}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 38,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  emoji: {
    fontSize: 15,
    lineHeight: 18,
  },
});
