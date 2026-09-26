// ============================================================
// Orders History Screen — Farm Delivery Timeline
// ============================================================
// Order cards with warm surfaces, status badges with earthy colors,
// spring-staggered list entrance, organic empty state.

import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { SmoothLoader } from '@/components/ui/SmoothLoader';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { formatDateTime, formatOrderNumber, formatPrice } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const customer = useAuthStore(s => s.customer);
  const { signInWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isRTL = language === 'he';

  const { data: orders, isLoading, isError, refetch, isRefetching } = useOrders();

  const handleGoogleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(
        language === 'he' ? 'שגיאת התחברות עם Google' : 'Google Sign-In Error',
        error.message ||
          (language === 'he' ? 'לא ניתן להשלים את ההתחברות' : 'Could not complete Google sign-in')
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Not signed in
  if (!customer) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Text variant="2xl" weight="bold">
            {t.order.title}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.guestScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Delivery & Orders Emblem */}
          <Animated.View entering={FadeInDown.springify()} style={styles.guestEmblemContainer}>
            <View style={[styles.guestEmblemOuter, { backgroundColor: theme.primaryLight }]}>
              <View style={[styles.guestEmblemInner, { backgroundColor: theme.surface }]}>
                <MaterialIcons name="local-shipping" size={38} color={theme.primary} />
              </View>
            </View>
          </Animated.View>

          {/* Heading & Subtitle */}
          <Text variant="2xl" weight="bold" style={styles.guestTitle}>
            {language === 'he' ? 'מעקב אחר משלוחי המשק' : 'Track Your Farm Deliveries'}
          </Text>
          <Text
            variant="md"
            color={theme.textSecondary}
            style={styles.guestSubtitle}
          >
            {language === 'he'
              ? 'התחברו כדי לצפות בהזמנות פעילות, לעקוב אחר המשלוח בזמן אמת ולשחזר הזמנות בקלות'
              : 'Sign in to track active orders in real-time, view digital receipts, and reorder fresh favorites'}
          </Text>

          {/* Order Features list */}
          <View style={[styles.featuresCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <View style={[styles.featureRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.featureIconBadge, { backgroundColor: theme.primaryLight }]}>
                <MaterialIcons name="notifications-active" size={18} color={theme.primary} />
              </View>
              <Text variant="sm" weight="medium" color={theme.text} style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {language === 'he' ? 'עדכונים חיים על יציאת המשלוח לדרך' : 'Live dispatch and delivery tracking'}
              </Text>
            </View>

            <View style={[styles.featureRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.featureIconBadge, { backgroundColor: theme.primaryLight }]}>
                <MaterialIcons name="receipt-long" size={18} color={theme.primary} />
              </View>
              <Text variant="sm" weight="medium" color={theme.text} style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {language === 'he' ? 'היסטוריית רכישות וקבלות דיגיטליות' : 'Complete purchase history and digital receipts'}
              </Text>
            </View>

            <View style={[styles.featureRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.featureIconBadge, { backgroundColor: theme.primaryLight }]}>
                <MaterialIcons name="replay" size={18} color={theme.primary} />
              </View>
              <Text variant="sm" weight="medium" color={theme.text} style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {language === 'he' ? 'הזמנה חוזרת של מוצרים אהובים בלחיצה' : '1-tap reordering of favorite produce'}
              </Text>
            </View>
          </View>

          {/* Action Card */}
          <View style={[styles.guestActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <GoogleSignInButton
              onPress={handleGoogleSignIn}
              loading={isGoogleLoading}
            />

            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text variant="xs" color={theme.textTertiary} style={styles.dividerText}>
                {language === 'he' ? 'או באמצעות אימייל' : 'or with email'}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <Button
              title={t.auth.signIn}
              onPress={() => router.push('/(auth)/login' as any)}
              fullWidth
              size="lg"
              icon="login"
            />
          </View>

          {/* Return to store link */}
          <AnimatedPressable
            onPress={() => router.push('/')}
            style={styles.browseStoreLink}
          >
            <MaterialIcons name="storefront" size={20} color={theme.primary} />
            <Text variant="sm" weight="bold" color={theme.primary}>
              {t.cart.startShopping}
            </Text>
          </AnimatedPressable>
        </ScrollView>
      </ThemedView>
    );
  }

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'accent' => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'primary';
      case 'packing': return 'secondary';
      case 'out_for_delivery': return 'accent';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'primary';
    }
  };

  const getStatusLabel = (status: string) => {
    return t.order.statuses[status as keyof typeof t.order.statuses] || status;
  };

  // Status icon map
  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'packing': return '📦';
      case 'out_for_delivery': return '🚗';
      case 'delivered': return '🎉';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (isLoading && !isRefetching) {
    return (
      <ThemedView style={styles.centerContainer}>
        <SmoothLoader
          variant="fullscreen"
          size="lg"
          icon="📦"
          message={language === 'he' ? 'טוען הזמנות מהמשק...' : 'Retrieving your farm orders...'}
        />
      </ThemedView>
    );
  }

  if (!isLoading && (!orders || orders.length === 0)) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.springify()} style={styles.emptyContent}>
          <View style={[styles.emptyIconBg, { backgroundColor: theme.primaryLight }]}>
            <MaterialIcons name="receipt-long" size={48} color={theme.primary} />
          </View>
          <Text variant="2xl" weight="bold" style={styles.emptyTitle}>
            {t.order.empty}
          </Text>
          <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
            {t.order.emptySubtitle}
          </Text>
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <Button
              title={t.cart.startShopping}
              onPress={() => router.push('/')}
              size="lg"
              icon="storefront"
            />
          </Animated.View>
        </Animated.View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        entering={FadeInDown.springify().damping(20)}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <Text variant="2xl" weight="bold">
          {t.order.title}
        </Text>
      </Animated.View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 70).springify().damping(18).stiffness(80)}
          >
            <AnimatedPressable
              style={[
                styles.orderCard,
                {
                  backgroundColor: theme.card,
                  ...Shadows.sm,
                  shadowColor: theme.shadowColor,
                },
              ]}
              onPress={() => router.push(`/order/${item.id}`)}
              scaleDown={0.975}
            >
              {/* Card Header: Order number + Status */}
              <View style={styles.cardHeader}>
                <View style={styles.orderMeta}>
                  <Text variant="lg" weight="bold">
                    {formatOrderNumber(item.id)}
                  </Text>
                  <Text variant="sm" color={theme.textSecondary}>
                    {formatDateTime(item.created_at, language)}
                  </Text>
                </View>
                <Badge
                  label={`${getStatusEmoji(item.order_status)} ${getStatusLabel(item.order_status)}`}
                  variant={getStatusVariant(item.order_status)}
                />
              </View>

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              {/* Card Footer: Item count + Total */}
              <View style={styles.cardFooter}>
                <Text variant="md" color={theme.textSecondary}>
                  {language === 'he'
                    ? `${item.items?.length || 0} פריטים`
                    : `${item.items?.length || 0} items`}
                </Text>
                <Text variant="lg" weight="bold" color={theme.primary}>
                  {formatPrice(item.grand_total)}
                </Text>
              </View>
            </AnimatedPressable>
          </Animated.View>
        )}
      />
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 112,
  },
  orderCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderMeta: {
    gap: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Empty state
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
    fontSize: 52,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  // Guest state
  guestScrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  guestEmblemContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  guestEmblemOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestEmblemInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  guestTitle: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  guestSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: Spacing.lg,
  },
  featuresCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  featureRow: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 4,
  },
  featureIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestActionCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
  },
  browseStoreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
});
