// ============================================================
// RelatedProducts Component — Fresh Farm Recommendations
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../ui/Text';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { useTranslation } from '@/hooks/useTranslation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, Layout } from '@/constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { staggerDelay } from '@/utils/animations';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { t, language } = useTranslation();
  const theme = useThemeColor();
  const isRTL = language === 'he';

  // Fetch up to 10 products from the same category
  const { data: products, isLoading } = useProducts({ categoryId, sort: 'popular' });

  // Filter out the current product
  const related = products?.filter((p) => p.id !== currentProductId).slice(0, 10) || [];

  if (!isLoading && related.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text variant="xl" weight="bold" color={theme.text}>
          {t.product.relatedProducts || (isRTL ? 'אולי תאהב גם' : 'You May Also Like')}
        </Text>
        <Text style={{ fontSize: 18 }}>🌱</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <View
                key={`skeleton-${i}`}
                style={isRTL ? { marginLeft: Spacing.md } : { marginRight: Spacing.md }}
              >
                <ProductCardSkeleton index={i} />
              </View>
            ))
          : related.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInRight.delay(staggerDelay(index, 60)).springify()}
                style={isRTL ? { marginLeft: Spacing.md } : { marginRight: Spacing.md }}
              >
                <ProductCard product={product} index={index} />
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
  headerRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
});
