// ============================================================
// Cart Screen — Farm Market Basket
// ============================================================
// Warm cream background, animated item list, organic empty state,
// harvest orange checkout CTA with glow on press.

import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useCartStore } from '@/stores/cartStore';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();

  const {
    items,
    incrementItem,
    decrementItem,
    removeItem,
    subtotal,
    deliveryFee,
    total
  } = useCartStore();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Beautiful organic empty state
  if (items.length === 0) {
    return (
      <ThemedView style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.springify().damping(16).stiffness(70)} style={styles.emptyContent}>
          {/* Basket illustration using emoji — genuine, not AI-generic */}
          <View style={[styles.emptyIconBg, { backgroundColor: theme.primaryLight }]}>
            <Text style={styles.emptyEmoji}>🧺</Text>
          </View>

          <Text variant="2xl" weight="bold" style={[styles.emptyTitle, { color: theme.text }]}>
            {t.cart.empty}
          </Text>

          <Text
            variant="md"
            color={theme.textSecondary}
            style={styles.emptySubtitle}
          >
            {t.cart.emptySubtitle}
          </Text>

          {/* Suggested categories as organic pills */}
          <View style={styles.suggestedPills}>
            {['🥦', '🍅', '🧀', '🥩'].map((emoji, i) => (
              <Animated.View
                key={emoji}
                entering={FadeInUp.delay(300 + i * 80).springify().damping(14)}
              >
                <AnimatedPressable
                  style={[styles.suggestionPill, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
                  onPress={() => router.push('/')}
                  scaleDown={0.93}
                >
                  <Text style={{ fontSize: 20 }}>{emoji}</Text>
                </AnimatedPressable>
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <Button
              title={t.cart.startShopping}
              onPress={() => router.push('/')}
              variant="primary"
              size="lg"
              icon="storefront"
              style={styles.startShoppingBtn}
            />
          </Animated.View>
        </Animated.View>
      </ThemedView>
    );
  }

  const totalAmount = total();
  const isFreeDelivery = deliveryFee() === 0;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify().damping(20)}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <Text variant="2xl" weight="bold" style={{ textAlign: 'center' }}>
          {t.cart.title}
        </Text>
        {isFreeDelivery && (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={[styles.freeDeliveryBadge, { backgroundColor: theme.primaryLight }]}
          >
            <Text variant="xs" weight="semiBold" color={theme.primary}>
              {language === 'he' ? '✓ משלוח חינם!' : '✓ Free delivery!'}
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 140 } // Space for floating checkout button
        ]}
      >
        {/* Cart items */}
        <View style={styles.itemsList}>
          {items.map((item) => (
            <CartItemCard
              key={item.productId}
              item={item}
              onIncrement={() => incrementItem(item.productId)}
              onDecrement={() => decrementItem(item.productId)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </View>

        {/* Summary */}
        <Animated.View entering={FadeIn.delay(200)}>
          <CartSummary
            subtotal={subtotal()}
            deliveryFee={deliveryFee()}
            total={totalAmount}
          />
        </Animated.View>
      </ScrollView>

      {/* Floating Checkout Button — harvest orange with glow */}
      <Animated.View
        entering={FadeInUp.springify().damping(18)}
        style={[
          styles.checkoutContainer,
          {
            paddingBottom: Math.max(insets.bottom + 80, 100), // Above tab bar
            backgroundColor: theme.surface,
            borderTopColor: theme.borderLight,
          },
        ]}
      >
        <Button
          title={
            language === 'he'
              ? `הזמן עכשיו • ${t.common.shekel}${totalAmount.toFixed(2)}`
              : `Order Now • ${t.common.shekel}${totalAmount.toFixed(2)}`
          }
          onPress={handleCheckout}
          fullWidth
          size="lg"
          variant="primary"
          icon="arrow-forward"
          iconPosition="end"
        />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  freeDeliveryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  itemsList: {
    marginBottom: Spacing.xl,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    zIndex: 10,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.md,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  suggestedPills: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.md,
  },
  suggestionPill: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  startShoppingBtn: {
    minWidth: 220,
  },
});
