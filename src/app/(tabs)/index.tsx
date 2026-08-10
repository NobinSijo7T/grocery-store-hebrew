// ============================================================
// Home Screen
// ============================================================

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryChips } from '@/components/home/CategoryChips';
import { ProductGrid } from '@/components/home/ProductGrid';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBanners } from '@/hooks/useBanners';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeStore } from '@/stores/themeStore';

import { HE } from '@/constants/hebrew';
import { Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import type { Banner } from '@/types/models';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const isDark = useThemeStore((s) => s.isDark);
  
  const customer = useAuthStore((s) => s.customer);
  const { categoryId, setCategory } = useFilterStore();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: banners, isLoading: bannersLoading } = useBanners();
  
  // Memoize filters for useProducts hook
  const activeFilters = useMemo(() => ({ categoryId }), [categoryId]);
  
  const { 
    data: products, 
    isLoading: productsLoading,
    refetch,
    isRefetching
  } = useProducts(activeFilters);

  const handleBannerPress = (banner: Banner) => {
    if (banner.link_type === 'category' && banner.link_value) {
      // Find category ID by slug if possible, or assume link_value is the ID/slug
      const targetCategory = categories?.find(c => c.slug === banner.link_value);
      if (targetCategory) {
        setCategory(targetCategory.id);
      }
    } else if (banner.link_type === 'product' && banner.link_value) {
       // Search for the product by slug, then navigate
       router.push(`/product/${banner.link_value}`); // We need to handle slug-based routing or map slug to ID
    }
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar - Fake input that navigates to search screen */}
      <AnimatedPressable 
        style={[styles.searchBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]} 
        onPress={handleSearchPress}
      >
        <MaterialIcons name="search" size={24} color={theme.textTertiary} />
        <Text variant="md" color={theme.textTertiary} style={styles.searchText}>
          {HE.home.searchPlaceholder}
        </Text>
      </AnimatedPressable>

      {/* Hero Banner */}
      {!bannersLoading && banners && banners.length > 0 && (
        <HeroBanner banners={banners} onPressBanner={handleBannerPress} />
      )}

      {/* Category Chips */}
      {!categoriesLoading && categories && (
        <View style={styles.categoriesWrapper}>
          <Text variant="xl" weight="semiBold" style={styles.sectionTitle}>
            {HE.home.categories}
          </Text>
          <CategoryChips
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategory}
          />
        </View>
      )}

      {/* Title for Product Grid */}
      <View style={styles.gridHeader}>
        <Text variant="xl" weight="semiBold">
          {categoryId ? categories?.find(c => c.id === categoryId)?.name_he : HE.home.featuredProducts}
        </Text>
        {categoryId && (
           <AnimatedPressable onPress={() => setCategory(undefined)}>
             <Text variant="sm" weight="medium" color={theme.primary}>
               {HE.home.seeAll}
             </Text>
           </AnimatedPressable>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Top Bar Area */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, Spacing.md) }]}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm }}>
          <Image source={require('../../../assets/images/logo.svg')} style={{ width: 40, height: 40 }} contentFit="contain" />
          <View>
            <Text variant="sm" color={theme.textSecondary} style={{ textAlign: 'right' }}>
              {HE.home.greeting}
            </Text>
            <Text variant="lg" weight="bold" style={{ textAlign: 'right' }}>
              {customer?.full_name || HE.appName}
            </Text>
          </View>
        </View>
        <AnimatedPressable onPress={() => router.push('/account')}>
           <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
             <MaterialIcons name="person" size={24} color={theme.primaryDark} />
           </View>
        </AnimatedPressable>
      </View>

      <View style={{ flex: 1 }}>
        <ProductGrid
          products={products || []}
          isLoading={productsLoading && !isRefetching}
          header={renderHeader()}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  searchText: {
    marginLeft: Spacing.sm,
    flex: 1,
    textAlign: 'right', // RTL
  },
  categoriesWrapper: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'right', // RTL
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
