// ============================================================
// CartSummary Component
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import { HE } from '@/constants/hebrew';
import { ENV } from '@/lib/env';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
}

export function CartSummary({
  subtotal,
  deliveryFee,
  discount = 0,
  total,
}: CartSummaryProps) {
  const theme = useThemeColor();

  const isFreeDelivery = deliveryFee === 0;
  const amountToFreeDelivery = ENV.FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      
      {/* Progress to Free Delivery */}
      {!isFreeDelivery && amountToFreeDelivery > 0 && (
        <View style={styles.progressContainer}>
           <Text variant="sm" color={theme.textSecondary} style={styles.progressText}>
             עוד <Text weight="bold" color={theme.primary}>{formatPrice(amountToFreeDelivery)}</Text> למשלוח חינם!
           </Text>
           <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    backgroundColor: theme.primary,
                    width: `${Math.min(100, (subtotal / ENV.FREE_DELIVERY_THRESHOLD) * 100)}%` 
                  }
                ]} 
              />
           </View>
        </View>
      )}
      
      {isFreeDelivery && (
         <View style={[styles.freeDeliveryBadge, { backgroundColor: theme.primaryLight }]}>
           <Text variant="sm" weight="semiBold" color={theme.primaryDark} style={styles.freeDeliveryText}>
             {HE.cart.freeDelivery}
           </Text>
         </View>
      )}

      {/* Summary Rows */}
      <View style={styles.row}>
        <Text variant="md" color={theme.textSecondary}>{HE.cart.subtotal}</Text>
        <Text variant="md">{formatPrice(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text variant="md" color={theme.textSecondary}>{HE.cart.deliveryFee}</Text>
        <Text variant="md" color={isFreeDelivery ? theme.success : theme.text}>
          {isFreeDelivery ? 'חינם' : formatPrice(deliveryFee)}
        </Text>
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text variant="md" color={theme.error}>{HE.cart.discount}</Text>
          <Text variant="md" color={theme.error}>-{formatPrice(discount)}</Text>
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.row}>
        <Text variant="lg" weight="bold">{HE.cart.total}</Text>
        <Text variant="2xl" weight="bold" color={theme.primary}>
          {formatPrice(total)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    // Note: React Native progress bars might need logic inversion for RTL depending on how it renders,
    // but typically `width` fills from left to right.
  },
  freeDeliveryBadge: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  freeDeliveryText: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
});
