// ============================================================
// Search Screen
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { ProductGrid } from '@/components/home/ProductGrid';
import { Badge } from '@/components/ui/Badge';

import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useFilterStore } from '@/stores/filterStore';
import { useThemeColor } from '@/hooks/useThemeColor';

import { HE } from '@/constants/hebrew';
import { Spacing, BorderRadius, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  
  const { search, setSearch, categoryId, setCategory, resetFilters } = useFilterStore();
  const [localSearch, setLocalSearch] = useState(search);
  
  const { data: categories } = useCategories();
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const { data: products, isLoading, isRefetching } = useProducts({ 
    search, 
    categoryId 
  });

  // Clear search when unmounting to not pollute other screens
  useEffect(() => {
    return () => {
      setSearch('');
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Search Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm, borderBottomColor: theme.border }]}>
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
           <MaterialIcons name="arrow-forward" size={24} color={theme.text} />
        </AnimatedPressable>
        
        <View style={[styles.searchInputContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <MaterialIcons name="search" size={20} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontFamily: Typography.fontFamily.regular }]}
            placeholder={HE.home.searchPlaceholder}
            placeholderTextColor={theme.textTertiary}
            value={localSearch}
            onChangeText={setLocalSearch}
            autoFocus
            textAlign="right"
          />
          {localSearch.length > 0 && (
            <AnimatedPressable onPress={() => setLocalSearch('')}>
              <MaterialIcons name="close" size={20} color={theme.textTertiary} />
            </AnimatedPressable>
          )}
        </View>
      </View>

      {/* Filters Scroll (Categories) */}
      <View style={[styles.filtersContainer, { borderBottomColor: theme.border }]}>
         <Animated.ScrollView 
           horizontal 
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={styles.filtersScrollContent}
         >
           <AnimatedPressable 
              onPress={() => setCategory(undefined)}
              style={[
                styles.filterChip, 
                { 
                  backgroundColor: !categoryId ? theme.primary : theme.surfaceElevated,
                  borderColor: !categoryId ? theme.primary : theme.border 
                }
              ]}
           >
             <Text variant="sm" weight="medium" color={!categoryId ? '#FFFFFF' : theme.text}>הכל</Text>
           </AnimatedPressable>

           {categories?.map((cat) => (
             <AnimatedPressable 
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.filterChip, 
                  { 
                    backgroundColor: categoryId === cat.id ? theme.primary : theme.surfaceElevated,
                    borderColor: categoryId === cat.id ? theme.primary : theme.border 
                  }
                ]}
             >
               <Text variant="sm" weight="medium" color={categoryId === cat.id ? '#FFFFFF' : theme.text}>
                 {cat.name_he}
               </Text>
             </AnimatedPressable>
           ))}
         </Animated.ScrollView>
      </View>

      {/* Results */}
      <View style={{ flex: 1 }}>
        {search.length === 0 && !categoryId ? (
           <View style={styles.emptyContainer}>
             <MaterialIcons name="search" size={64} color={theme.border} style={{ marginBottom: 16 }} />
             <Text variant="xl" weight="medium" color={theme.textSecondary}>
               התחילו להקליד כדי לחפש
             </Text>
           </View>
        ) : (
          <ProductGrid
            products={products || []}
            isLoading={isLoading && !isRefetching}
          />
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
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    height: 40,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginHorizontal: Spacing.sm,
  },
  filtersContainer: {
    borderBottomWidth: 1,
  },
  filtersScrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    flexDirection: 'row-reverse', // RTL Support
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.2xl,
  },
});
