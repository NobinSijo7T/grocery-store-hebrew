// ============================================================
// Order Detail Screen — Farm Order Receipt & Live Tracking
// ============================================================

import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderTimeline } from '@/components/order/OrderTimeline';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { useOrderDetails } from '@/hooks/useOrders';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { formatDateTime, formatOrderNumber, formatPrice } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();

  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';
  const textAlign = isRTL ? 'right' : 'left';

  const { data: order, isLoading, isError } = useOrderDetails(id as string);

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (isError || !order) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Text variant="lg" color={theme.error} style={{ marginBottom: Spacing.md }}>
          {t.common.error}
        </Text>
        <Button title={t.common.back} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
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
          {t.order.details}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Farm Order Header Banner */}
        <Animated.View entering={FadeInDown.springify()} style={styles.summaryHeader}>
          <View style={[styles.farmBadgeWrap, { backgroundColor: theme.primaryLight }]}>
            <Text style={{ fontSize: 28 }}>🌾</Text>
          </View>
          <Text variant="2xl" weight="bold" color={theme.text}>
            {formatOrderNumber(order.id)}
          </Text>
          <Text variant="sm" color={theme.textSecondary} style={{ marginTop: 2 }}>
            {formatDateTime(order.created_at, language)}
          </Text>
        </Animated.View>

        {/* Live Tracking Timeline Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.surfaceElevated,
                ...Shadows.sm,
                shadowColor: theme.shadowColor,
              },
            ]}
          >
            <View style={[styles.cardTitleRow, { flexDirection }]}>
              <MaterialIcons name="local-shipping" size={20} color={theme.primary} />
              <Text variant="md" weight="bold" color={theme.text}>
                {isRTL ? 'מעקב סטטוס הזמנה' : 'Order Tracking'}
              </Text>
            </View>

            <OrderTimeline status={order.order_status} />

            {order.delivery_slot && (
              <View
                style={[
                  styles.deliveryInfo,
                  {
                    backgroundColor: theme.surface,
                    borderRadius: BorderRadius.md,
                    flexDirection,
                  },
                ]}
              >
                <MaterialIcons name="schedule" size={18} color={theme.primary} />
                <Text variant="sm" weight="medium" color={theme.textSecondary}>
                  {isRTL ? 'חלון זמן למשלוח: ' : 'Delivery window: '}
                  <Text weight="bold" color={theme.text}>
                    {order.delivery_slot}
                  </Text>
                </Text>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Items List Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.surfaceElevated,
                ...Shadows.sm,
                shadowColor: theme.shadowColor,
              },
            ]}
            padding={false}
          >
            <View style={[styles.cardHeader, { flexDirection }]}>
              <MaterialIcons name="shopping-basket" size={20} color={theme.primary} />
              <Text variant="lg" weight="bold" color={theme.text}>
                {t.order.items}
              </Text>
            </View>

            {order.items?.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  {
                    flexDirection,
                    borderTopColor: theme.borderLight,
                    borderTopWidth: StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <View style={[styles.itemMeta, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text variant="md" weight="medium" color={theme.text}>
                    {item.product_name_snapshot}
                  </Text>
                  <Text variant="xs" color={theme.textTertiary} style={{ marginTop: 2 }}>
                    {item.quantity} {item.unit_snapshot} × {formatPrice(item.price_snapshot)}
                  </Text>
                </View>
                <Text variant="md" weight="bold" color={theme.text}>
                  {formatPrice(item.price_snapshot * item.quantity)}
                </Text>
              </View>
            ))}

            {/* Totals Breakdown */}
            <View
              style={[
                styles.totalsContainer,
                {
                  backgroundColor: theme.surface,
                  borderTopColor: theme.borderLight,
                  borderTopWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View style={[styles.totalRow, { flexDirection }]}>
                <Text variant="sm" color={theme.textSecondary}>
                  {t.cart.subtotal}
                </Text>
                <Text variant="sm" weight="medium">
                  {formatPrice(order.subtotal)}
                </Text>
              </View>
              <View style={[styles.totalRow, { flexDirection }]}>
                <Text variant="sm" color={theme.textSecondary}>
                  {t.cart.deliveryFee}
                </Text>
                <Text variant="sm" weight="medium">
                  {order.delivery_fee === 0
                    ? isRTL
                      ? 'חינם'
                      : 'Free'
                    : formatPrice(order.delivery_fee)}
                </Text>
              </View>
              <View style={[styles.totalRow, { flexDirection, marginTop: Spacing.xs }]}>
                <Text variant="lg" weight="bold">
                  {t.cart.total}
                </Text>
                <Text variant="xl" weight="bold" color={theme.primary}>
                  {formatPrice(order.grand_total)}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Delivery Address Card */}
        {order.address && (
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card
              style={[
                styles.sectionCard,
                {
                  backgroundColor: theme.surfaceElevated,
                  ...Shadows.sm,
                  shadowColor: theme.shadowColor,
                },
              ]}
            >
              <View style={[styles.cardTitleRow, { flexDirection }]}>
                <MaterialIcons name="place" size={20} color={theme.primary} />
                <Text variant="md" weight="bold" color={theme.text}>
                  {isRTL ? 'כתובת למשלוח' : 'Delivery Address'}
                </Text>
              </View>

              <Text variant="md" weight="medium" style={{ textAlign }}>
                {order.address.street}, {order.address.city}
              </Text>
              {order.address.notes && (
                <Text
                  variant="xs"
                  color={theme.textSecondary}
                  style={{ textAlign, marginTop: Spacing.xs }}
                >
                  {isRTL ? 'הערות לשליח: ' : 'Driver notes: '}
                  {order.address.notes}
                </Text>
              )}
            </Card>
          </Animated.View>
        )}
      </ScrollView>
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
    paddingBottom: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  farmBadgeWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  cardTitleRow: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  deliveryInfo: {
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  cardHeader: {
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
  },
  itemRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  itemMeta: {
    flex: 1,
  },
  totalsContainer: {
    padding: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  totalRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
