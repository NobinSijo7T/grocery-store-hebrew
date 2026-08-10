// ============================================================
// QuantitySelector Component
// ============================================================

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { Text } from '../ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { Layout, SlideInDown, SlideOutDown } from 'react-native-reanimated';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md';
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  isLoading = false,
  size = 'md',
}: QuantitySelectorProps) {
  const theme = useThemeColor();
  const height = size === 'sm' ? 32 : 40;
  const iconSize = size === 'sm' ? 18 : 24;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: theme.primary,
          borderRadius: BorderRadius.full,
        },
      ]}
    >
      <AnimatedPressable
        onPress={onDecrement}
        disabled={isLoading}
        style={styles.button}
        haptic
      >
        <MaterialIcons
          name={quantity === 1 ? 'delete-outline' : 'remove'}
          size={iconSize}
          color="#FFFFFF"
        />
      </AnimatedPressable>

      <View style={styles.quantityContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Animated.View
            key={quantity}
            entering={SlideInDown.springify()}
            exiting={SlideOutDown.springify()}
            layout={Layout.springify()}
          >
            <Text variant={size === 'sm' ? 'sm' : 'md'} weight="bold" color="#FFFFFF">
              {quantity}
            </Text>
          </Animated.View>
        )}
      </View>

      <AnimatedPressable
        onPress={onIncrement}
        disabled={isLoading}
        style={styles.button}
        haptic
      >
        <MaterialIcons name="add" size={iconSize} color="#FFFFFF" />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 100,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: Spacing.sm,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
