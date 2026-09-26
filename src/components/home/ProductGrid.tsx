// ============================================================
// ProductGrid Component
// ============================================================

import { Layout, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product } from '@/types/models';
import React from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
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
  const { t, language } = useTranslation();
  const insets = useSafeAreaInsets();

  // Calculate bottom padding: tab bar height + bottom margin + safe area
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 80;
  const TAB_BAR_BOTTOM = Platform.OS === 'ios' ? 24 : 16;
  const bottomPadding = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + Spacing.lg;

  if (isLoading && products.length === 0) {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={header}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                width={Layout.productCardWidth}
                height={290}
                borderRadius={16}
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
      <Text variant="4xl" style={styles.emptyEmoji}>🌿</Text>
      <Text variant="xl" weight="semiBold" style={styles.emptyTitle}>
        {t.product.noResults}
      </Text>
      <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
        {language === 'he' ? 'נסה קטגוריה אחרת' : 'Try another category'}
      </Text>
    </View>
  );

  return (
    <FlatList
      key={products.length > 0 ? 'grid' : 'empty'}
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
      renderItem={({ item, index }) => (
        <ProductCard product={item} index={index} />
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
  skeleton: {
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['6xl'],
    paddingHorizontal: Spacing['2xl'],
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
