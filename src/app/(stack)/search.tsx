// ============================================================
// Search Screen — Farm Market Produce Finder
// ============================================================
// Organic search bar with instant farm filters, quick tag suggestions,
// warm cream pill chips, and smooth animation transitions.

import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductGrid } from '@/components/home/ProductGrid';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useFilterStore } from '@/stores/filterStore';

import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();

  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';
  const textAlign = isRTL ? 'right' : 'left';

  const { search, setSearch, categoryId, setCategory } = useFilterStore();
  const [localSearch, setLocalSearch] = useState(search ?? '');
  const searchInputRef = useRef<TextInput>(null);

  const { data: categories } = useCategories();

  // Quick suggestions for farm produce
  const suggestions = isRTL
    ? ['🥑 אבוקדו', '🍅 עגבניות מגי', '🍓 תותים', '🥬 חסה', '🥖 מאפים', '🧀 גבינות']
    : ['🥑 Avocado', '🍅 Tomatoes', '🍓 Strawberries', '🥬 Lettuce', '🥖 Bakery', '🧀 Cheese'];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch ?? '');
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const { data: products, isLoading, isRefetching } = useProducts({
    search,
    categoryId,
  });

  // Clear search when unmounting
  useEffect(() => {
    return () => {
      setSearch('');
    };
  }, []);

  const handleSuggestionPress = (tag: string) => {
    Haptics.selectionAsync();
    const cleanWord = tag.split(' ').slice(1).join(' ');
    setLocalSearch(cleanWord);
    setSearch(cleanWord);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Search Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.sm,
            flexDirection,
          },
        ]}
      >
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
        </AnimatedPressable>

        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.surfaceElevated,
              ...Shadows.sm,
              shadowColor: theme.shadowColor,
              flexDirection,
            },
          ]}
        >
          <Pressable onPress={() => searchInputRef.current?.focus()} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="search" size={22} color={theme.primary} />
          </Pressable>
          <TextInput
            ref={searchInputRef}
            style={[
              styles.searchInput,
              {
                color: theme.text,
                fontFamily: Typography.fontFamily.regular,
                textAlign,
              },
            ]}
            placeholder={
              isRTL ? 'חפש תוצרת טרייה מהשדה...' : 'Search fresh farm produce...'
            }
            placeholderTextColor={theme.textTertiary}
            value={localSearch}
            onChangeText={setLocalSearch}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance={theme.text === '#FEFEF7' ? 'dark' : 'light'}
          />
          {(localSearch?.length ?? 0) > 0 && (
            <AnimatedPressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setLocalSearch('');
                setSearch('');
              }}
              style={styles.clearBtn}
            >
              <MaterialIcons name="close" size={18} color={theme.textSecondary} />
            </AnimatedPressable>
          )}
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.filtersContainer}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.filtersScrollContent, { flexDirection }]}
        >
          <AnimatedPressable
            onPress={() => {
              Haptics.selectionAsync();
              setCategory(undefined);
            }}
            style={[
              styles.filterChip,
              {
                backgroundColor: !categoryId ? theme.primary : theme.surfaceElevated,
                ...(!categoryId ? Shadows.sm : {}),
                shadowColor: theme.primary,
              },
            ]}
          >
            <Text
              variant="sm"
              weight={!categoryId ? 'bold' : 'medium'}
              color={!categoryId ? '#FFFFFF' : theme.textSecondary}
            >
              {isRTL ? '🌱 כל התוצרת' : '🌱 All Produce'}
            </Text>
          </AnimatedPressable>

          {categories?.map((cat) => {
            const isSelected = categoryId === cat.id;
            const categoryName = isRTL ? cat.name_he : cat.name_en || cat.name_he;
            return (
              <AnimatedPressable
                key={cat.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setCategory(cat.id);
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surfaceElevated,
                    ...(isSelected ? Shadows.sm : {}),
                    shadowColor: theme.primary,
                  },
                ]}
              >
                <Text
                  variant="sm"
                  weight={isSelected ? 'bold' : 'medium'}
                  color={isSelected ? '#FFFFFF' : theme.textSecondary}
                >
                  {cat.icon ? `${cat.icon} ` : ''}
                  {categoryName}
                </Text>
              </AnimatedPressable>
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1 }}>
        {(!search || search.length === 0) && !categoryId ? (
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyContainer}>
            <View style={[styles.emptyIconBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={{ fontSize: 44 }}>🧺</Text>
            </View>

            <Text variant="xl" weight="bold" style={{ marginBottom: Spacing.xs, textAlign: 'center' }}>
              {isRTL ? 'מה תרצו להזמין מהשדה?' : 'What fresh food are you craving?'}
            </Text>

            <Text
              variant="sm"
              color={theme.textSecondary}
              style={{ textAlign: 'center', maxWidth: 280, marginBottom: Spacing.xl, lineHeight: 20 }}
            >
              {isRTL
                ? 'חפשו פירות, ירקות, גבינות כפריות או מוצרי מעדנייה אורגניים'
                : 'Search fruits, vegetables, artisan cheeses, or fresh organic farm goods'}
            </Text>

            {/* Quick Suggestions Chips */}
            <View style={[styles.suggestionsWrap, { flexDirection }]}>
              {suggestions.map((item, idx) => (
                <Animated.View key={item} entering={FadeInDown.delay(idx * 40).springify()}>
                  <AnimatedPressable
                    onPress={() => handleSuggestionPress(item)}
                    style={[
                      styles.suggestionPill,
                      {
                        backgroundColor: theme.surfaceElevated,
                        ...Shadows.sm,
                        shadowColor: theme.shadowColor,
                      },
                    ]}
                  >
                    <Text variant="sm" weight="medium" color={theme.text}>
                      {item}
                    </Text>
                  </AnimatedPressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <ProductGrid products={products || []} isLoading={isLoading} />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  searchInputContainer: {
    flex: 1,
    alignItems: 'center',
    height: 48,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginHorizontal: Spacing.sm,
    fontSize: 15,
  },
  clearBtn: {
    padding: 4,
  },
  filtersContainer: {
    paddingBottom: Spacing.xs,
  },
  filtersScrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyIconBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  suggestionsWrap: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    maxWidth: 320,
  },
  suggestionPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
  },
});
