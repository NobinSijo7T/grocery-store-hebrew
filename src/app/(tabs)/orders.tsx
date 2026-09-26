// ============================================================
// Orders History Screen — Farm Delivery Timeline
// ============================================================
// Order cards with warm surfaces, status badges with earthy colors,
// spring-staggered list entrance, organic empty state.

import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { SmoothLoader } from '@/components/ui/SmoothLoader';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useOrders } from '@/hooks/useOrders';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { formatDateTime, formatOrderNumber, formatPrice } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const customer = useAuthStore(s => s.customer);

  const { data: orders, isLoading, isError, refetch, isRefetching } = useOrders();

  // Not signed in
  if (!customer) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Animated.View entering={FadeInDown.springify()} style={styles.authPrompt}>
          <Text style={styles.authEmoji}>🔐</Text>
          <Text variant="xl" weight="semiBold" style={styles.authTitle}>
            {language === 'he' ? 'עליך להתחבר' : 'Sign in required'}
          </Text>
          <Text variant="md" color={theme.textSecondary} style={styles.authSubtitle}>
            {language === 'he'
              ? 'כדי לצפות בהיסטוריית ההזמנות שלך'
              : 'To view your order history'}
          </Text>
          <Button
            title={t.auth.signIn}
            onPress={() => router.push('/account')}
            size="lg"
            style={styles.authBtn}
          />
        </Animated.View>
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
            <Text style={styles.emptyEmoji}>📋</Text>
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
  // Auth prompt
  authPrompt: {
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.md,
  },
  authEmoji: {
    fontSize: 52,
    marginBottom: Spacing.sm,
  },
  authTitle: {
    textAlign: 'center',
  },
  authSubtitle: {
    textAlign: 'center',
  },
  authBtn: {
    marginTop: Spacing.sm,
    minWidth: 200,
  },
});
