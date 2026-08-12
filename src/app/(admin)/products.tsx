// ============================================================
// Admin Products
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Switch,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductFormModal } from '@/components/product/ProductFormModal';
import type { Product } from '@/types/models';

export default function AdminProducts() {
  const theme = useThemeColor();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { language } = useTranslation();
  const isRTL = language === 'he';

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleProductActive = async (productId: string, currentStatus: boolean) => {
    setProducts(products.map(p => p.id === productId ? { ...p, is_active: !currentStatus } : p));
    await supabase.from('products').update({ is_active: !currentStatus }).eq('id', productId);
  };

  const toggleProductStock = async (productId: string, currentStock: number) => {
    const newStock = currentStock > 0 ? 0 : 100;
    setProducts(products.map(p => p.id === productId ? { ...p, stock_qty: newStock } : p));
    await supabase.from('products').update({ stock_qty: newStock }).eq('id', productId);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleSaved = () => {
    fetchProducts();
  };

  const renderItem = ({ item, index }: any) => (
    <Animated.View entering={FadeIn.delay(index * 30)}>
      <Card style={styles.card} padding={false}>
        <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Image
            source={item.image_url}
            style={[styles.image, isRTL ? { marginLeft: Spacing.md } : { marginRight: Spacing.md }]}
            contentFit="cover"
          />
          <View style={[styles.details, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text variant="md" weight="bold">
              {language === 'he' ? item.name_he : (item.name_en || item.name_he)}
            </Text>
            <Text variant="sm" color={theme.textSecondary}>
              {language === 'he' ? item.category?.name_he : (item.category?.name_en || item.category?.name_he)} • {item.unit}
            </Text>
            <View style={styles.priceRow}>
              {item.discount_price != null && (
                <Text variant="sm" color={theme.textTertiary} style={styles.oldPrice}>
                  {formatPrice(item.price)}
                </Text>
              )}
              <Text variant="lg" weight="bold" color={item.discount_price != null ? theme.accent : theme.primary} style={{ marginTop: Spacing.xs }}>
                {formatPrice(item.discount_price ?? item.price)}
              </Text>
            </View>
          </View>

          {/* Edit button */}
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: theme.primaryLight }]}
            onPress={() => openEdit(item as Product)}
            hitSlop={8}
          >
            <MaterialIcons name="edit" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.actions, { borderTopColor: theme.borderLight, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.actionToggle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text variant="sm">{language === 'he' ? 'פעיל' : 'Active'}</Text>
            <Switch
              value={item.is_active}
              onValueChange={() => toggleProductActive(item.id, item.is_active)}
              trackColor={{ true: theme.primary }}
            />
          </View>

          <View style={[styles.actionToggle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text variant="sm" color={item.stock_qty > 0 ? theme.success : theme.error}>
              {item.stock_qty > 0
                ? (language === 'he' ? 'במלאי' : 'In Stock')
                : (language === 'he' ? 'חסר במלאי' : 'Out of Stock')}
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
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[
          styles.searchInputContainer,
          { backgroundColor: theme.surfaceElevated, borderColor: theme.border, flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}>
          <MaterialIcons name="search" size={20} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={language === 'he' ? 'חיפוש מוצרים...' : 'Search products...'}
            placeholderTextColor={theme.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Product count */}
      {!loading && (
        <View style={[styles.countBar, { backgroundColor: theme.background }]}>
          <Text variant="sm" color={theme.textTertiary}>
            {language === 'he' ? `${products.length} מוצרים` : `${products.length} products`}
          </Text>
        </View>
      )}

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
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialIcons name="inventory-2" size={48} color={theme.textTertiary} />
              <Text variant="md" color={theme.textTertiary} style={{ marginTop: Spacing.md }}>
                {language === 'he' ? 'לא נמצאו מוצרים' : 'No products found'}
              </Text>
            </View>
          }
        />
      )}

      {/* FAB — Add Product */}
      <Animated.View entering={FadeIn.delay(200)} style={[styles.fab, { backgroundColor: theme.primary }, Shadows.xl]}>
        <TouchableOpacity onPress={openAdd} style={styles.fabInner} activeOpacity={0.85}>
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Product Form Modal */}
      <ProductFormModal
        visible={modalVisible}
        product={editingProduct}
        onClose={handleModalClose}
        onSaved={handleSaved}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  searchContainer: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
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
  countBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  list: { padding: Spacing.lg, paddingBottom: 120 },
  card: { marginBottom: Spacing.md },
  row: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  image: { width: 64, height: 64, borderRadius: BorderRadius.sm },
  details: { flex: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  oldPrice: {
    textDecorationLine: 'line-through',
    marginTop: Spacing.xs,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: Spacing.sm,
  },
  actions: {
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderTopWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  actionToggle: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  fabInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
