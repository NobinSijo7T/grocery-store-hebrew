// ============================================================
// Product Detail Screen — Redesigned
// ============================================================
// THESIS: The product is a living thing from a real farm. The
// screen gives it full-bleed presence, then slides a clean
// white sheet up over the image so content has breathing room.
// Refuses the flat card-stack default and the generic e-comm
// two-column layout.
//
// OWN-WORLD: Fresh Green (#2D8A4E) accent on cream surfaces.
// Heebo Bold/Black for price and name. Soft shadows, 16px
// radius cards. RTL throughout.
//
// STORY: User taps a product, sees it large and vivid, reads
// price and name at a glance, then scrolls into details and
// taps Add to Cart from a sticky bottom bar.
//
// FIRST VIEWPORT: Full-bleed image (55% height), rounded
// white sheet morphs up from bottom with name + price
// immediately visible. Back button top-left, heart top-right.
//
// FINISH: unreviewed and undocumented is unfinished; this
// build ends with the finish review, the verdict, and DESIGN.md
// ============================================================

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Badge } from '@/components/ui/Badge';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { ImageGallery } from '@/components/product/ImageGallery';
import { RelatedProducts } from '@/components/product/RelatedProducts';

import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { useThemeColor } from '@/hooks/useThemeColor';

import { HE } from '@/constants/hebrew';
import { Spacing, Layout, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.52;
const SHEET_BORDER_RADIUS = 28;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const { data: product, isLoading, isError } = useProduct(id as string);

  const cartItemQuantity = useCartStore((state) => state.getItemQuantity(id as string));
  const { addItem, incrementItem, decrementItem } = useCartStore();

  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleFavoritePress = () => {
    setIsFavorited((prev) => !prev);
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.35, duration: 100, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 300 }),
    ]).start();
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (isError || !product) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Text variant="lg" color={theme.error}>{HE.common.error}</Text>
        <Button title={HE.common.back} onPress={() => router.back()} style={{ marginTop: 16 }} />
      </ThemedView>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantityToAdd);
    setQuantityToAdd(1);
    router.push('/(tabs)/cart');
  };

  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
  const price = product.discount_price ?? product.price;
  const hasDiscount = !!product.discount_price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const isInStock = product.stock_qty > 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ── Full-bleed hero image ── */}
      <View style={[styles.heroContainer, { height: IMAGE_HEIGHT }]}>
        <ImageGallery images={images} />
        {/* Gradient fade at bottom so sheet merges cleanly */}
        <LinearGradient
          colors={['transparent', 'transparent', theme.background]}
          locations={[0, 0.6, 1]}
          style={styles.heroGradient}
        />
      </View>

      {/* ── Floating top controls ── */}
      <View style={[styles.topControls, { top: insets.top + 12 }]}>
        {/* Back button */}
        <AnimatedPressable
          onPress={() => router.back()}
          style={[styles.controlBtn, { backgroundColor: 'rgba(255,255,255,0.92)' }]}
        >
          <MaterialIcons name="arrow-back" size={22} color="#1A1A1A" />
        </AnimatedPressable>

        {/* Favorite button */}
        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
          <AnimatedPressable
            onPress={handleFavoritePress}
            style={[styles.controlBtn, { backgroundColor: 'rgba(255,255,255,0.92)' }]}
          >
            <MaterialIcons
              name={isFavorited ? 'favorite' : 'favorite-border'}
              size={22}
              color={isFavorited ? '#E11D48' : '#1A1A1A'}
            />
          </AnimatedPressable>
        </Animated.View>
      </View>

      {/* ── Content sheet ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer that aligns with end of image */}
        <View style={{ height: IMAGE_HEIGHT - SHEET_BORDER_RADIUS - 4 }} />

        {/* White morphing sheet */}
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              borderTopLeftRadius: SHEET_BORDER_RADIUS,
              borderTopRightRadius: SHEET_BORDER_RADIUS,
            },
          ]}
        >
          {/* Drag handle pill */}
          <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />

          {/* ── Name + Stock row ── */}
          <View style={styles.nameRow}>
            <View style={styles.nameBlock}>
              {/* Stock indicator */}
              <View style={styles.stockRow}>
                <View style={[styles.stockDot, { backgroundColor: isInStock ? theme.success : theme.error }]} />
                <Text variant="sm" color={isInStock ? theme.success : theme.error} weight="medium">
                  {isInStock ? `${product.stock_qty} ${HE.product.inStock ?? 'במלאי'}` : HE.product.outOfStock ?? 'אזל'}
                </Text>
              </View>
              <Text
                variant="2xl"
                weight="black"
                style={styles.productName}
                color={theme.text}
              >
                {product.name_he}
              </Text>
              <Text variant="md" color={theme.textSecondary} style={styles.unitLabel}>
                {product.unit}
              </Text>
            </View>
          </View>

          {/* ── Badges ── */}
          {(product.is_organic || product.seasonal_tag || hasDiscount || product.is_featured) && (
            <View style={styles.badgeRow}>
              {product.is_organic && <Badge label={HE.product.organic} variant="success" />}
              {product.seasonal_tag && <Badge label={product.seasonal_tag} variant="accent" />}
              {product.is_featured && <Badge label="⭐ מומלץ" variant="primary" />}
              {hasDiscount && <Badge label={`${discountPercent}% הנחה`} variant="error" />}
            </View>
          )}

          {/* ── Price block ── */}
          <View style={[styles.priceBlock, { backgroundColor: theme.primaryLight, borderRadius: BorderRadius.lg }]}>
            <View style={styles.priceRow}>
              <Text variant="4xl" weight="black" color={theme.primary} style={styles.currentPrice}>
                {formatPrice(price)}
              </Text>
              {hasDiscount && (
                <View style={styles.oldPriceWrap}>
                  <Text variant="lg" color={theme.textTertiary} style={styles.oldPrice}>
                    {formatPrice(product.price)}
                  </Text>
                </View>
              )}
            </View>
            <Text variant="sm" color={theme.primary} weight="medium" style={styles.perUnit}>
              {'לכל ' + product.unit}
            </Text>
          </View>

          {/* ── Divider ── */}
          <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

          {/* ── Description ── */}
          {product.description_he && (
            <View style={styles.section}>
              <Text variant="lg" weight="bold" color={theme.text} style={styles.sectionTitle}>
                {HE.product.description}
              </Text>
              <Text variant="md" color={theme.textSecondary} style={styles.description}>
                {product.description_he}
              </Text>
            </View>
          )}

          {/* ── Related products ── */}
          <View style={styles.section}>
            <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            ...Shadows.md,
          },
        ]}
      >
        {cartItemQuantity > 0 ? (
          // Already in cart: show inline quantity stepper + in-cart label
          <View style={styles.inCartRow}>
            <View style={styles.inCartLabel}>
              <MaterialIcons name="shopping-cart" size={18} color={theme.primary} />
              <Text variant="md" weight="semiBold" color={theme.primary} style={{ marginRight: 6 }}>
                {cartItemQuantity} {HE.product.inCart}
              </Text>
            </View>
            <QuantitySelector
              quantity={cartItemQuantity}
              onIncrement={() => incrementItem(product.id)}
              onDecrement={() => decrementItem(product.id)}
            />
          </View>
        ) : (
          // Not in cart: quantity picker + big CTA
          <View style={styles.addToCartRow}>
            {/* Compact quantity stepper */}
            <View style={[styles.qtyStepper, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Pressable
                onPress={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                style={styles.qtyBtn}
                hitSlop={8}
              >
                <MaterialIcons name="remove" size={20} color={theme.text} />
              </Pressable>
              <Text variant="lg" weight="bold" color={theme.text} style={styles.qtyNum}>
                {quantityToAdd}
              </Text>
              <Pressable
                onPress={() => setQuantityToAdd(quantityToAdd + 1)}
                style={styles.qtyBtn}
                hitSlop={8}
              >
                <MaterialIcons name="add" size={20} color={theme.text} />
              </Pressable>
            </View>

            {/* CTA */}
            <Button
              title={HE.product.addToCart}
              onPress={handleAddToCart}
              icon="shopping-cart"
              style={styles.addBtn}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Hero ──
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },

  // ── Top controls ──
  topControls: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // ── Scroll / Sheet ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sheet: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.6,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },

  // ── Name row ──
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
  },
  nameBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productName: {
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: 2,
  },
  unitLabel: {
    textAlign: 'right',
  },

  // ── Badges ──
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
    marginBottom: Spacing.lg,
  },

  // ── Price ──
  priceBlock: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  currentPrice: {
    letterSpacing: -0.5,
  },
  oldPriceWrap: {
    marginBottom: 4,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  perUnit: {
    marginTop: 2,
    textAlign: 'right',
  },

  // ── Divider ──
  divider: {
    height: 1,
    marginBottom: Spacing.xl,
  },

  // ── Sections ──
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  description: {
    textAlign: 'right',
    lineHeight: 26,
  },

  // ── Bottom bar ──
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  inCartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inCartLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addToCartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: 4,
    height: 52,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNum: {
    minWidth: 28,
    textAlign: 'center',
  },
  addBtn: {
    flex: 1,
  },
});
