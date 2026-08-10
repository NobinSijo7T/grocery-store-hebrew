// ============================================================
// Cart Screen
// ============================================================

import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

import { HE } from '@/constants/hebrew';
import { Spacing } from '@/constants/theme';
import { useCartStore } from '@/stores/cartStore';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  
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

  if (items.length === 0) {
    return (
      <ThemedView style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.springify()} style={styles.emptyContent}>
          <View style={[styles.emptyIconBg, { backgroundColor: theme.surfaceElevated }]}>
            <MaterialIcons name="shopping-cart" size={64} color={theme.border} />
          </View>
          <Text variant="2xl" weight="bold" style={styles.emptyTitle}>
            {HE.cart.empty}
          </Text>
          <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
            {HE.cart.emptySubtitle}
          </Text>
          <Button 
            title={HE.cart.startShopping} 
            onPress={() => router.push('/')}
            style={styles.startShoppingBtn}
          />
        </Animated.View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text variant="2xl" weight="bold">
          {HE.cart.title}
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 120) } // Space for checkout button
        ]}
      >
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

        <Animated.View entering={FadeIn.delay(300)}>
           <CartSummary
             subtotal={subtotal()}
             deliveryFee={deliveryFee()}
             total={total()}
           />
        </Animated.View>
      </ScrollView>

      {/* Persistent Checkout Button */}
      <View style={[
        styles.checkoutContainer, 
        { 
          paddingBottom: Math.max(insets.bottom, Spacing.md),
          backgroundColor: theme.surface,
          borderTopColor: theme.border 
        }
      ]}>
        <Button
          title={`${HE.cart.checkout} • ${HE.common.shekel}${total().toFixed(2)}`}
          onPress={handleCheckout}
          fullWidth
          size="lg"
        />
      </View>
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
    alignItems: 'center', // Center title
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  itemsList: {
    marginBottom: Spacing.xl,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  startShoppingBtn: {
    minWidth: 200,
  },
});
