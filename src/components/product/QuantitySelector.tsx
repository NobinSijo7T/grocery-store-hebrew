// ============================================================
// QuantitySelector Component — Spring Physics Stepper
// ============================================================
// Numbers roll in/out with spring animation.
// Increment: slide up. Decrement: slide down. Natural feel.

import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '../ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  Layout,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SPRING_CONFIGS } from '@/utils/animations';

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
  const prevQuantity = useRef(quantity);
  const isIncrement = quantity >= prevQuantity.current;

  // Update ref after each render
  const currentPrev = prevQuantity.current;
  prevQuantity.current = quantity;

  const height = size === 'sm' ? 33 : 42;
  const iconSize = size === 'sm' ? 17 : 22;
  const minWidth = size === 'sm' ? 95 : 115;

  const handleIncrement = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrement();
  }, [onIncrement]);

  const handleDecrement = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrement();
  }, [onDecrement]);

  return (
    <Animated.View
      entering={ZoomIn.springify().damping(14).stiffness(150)}
      layout={Layout.springify().damping(18).stiffness(200)}
      style={[
        styles.container,
        {
          height,
          minWidth,
          backgroundColor: theme.primary,
          borderRadius: BorderRadius.full,
        },
      ]}
    >
      <Pressable
        onPress={handleDecrement}
        disabled={isLoading}
        style={styles.button}
        hitSlop={8}
      >
        <MaterialIcons
          name={quantity === 1 ? 'delete-outline' : 'remove'}
          size={iconSize}
          color="#FFFFFF"
        />
      </Pressable>

      <View style={styles.quantityContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Animated.View
            key={quantity}
            entering={
              quantity > currentPrev
                ? SlideInDown.springify().damping(16).stiffness(220)
                : SlideInUp.springify().damping(16).stiffness(220)
            }
            exiting={
              quantity > currentPrev
                ? SlideOutUp.springify().damping(16).stiffness(220)
                : SlideOutDown.springify().damping(16).stiffness(220)
            }
          >
            <Text variant={size === 'sm' ? 'md' : 'lg'} weight="bold" color="#FFFFFF">
              {quantity}
            </Text>
          </Animated.View>
        )}
      </View>

      <Pressable
        onPress={handleIncrement}
        disabled={isLoading}
        style={styles.button}
        hitSlop={8}
      >
        <MaterialIcons name="add" size={iconSize} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: Spacing.sm,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
  },
  quantityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
