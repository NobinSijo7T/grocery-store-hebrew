// ============================================================
// ProductGrid Component — Farm-to-Table Grid with Smooth Loader
// ============================================================

import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product } from '@/types/models';
import React from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '../product/ProductCard';
import { ProductCardSkeleton } from '../product/ProductCardSkeleton';
import { SmoothLoader } from '../ui/SmoothLoader';
import { Text } from '../ui/Text';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onEndReached?: () => void;
  header?: React.ReactElement | null;
}

export function ProductGrid({
  products,
  isLoading = false,
  onEndReached,
  header,
}: ProductGridProps) {
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const insets = useSafeAreaInsets();
  const isRTL = language === 'he';

  // Calculate bottom padding: tab bar height + bottom margin + safe area
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 80;
  const TAB_BAR_BOTTOM = Platform.OS === 'ios' ? 24 : 16;
  const bottomPadding = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + Spacing.lg;

  // Header with optional smooth loading pill
  const fullHeader = (
    <View>
      {header}
      {/* Smooth pill indicator when loading while items are already shown or updating */}
      {isLoading && (
        <SmoothLoader
          variant="pill"
          size="sm"
          message={isRTL ? 'טוען תוצרת טרייה מהשדה...' : 'Harvesting farm fresh produce...'}
        />
      )}
    </View>
  );

  // 1. Initial Loading State (No products loaded yet)
  if (isLoading && products.length === 0) {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={fullHeader}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Animated.View entering={FadeIn.duration(300)} style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} index={i} />
            ))}
          </Animated.View>
        }
      />
    );
  }

  // 2. Empty State
  const emptyComponent = (
    <Animated.View entering={FadeIn.duration(400)} style={styles.emptyContainer}>
      <Text variant="4xl" style={styles.emptyEmoji}>🌿</Text>
      <Text variant="xl" weight="semiBold" style={styles.emptyTitle}>
        {t.product.noResults}
      </Text>
      <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
        {language === 'he' ? 'נסה קטגוריה אחרת' : 'Try another category'}
      </Text>
    </Animated.View>
  );

  // 3. Populated Grid (with smooth loading overlay if refreshing/filtering)
  return (
    <FlatList
      key={products.length > 0 ? 'grid' : 'empty'}
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
      columnWrapperStyle={products.length > 0 ? styles.columnWrapper : undefined}
      ListHeaderComponent={fullHeader}
      ListEmptyComponent={emptyComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item, index }) => (
        <View style={{ opacity: isLoading ? 0.6 : 1 }}>
          <ProductCard product={item} index={index} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
