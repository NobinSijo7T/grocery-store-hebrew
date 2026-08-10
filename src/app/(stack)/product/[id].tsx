// ============================================================
// Product Detail Screen
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Badge } from '@/components/ui/Badge';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { ImageGallery } from '@/components/product/ImageGallery';
import { RelatedProducts } from '@/components/product/RelatedProducts';

import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { useThemeColor } from '@/hooks/useThemeColor';

import { HE } from '@/constants/hebrew';
import { Spacing, Layout } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  
  const { data: product, isLoading, isError } = useProduct(id as string);
  
  const cartItemQuantity = useCartStore((state) => state.getItemQuantity(id as string));
  const { addItem, incrementItem, decrementItem } = useCartStore();

  const [quantityToAdd, setQuantityToAdd] = useState(1);

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (isError || !product) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Text variant="lg" color={theme.error}>
          {HE.common.error}
        </Text>
        <Button title={HE.common.back} onPress={() => router.back()} style={{ marginTop: 16 }} />
      </ThemedView>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantityToAdd);
    setQuantityToAdd(1); // Reset local quantity
  };

  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
  const price = product.discount_price ?? product.price;
  const hasDiscount = !!product.discount_price;

  return (
    <ThemedView style={styles.container}>
      {/* Header / Back Button */}
      <View style={[styles.header, { top: insets.top + Spacing.sm }]}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.surfaceElevated }]}
        >
          {/* RTL: Arrow points right to go back */}
          <MaterialIcons name="arrow-forward" size={24} color={theme.text} />
        </AnimatedPressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ImageGallery images={images} />

        <View style={styles.content}>
          <View style={styles.badgesContainer}>
            {product.is_organic && <Badge label={HE.product.organic} variant="success" />}
            {product.seasonal_tag && <Badge label={product.seasonal_tag} variant="accent" />}
            {hasDiscount && <Badge label={HE.product.offer} variant="error" />}
          </View>

          <Text variant="2xl" weight="bold" style={styles.title}>
            {product.name_he}
          </Text>
          
          <Text variant="md" color={theme.textSecondary} style={styles.unit}>
            {product.unit}
          </Text>

          <View style={styles.priceContainer}>
            <Text variant="3xl" weight="bold" color={theme.text}>
              {formatPrice(price)}
            </Text>
            {hasDiscount && (
              <Text variant="lg" color={theme.textTertiary} style={styles.oldPrice}>
                {formatPrice(product.price)}
              </Text>
            )}
          </View>

          {product.description_he && (
            <View style={styles.descriptionContainer}>
              <Text variant="lg" weight="semiBold" style={styles.sectionTitle}>
                {HE.product.description}
              </Text>
              <Text variant="md" color={theme.textSecondary} style={styles.description}>
                {product.description_he}
              </Text>
            </View>
          )}

          <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.md), backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        {cartItemQuantity > 0 ? (
          <View style={styles.inCartContainer}>
             <Text variant="lg" weight="bold" color={theme.primary} style={styles.inCartText}>
               {cartItemQuantity} {HE.product.inCart}
             </Text>
             <QuantitySelector
                quantity={cartItemQuantity}
                onIncrement={() => incrementItem(product.id)}
                onDecrement={() => decrementItem(product.id)}
             />
          </View>
        ) : (
          <View style={styles.addToCartContainer}>
            <View style={styles.localQuantity}>
              <AnimatedPressable onPress={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))} style={styles.qtyBtn}>
                <MaterialIcons name="remove" size={20} color={theme.text} />
              </AnimatedPressable>
              <Text variant="lg" weight="bold" style={styles.qtyText}>{quantityToAdd}</Text>
              <AnimatedPressable onPress={() => setQuantityToAdd(quantityToAdd + 1)} style={styles.qtyBtn}>
                <MaterialIcons name="add" size={20} color={theme.text} />
              </AnimatedPressable>
            </View>
            <Button
              title={HE.product.addToCart}
              onPress={handleAddToCart}
              icon="shopping-cart"
              style={styles.addBtn}
            />
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed for RTL back arrow
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: Spacing.lg,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
    textAlign: 'right', // RTL
  },
  unit: {
    marginBottom: Spacing.lg,
    textAlign: 'right', // RTL
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    justifyContent: 'flex-end', // RTL
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  descriptionContainer: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'right',
  },
  description: {
    lineHeight: 24,
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    flexDirection: 'row',
  },
  inCartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inCartText: {
    marginRight: Spacing.md,
  },
  addToCartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  localQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Using static light gray for the counter
    borderRadius: 24,
    height: 48,
    paddingHorizontal: Spacing.xs,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    minWidth: 32,
    textAlign: 'center',
  },
  addBtn: {
    flex: 1,
  },
});
