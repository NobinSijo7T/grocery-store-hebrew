// ============================================================
// Orders History Screen
// ============================================================

import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import { useOrders } from '@/hooks/useOrders';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HE } from '@/constants/hebrew';
import { Spacing, BorderRadius } from '@/constants/theme';
import { formatPrice, formatDateTime, formatOrderNumber } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '@/stores/authStore';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const customer = useAuthStore(s => s.customer);
  
  const { data: orders, isLoading, isError, refetch, isRefetching } = useOrders();

  if (!customer) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Text variant="lg" style={{ marginBottom: Spacing.md }}>עליך להתחבר כדי לצפות בהזמנות</Text>
        <Button title="התחברות" onPress={() => router.push('/account')} />
      </ThemedView>
    );
  }

  const getStatusColor = (status: string) => {
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
    return HE.order.statuses[status as keyof typeof HE.order.statuses] || status;
  };

  if (isLoading && !isRefetching) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (!isLoading && (!orders || orders.length === 0)) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.springify()} style={styles.emptyContent}>
          <View style={[styles.emptyIconBg, { backgroundColor: theme.surfaceElevated }]}>
            <MaterialIcons name="receipt-long" size={64} color={theme.border} />
          </View>
          <Text variant="2xl" weight="bold" style={styles.emptyTitle}>
            {HE.order.empty}
          </Text>
          <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
            {HE.order.emptySubtitle}
          </Text>
          <Button 
            title={HE.cart.startShopping} 
            onPress={() => router.push('/')}
          />
        </Animated.View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text variant="2xl" weight="bold">{HE.order.title}</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeIn.delay(index * 100)}>
            <Card 
              style={styles.orderCard} 
              onPress={() => router.push(`/order/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text variant="lg" weight="bold">
                    {formatOrderNumber(item.id)}
                  </Text>
                  <Text variant="sm" color={theme.textSecondary}>
                    {formatDateTime(item.created_at)}
                  </Text>
                </View>
                <Badge 
                  label={getStatusLabel(item.order_status)} 
                  variant={getStatusColor(item.order_status)} 
                />
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.cardFooter}>
                 <Text variant="md" color={theme.textSecondary}>
                   {item.items?.length || 0} פריטים
                 </Text>
                 <Text variant="lg" weight="bold" color={theme.primary}>
                   {formatPrice(item.grand_total)}
                 </Text>
              </View>
            </Card>
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
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  orderCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyContent: {
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
