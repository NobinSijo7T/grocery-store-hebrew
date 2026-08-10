// ============================================================
// Admin Products
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Switch, TextInput } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AdminProducts() {
  const theme = useThemeColor();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, category:categories(name_he)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name_he', `%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Debounce manual search effect or just use a button. We'll do basic fetch on mount and search change.
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleProductActive = async (productId: string, currentStatus: boolean) => {
    // Optimistic UI update
    setProducts(products.map(p => p.id === productId ? { ...p, is_active: !currentStatus } : p));
    
    // DB Update
    await supabase.from('products').update({ is_active: !currentStatus }).eq('id', productId);
  };

  const toggleProductStock = async (productId: string, currentStock: number) => {
    // Simple toggle between 0 (Out of stock) and 100 (In stock) for demo purposes
    const newStock = currentStock > 0 ? 0 : 100;
    
    // Optimistic UI update
    setProducts(products.map(p => p.id === productId ? { ...p, stock_qty: newStock } : p));
    
    // DB Update
    await supabase.from('products').update({ stock_qty: newStock }).eq('id', productId);
  };

  const renderItem = ({ item, index }: any) => (
    <Animated.View entering={FadeIn.delay(index * 30)}>
      <Card style={styles.card} padding={false}>
        <View style={styles.row}>
           <Image source={item.image_url} style={styles.image} contentFit="cover" />
           <View style={styles.details}>
              <Text variant="md" weight="bold">{item.name_he}</Text>
              <Text variant="sm" color={theme.textSecondary}>{item.category?.name_he} • {item.unit}</Text>
              <Text variant="lg" weight="bold" color={theme.primary} style={{ marginTop: Spacing.xs }}>
                {formatPrice(item.discount_price ?? item.price)}
              </Text>
           </View>
        </View>
        
        <View style={[styles.actions, { borderTopColor: theme.borderLight }]}>
           <View style={styles.actionToggle}>
              <Text variant="sm">פעיל</Text>
              <Switch 
                value={item.is_active} 
                onValueChange={() => toggleProductActive(item.id, item.is_active)}
                trackColor={{ true: theme.primary }}
              />
           </View>
           
           <View style={styles.actionToggle}>
              <Text variant="sm" color={item.stock_qty > 0 ? theme.success : theme.error}>
                {item.stock_qty > 0 ? 'במלאי' : 'חסר במלאי'}
              </Text>
              <Switch 
                value={item.stock_qty > 0} 
                onValueChange={() => toggleProductStock(item.id, item.stock_qty)}
                trackColor={{ true: theme.success, false: theme.error }}
              />
           </View>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
         <View style={[styles.searchInputContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
           <MaterialIcons name="search" size={20} color={theme.textTertiary} />
           <TextInput
             style={[styles.searchInput, { color: theme.text }]}
             placeholder="חיפוש מוצרים..."
             placeholderTextColor={theme.textTertiary}
             value={search}
             onChangeText={setSearch}
             textAlign="right"
           />
         </View>
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          onRefresh={fetchProducts}
          refreshing={loading}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginHorizontal: Spacing.sm,
  },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  card: { marginBottom: Spacing.md },
  row: { flexDirection: 'row-reverse', padding: Spacing.md },
  image: { width: 60, height: 60, borderRadius: BorderRadius.sm, marginLeft: Spacing.md },
  details: { flex: 1, alignItems: 'flex-end' },
  actions: { 
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between', 
    padding: Spacing.md, 
    borderTopWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)'
  },
  actionToggle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
  }
});
