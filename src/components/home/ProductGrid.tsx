// ============================================================
// ProductGrid Component
// ============================================================

import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ProductCard } from '../product/ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { Text } from '../ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, Layout } from '@/constants/theme';
import type { Product } from '@/types/models';
import Animated, { FadeIn } from 'react-native-reanimated';
import { HE } from '@/constants/hebrew';
import { staggerDelay } from '@/utils/animations';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onEndReached?: () => void;
  header?: React.ReactNode;
}

export function ProductGrid({
  products,
  isLoading = false,
  onEndReached,
  header,
}: ProductGridProps) {
  const theme = useThemeColor();

  if (isLoading && products.length === 0) {
    return (
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
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="lg" color={theme.textSecondary}>
          {HE.product.noResults}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={header}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeIn.delay(staggerDelay(index % 6, 50))}>
          <ProductCard product={item} />
        </Animated.View>
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
    paddingBottom: Spacing.4xl, // Extra space for tab bar or bottom sheet
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.2xl,
    marginTop: Spacing.4xl,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
});
