// ============================================================
// Favorites Screen
// ============================================================

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { ProductGrid } from '@/components/home/ProductGrid';
import { Button } from '@/components/ui/Button';

import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/stores/authStore';

import { HE } from '@/constants/hebrew';
import { Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const customer = useAuthStore(s => s.customer);
  
  const { favorites, isLoading } = useFavorites();

  const products = favorites?.map(f => f.product).filter(Boolean) as any[] || [];

  if (!customer) {
    return (
      <ThemedView style={styles.centerContainer}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm, borderBottomColor: theme.border, position: 'absolute', top: 0, width: '100%' }]}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
             <MaterialIcons name="arrow-forward" size={24} color={theme.text} />
          </AnimatedPressable>
          <Text variant="xl" weight="bold">{HE.nav.favorites}</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text variant="lg" style={{ marginBottom: Spacing.md }}>עליך להתחבר כדי לשמור מועדפים</Text>
        <Button title="התחברות" onPress={() => router.push('/account')} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm, borderBottomColor: theme.border }]}>
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
           <MaterialIcons name="arrow-forward" size={24} color={theme.text} />
        </AnimatedPressable>
        <Text variant="xl" weight="bold">{HE.nav.favorites}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ flex: 1 }}>
        {!isLoading && products.length === 0 ? (
           <Animated.View entering={FadeInDown.springify()} style={styles.emptyContainer}>
             <View style={[styles.emptyIconBg, { backgroundColor: theme.surfaceElevated }]}>
               <MaterialIcons name="favorite-border" size={64} color={theme.border} />
             </View>
             <Text variant="2xl" weight="bold" style={styles.emptyTitle}>
               אין מועדפים עדיין
             </Text>
             <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
               המוצרים שתשמרו יופיעו כאן
             </Text>
             <Button 
               title={HE.cart.startShopping} 
               onPress={() => router.replace('/')}
             />
           </Animated.View>
        ) : (
          <ProductGrid
            products={products}
            isLoading={isLoading}
          />
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
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.2xl,
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
    marginBottom: Spacing.2xl,
  },
});
