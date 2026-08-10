// ============================================================
// CartItemCard Component
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../ui/Text';
import { QuantitySelector } from '../product/QuantitySelector';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import type { LocalCartItem } from '@/types/models';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeOutLeft, SlideInRight, Layout } from 'react-native-reanimated';

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

  return (
    <Animated.View
      entering={SlideInRight.springify()}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View style={styles.contentContainer}>
        {/* Image on the right (RTL) */}
        <Image
          source={product.image_url}
          style={styles.image}
          contentFit="cover"
        />

        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text variant="lg" weight="semiBold" style={styles.title} numberOfLines={1}>
              {product.name_he}
            </Text>
            <AnimatedPressable onPress={onRemove} style={styles.removeBtn} haptic>
              <MaterialIcons name="close" size={20} color={theme.textTertiary} />
            </AnimatedPressable>
          </View>

          <Text variant="sm" color={theme.textSecondary} style={styles.unit}>
            {product.unit} • {formatPrice(price)}
          </Text>

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
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    padding: Spacing.sm,
  },
  contentContainer: {
    flexDirection: 'row-reverse', // RTL Support
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F3F4F6',
    marginLeft: Spacing.md, // Margin on the left because image is on the right
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  headerRow: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'right', // RTL
  },
  removeBtn: {
    padding: Spacing.xs,
    marginRight: -Spacing.xs,
    marginTop: -Spacing.xs,
  },
  unit: {
    textAlign: 'right', // RTL
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
