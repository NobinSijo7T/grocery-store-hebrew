// ============================================================
// Order Detail Screen
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { OrderTimeline } from '@/components/order/OrderTimeline';
import { Card } from '@/components/ui/Card';

import { useOrderDetails } from '@/hooks/useOrders';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

import { Spacing } from '@/constants/theme';
import { formatPrice, formatDateTime, formatOrderNumber } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  
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
        <Text variant="lg" color={theme.error}>
          {t.common.error}
        </Text>
        <Button title={t.common.back} onPress={() => router.back()} style={{ marginTop: 16 }} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm, borderBottomColor: theme.border }]}>
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
           <MaterialIcons name="arrow-forward" size={24} color={theme.text} />
        </AnimatedPressable>
        <Text variant="xl" weight="bold">{t.order.details}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Order Summary Header */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.summaryHeader}>
          <Text variant="2xl" weight="bold">{formatOrderNumber(order.id)}</Text>
          <Text variant="md" color={theme.textSecondary}>{formatDateTime(order.created_at, language)}</Text>
        </Animated.View>

        {/* Timeline */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Card style={styles.sectionCard}>
            <OrderTimeline status={order.order_status} />
            
            {order.delivery_slot && (
              <View style={[styles.deliveryInfo, { borderTopColor: theme.borderLight }]}>
                <MaterialIcons name="event-available" size={20} color={theme.textSecondary} />
                <Text variant="md" color={theme.textSecondary} style={{ marginRight: 8 }}>
                  {language === 'he' ? 'זמן משלוח משוער:' : 'Estimated delivery:'} {order.delivery_slot}
                </Text>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Items List */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <Card style={styles.sectionCard} padding={false}>
            <View style={{ padding: Spacing.md }}>
              <Text variant="lg" weight="bold">{t.order.items}</Text>
            </View>
            
            {order.items?.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.itemRow, 
                  { borderTopColor: theme.borderLight },
                  index === 0 && { borderTopWidth: 0 }
                ]}
              >
                <View style={styles.itemMeta}>
                  <Text variant="md" weight="medium">{item.product_name_snapshot}</Text>
                  <Text variant="sm" color={theme.textSecondary}>
                    {item.quantity} x {formatPrice(item.price_snapshot)}
                  </Text>
                </View>
                <Text variant="md" weight="bold">
                  {formatPrice(item.price_snapshot * item.quantity)}
                </Text>
              </View>
            ))}
            
            <View style={[styles.totalsContainer, { backgroundColor: theme.surfaceElevated }]}>
               <View style={styles.totalRow}>
                 <Text variant="md" color={theme.textSecondary}>{t.cart.subtotal}</Text>
                 <Text variant="md">{formatPrice(order.subtotal)}</Text>
               </View>
               <View style={styles.totalRow}>
                 <Text variant="md" color={theme.textSecondary}>{t.cart.deliveryFee}</Text>
                 <Text variant="md">
                   {order.delivery_fee === 0 ? (language === 'he' ? 'חינם' : 'Free') : formatPrice(order.delivery_fee)}
                 </Text>
               </View>
               <View style={[styles.totalRow, { marginTop: Spacing.sm }]}>
                 <Text variant="lg" weight="bold">{t.cart.total}</Text>
                 <Text variant="xl" weight="bold" color={theme.primary}>{formatPrice(order.grand_total)}</Text>
               </View>
            </View>
          </Card>
        </Animated.View>

        {/* Delivery Details */}
        {order.address && (
          <Animated.View entering={FadeInUp.delay(400)}>
            <Card style={styles.sectionCard}>
              <Text variant="lg" weight="bold" style={{ marginBottom: Spacing.sm }}>
                {language === 'he' ? 'כתובת למשלוח' : 'Delivery address'}
              </Text>
              <Text variant="md">{order.address.street}</Text>
              <Text variant="md">{order.address.city}</Text>
              {order.address.notes && (
                <Text variant="sm" color={theme.textSecondary} style={{ marginTop: Spacing.xs }}>
                  {language === 'he' ? 'הערות:' : 'Notes:'} {order.address.notes}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sectionCard: {
    marginBottom: Spacing.lg,
  },
  deliveryInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
  },
  itemRow: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  itemMeta: {
    flex: 1,
    alignItems: 'flex-start', // Will be right aligned due to RTL row-reverse
  },
  totalsContainer: {
    padding: Spacing.md,
    borderBottomLeftRadius: 16, // Match card radius
    borderBottomRightRadius: 16,
  },
  totalRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
});
