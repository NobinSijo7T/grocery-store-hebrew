// ============================================================
// Favorites Screen — Saved Farm Produce
// ============================================================
// Warm empty state with organic leaf & heart styling,
// smooth product grid transitions, and RTL/LTR translations.

import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductGrid } from '@/components/home/ProductGrid';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const customer = useAuthStore((s) => s.customer);

  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const { favorites, isLoading } = useFavorites();
  const products = (favorites?.map((f) => f.product).filter(Boolean) as any[]) || [];

  if (!customer) {
    return (
      <ThemedView style={styles.centerContainer}>
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + Spacing.sm,
              flexDirection,
              position: 'absolute',
              top: 0,
              width: '100%',
            },
          ]}
        >
          <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
          </AnimatedPressable>
          <Text variant="xl" weight="bold">
            {t.account.favorites}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={[styles.emptyIconBg, { backgroundColor: '#FDE8E4', marginBottom: Spacing.lg }]}>
          <Text style={{ fontSize: 44 }}>❤️</Text>
        </View>

        <Text variant="xl" weight="bold" style={{ marginBottom: Spacing.xs, textAlign: 'center' }}>
          {isRTL ? 'שמירת מועדפים' : 'Save Your Favorites'}
        </Text>
        <Text
          variant="md"
          color={theme.textSecondary}
          style={{ marginBottom: Spacing.xl, textAlign: 'center', maxWidth: 280 }}
        >
          {isRTL
            ? 'התחבר לחשבון כדי לשמור מוצרים אהובים ולהזמין אותם שוב בקליק'
            : 'Sign in to save your favorite fresh produce and reorder with ease'}
        </Text>
        <Button title={t.auth.signIn} onPress={() => router.push('/account')} size="lg" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.sm,
            flexDirection,
          },
        ]}
      >
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
        </AnimatedPressable>
        <Text variant="xl" weight="bold">
          {t.account.favorites}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ flex: 1 }}>
        {!isLoading && products.length === 0 ? (
          <Animated.View entering={FadeInDown.springify()} style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: '#FDE8E4' }]}>
              <Text style={{ fontSize: 46 }}>🧺</Text>
            </View>
            <Text variant="2xl" weight="bold" style={styles.emptyTitle}>
              {isRTL ? 'עוד לא שמרתם מועדפים' : 'No favorites saved yet'}
            </Text>
            <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
              {isRTL
                ? 'לחצו על הלב במוצרים שאתם אוהבים כדי למצוא אותם כאן תמיד'
                : 'Tap the heart on any farm product to save it for quick reordering'}
            </Text>
            <Button
              title={t.cart.startShopping}
              onPress={() => router.replace('/')}
              size="lg"
              icon="shopping-basket"
            />
          </Animated.View>
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
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
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyIconBg: {
    width: 92,
    height: 92,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
});
