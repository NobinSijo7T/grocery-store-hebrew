// ============================================================
// RelatedProducts Component
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../ui/Text';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { useProducts } from '@/hooks/useProducts';
import { HE } from '@/constants/hebrew';
import { Spacing, Layout } from '@/constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { staggerDelay } from '@/utils/animations';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  // Fetch up to 10 products from the same category
  const { data: products, isLoading } = useProducts({ categoryId, sort: 'popular' });

  // Filter out the current product
  const related = products?.filter((p) => p.id !== currentProductId).slice(0, 10) || [];

  if (!isLoading && related.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="lg" weight="bold" style={styles.title}>
        {HE.product.relatedProducts}
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                width={Layout.productCardWidth}
                height={280}
                style={styles.skeleton}
              />
            ))
          : related.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInRight.delay(staggerDelay(index, 50))}
                style={styles.cardWrapper}
              >
                <ProductCard product={product} />
              </Animated.View>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xl,
  },
  title: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    textAlign: 'right', // RTL
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  cardWrapper: {
    marginRight: Spacing.md,
  },
  skeleton: {
    marginRight: Spacing.md,
  },
});
