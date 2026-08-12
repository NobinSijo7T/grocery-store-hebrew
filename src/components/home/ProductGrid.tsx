// ============================================================
// ProductGrid Component
// ============================================================

import { Layout, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product } from '@/types/models';
import React from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '../product/ProductCard';
import { Skeleton } from '../ui/Skeleton';
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Calculate bottom padding: tab bar height + bottom margin + safe area
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 80;
  const TAB_BAR_BOTTOM = Platform.OS === 'ios' ? 24 : 16;
  const bottomPadding = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + Spacing.lg;

  if (isLoading && products.length === 0) {
    return (
      <FlatList
        data={[]}
        ListHeaderComponent={header}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                width={Layout.productCardWidth}
                height={280}
                style={styles.skeleton}
              />
            ))}
          </View>
        }
      />
    );
  }

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <Text variant="lg" color={theme.textSecondary}>
        {t.product.noResults}
      </Text>
    </View>
  );

  return (
    <FlatList
      key={products.length > 0 ? 'grid' : 'empty'} // Force re-render when switching between empty/non-empty
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
      columnWrapperStyle={products.length > 0 ? styles.columnWrapper : undefined}
      ListHeaderComponent={header}
      ListEmptyComponent={emptyComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ProductCard product={item} />
      )}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={theme.primary} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.lg,
    justifyContent: 'space-between',
  },
  skeleton: {
    marginBottom: Spacing.md,
  },
  listContent: {
    padding: Spacing.lg,
    // paddingBottom is set dynamically in the component
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing['4xl'],
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
});
