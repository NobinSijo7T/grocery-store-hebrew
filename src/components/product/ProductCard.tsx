// ============================================================
// ProductCard Component
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { QuantitySelector } from './QuantitySelector';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCartStore } from '@/stores/cartStore';
import { BorderRadius, Layout, Spacing } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import { HE } from '@/constants/hebrew';
import type { Product } from '@/types/models';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, Layout as ReanimatedLayout } from 'react-native-reanimated';

interface ProductCardProps {
  product: Product;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export function ProductCard({ product }: ProductCardProps) {
  const theme = useThemeColor();
  const cartItemQuantity = useCartStore((state) => state.getItemQuantity(product.id));
  const { addItem, incrementItem, decrementItem } = useCartStore();

  const handleAddToCart = () => addItem(product);
  const handleIncrement = () => incrementItem(product.id);
  const handleDecrement = () => decrementItem(product.id);

  const price = product.discount_price ?? product.price;
  const hasDiscount = !!product.discount_price;

  return (
    <Link href={`/product/${product.id}`} asChild>
      <AnimatedPressable style={styles.container}>
        <Card style={styles.card} padding={false}>
          {/* Badges Container */}
          <View style={styles.badgesContainer}>
            {product.is_organic && (
              <Badge label={HE.product.organic} variant="success" style={styles.badge} />
            )}
            {product.seasonal_tag && (
              <Badge label={product.seasonal_tag} variant="accent" style={styles.badge} />
            )}
            {hasDiscount && (
              <Badge label={HE.product.offer} variant="error" style={styles.badge} />
            )}
          </View>

          {/* Image */}
          <Image
            source={product.image_url}
            placeholder={blurhash}
            contentFit="cover"
            transition={300}
            style={styles.image}
          />

          {/* Content */}
          <View style={styles.content}>
            <Text variant="md" weight="semiBold" numberOfLines={2} style={styles.title}>
              {product.name_he}
            </Text>
            
            <Text variant="sm" color={theme.textTertiary} style={styles.unit}>
              {product.unit}
            </Text>

            <View style={styles.priceContainer}>
              <Text variant="lg" weight="bold" color={theme.text}>
                {formatPrice(price)}
              </Text>
              {hasDiscount && (
                <Text
                  variant="sm"
                  color={theme.textTertiary}
                  style={styles.oldPrice}
                >
                  {formatPrice(product.price)}
                </Text>
              )}
            </View>

            {/* Cart Actions */}
            <View style={styles.actionContainer}>
              {cartItemQuantity > 0 ? (
                <QuantitySelector
                  quantity={cartItemQuantity}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  size="sm"
                />
              ) : (
                <AnimatedPressable
                  onPress={handleAddToCart}
                  style={[styles.addButton, { backgroundColor: theme.primaryLight }]}
                  haptic
                >
                  <MaterialIcons name="add-shopping-cart" size={20} color={theme.primaryDark} />
                </AnimatedPressable>
              )}
            </View>
          </View>
        </Card>
      </AnimatedPressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Layout.productCardWidth,
    marginBottom: Spacing.md,
  },
  card: {
    height: 280,
    justifyContent: 'space-between',
  },
  badgesContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  badge: {
    marginBottom: Spacing.xs,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 2,
    textAlign: 'right', // RTL
  },
  unit: {
    marginBottom: Spacing.sm,
    textAlign: 'right', // RTL
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
    justifyContent: 'flex-end', // RTL - align to right
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    marginTop: Spacing.sm,
    height: 36,
    justifyContent: 'flex-end',
  },
  addButton: {
    height: 36,
    width: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start', // RTL - align to left (bottom corner)
  },
});
