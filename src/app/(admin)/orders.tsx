// ============================================================
// Admin Orders
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { formatDateTime, formatPrice, formatOrderNumber } from '@/utils/format';
import { HE } from '@/constants/hebrew';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AdminOrders() {
  const theme = useThemeColor();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(full_name, phone)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to all order changes for admin
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
    // Realtime will trigger fetchOrders automatically
  };

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

  const renderItem = ({ item, index }: any) => (
    <Animated.View entering={FadeIn.delay(index * 50)}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
           <View>
             <Text variant="lg" weight="bold">{formatOrderNumber(item.id)}</Text>
             <Text variant="sm" color={theme.textSecondary}>{formatDateTime(item.created_at)}</Text>
           </View>
           <Badge label={HE.order.statuses[item.order_status as keyof typeof HE.order.statuses] || item.order_status} variant={getStatusColor(item.order_status)} />
        </View>
        
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        
        <View style={styles.cardBody}>
           <Text variant="md" weight="medium">{item.customer?.full_name || 'לקוח לא ידוע'}</Text>
           <Text variant="md" color={theme.textSecondary}>{item.customer?.phone}</Text>
           <Text variant="lg" weight="bold" color={theme.primary} style={{ marginTop: Spacing.sm }}>
             {formatPrice(item.grand_total)}
           </Text>
        </View>

        {/* Action Buttons for quick status changes */}
        <View style={[styles.actions, { borderTopColor: theme.borderLight }]}>
           {item.order_status === 'pending' && (
             <Button title="אשר הזמנה" size="sm" onPress={() => updateOrderStatus(item.id, 'confirmed')} style={styles.actionBtn} />
           )}
           {item.order_status === 'confirmed' && (
             <Button title="התחל אריזה" size="sm" onPress={() => updateOrderStatus(item.id, 'packing')} style={styles.actionBtn} />
           )}
           {item.order_status === 'packing' && (
             <Button title="הוצא למשלוח" size="sm" onPress={() => updateOrderStatus(item.id, 'out_for_delivery')} style={styles.actionBtn} />
           )}
           {item.order_status === 'out_for_delivery' && (
             <Button title="סמן כנמסר" size="sm" variant="secondary" onPress={() => updateOrderStatus(item.id, 'delivered')} style={styles.actionBtn} />
           )}
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      {loading && orders.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          onRefresh={fetchOrders}
          refreshing={loading}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: Spacing.lg },
  card: { marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' },
  divider: { height: 1, marginVertical: Spacing.md },
  cardBody: { alignItems: 'flex-end' },
  actions: { flexDirection: 'row-reverse', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, gap: Spacing.sm },
  actionBtn: { flex: 1 },
});
