// ============================================================
// Admin Dashboard
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminDashboard() {
  const theme = useThemeColor();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const { language } = useTranslation();
  const isRTL = language === 'he';

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch Orders count
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'pending');

      // Calculate Revenue (simple sum of grand_total for non-cancelled)
      const { data: revenueData } = await supabase
        .from('orders')
        .select('grand_total')
        .neq('order_status', 'cancelled');
      
      const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.grand_total || 0), 0) || 0;

      // Products Count
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalRevenue,
        totalProducts: totalProducts || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, delay }: any) => (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.statWrapper}>
      <Card style={styles.statCard}>
        <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
          <MaterialIcons name={icon} size={28} color={color} />
        </View>
        <Text variant="2xl" weight="bold" style={styles.statValue}>{value}</Text>
        <Text variant="md" color={theme.textSecondary}>{title}</Text>
      </Card>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStats} />}
      >
        <Text variant="xl" weight="bold" style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {language === 'he' ? 'סקירה כללית' : 'Overview'}
        </Text>
        
        <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <StatCard 
            title={language === 'he' ? 'הכנסות (סה״כ)' : 'Total Revenue'}
            value={formatPrice(stats.totalRevenue)} 
            icon="payments" 
            color={theme.success} 
            delay={100} 
          />
          <StatCard 
            title={language === 'he' ? 'הזמנות ממתינות' : 'Pending Orders'}
            value={stats.pendingOrders} 
            icon="pending-actions" 
            color={theme.warning} 
            delay={200} 
          />
          <StatCard 
            title={language === 'he' ? 'סה״כ הזמנות' : 'Total Orders'}
            value={stats.totalOrders} 
            icon="receipt-long" 
            color={theme.primary} 
            delay={300} 
          />
          <StatCard 
            title={language === 'he' ? 'מוצרים פעילים' : 'Active Products'}
            value={stats.totalProducts} 
            icon="inventory-2" 
            color={theme.accent} 
            delay={400} 
          />
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  grid: {
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statWrapper: {
    width: '48%', // Approx half minus gap
  },
  statCard: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statValue: {
    marginBottom: Spacing.xs,
  },
});
