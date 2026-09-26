// ============================================================
// CartItemCard Component — Farm Market Item Row
// ============================================================
// Warm cream card, gentle entry/exit animations, product image
// with rounded corners, total price prominent.

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../ui/Text';
import { QuantitySelector } from '../product/QuantitySelector';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import type { LocalCartItem } from '@/types/models';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeOutRight,
  SlideInLeft,
  Layout,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface CartItemCardProps {
  item: LocalCartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) {
  const theme = useThemeColor();
  const { product, quantity } = item;
  const price = product.discount_price ?? product.price;

  const handleRemove = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onRemove();
  };

  return (
    <Animated.View
      entering={SlideInLeft.springify().damping(20).stiffness(100)}
      exiting={FadeOutRight.duration(250)}
      layout={Layout.springify().damping(20).stiffness(180)}
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          ...Shadows.sm,
          shadowColor: theme.shadowColor,
        },
      ]}
    >
      {/* Product Image */}
      <Image
        source={product.image_url}
        style={[styles.image, { backgroundColor: theme.skeleton }]}
        contentFit="cover"
        transition={300}
      />

      {/* Details */}
      <View style={styles.details}>
        {/* Header row with name + remove */}
        <View style={styles.headerRow}>
          <Text
            variant="md"
            weight="semiBold"
            style={styles.title}
            numberOfLines={2}
          >
            {product.name_he}
          </Text>
          <Pressable onPress={handleRemove} style={styles.removeBtn} hitSlop={10}>
            <MaterialIcons name="close" size={18} color={theme.textTertiary} />
          </Pressable>
        </View>

        {/* Unit + per-item price */}
        <Text variant="sm" color={theme.textSecondary} style={styles.unit}>
          {product.unit} • {formatPrice(price)}
        </Text>

        {/* Quantity + Total */}
        <View style={styles.bottomRow}>
          <QuantitySelector
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            size="sm"
          />
          <Text variant="lg" weight="bold" color={theme.text}>
            {formatPrice(price * quantity)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse', // RTL: image on right
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: BorderRadius.md,
    flexShrink: 0,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 84,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'right', // RTL
    marginStart: Spacing.sm,
  },
  removeBtn: {
    padding: Spacing.xs,
    marginTop: -Spacing.xs,
    marginEnd: -Spacing.xs,
  },
  unit: {
    textAlign: 'right', // RTL
  },
  bottomRow: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
});
