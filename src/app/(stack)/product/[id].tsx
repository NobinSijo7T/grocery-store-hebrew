// ============================================================
// Product Detail Screen — Farm-to-Table Showcase
// ============================================================
// Full-bleed natural produce photography, warm cream content sheet,
// organic badge pills, spring heart animation, sticky organic bottom bar.

import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImageGallery } from '@/components/product/ImageGallery';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { useProduct } from '@/hooks/useProducts';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useCartStore } from '@/stores/cartStore';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.48;
const SHEET_BORDER_RADIUS = 32;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();

  const { data: product, isLoading, isError } = useProduct(id as string);

  const cartItemQuantity = useCartStore((state) => state.getItemQuantity(id as string));
  const { addItem, incrementItem, decrementItem } = useCartStore();

  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // Reanimated spring for heart
  const heartScale = useSharedValue(1);

  const handleFavoritePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFavorited((prev) => !prev);
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 4, stiffness: 350 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

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
        <Text variant="lg" color={theme.error} style={{ marginBottom: Spacing.md }}>
          {t.common.error}
        </Text>
        <Button title={t.common.back} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(product, quantityToAdd);
    setQuantityToAdd(1);
  };

  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
  const price = product.discount_price ?? product.price;
  const hasDiscount = !!product.discount_price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const isInStock = product.stock_qty > 0;

  const productName = language === 'he' ? product.name_he : product.name_en || product.name_he;
  const productDescription =
    language === 'he' ? product.description_he : product.description_en || product.description_he;

  const isRTL = language === 'he';
  const textAlign = isRTL ? 'right' : 'left';
  const alignItems = isRTL ? 'flex-end' : 'flex-start';

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ── Full-bleed hero image ── */}
      <View style={[styles.heroContainer, { height: IMAGE_HEIGHT }]}>
        <ImageGallery images={images} />
        {/* Soft bottom gradient merge */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.02)', theme.surfaceElevated]}
          locations={[0, 0.7, 1]}
          style={styles.heroGradient}
        />
      </View>

      {/* ── Floating top controls ── */}
      <View style={[styles.topControls, { top: insets.top + 10 }]}>
        {/* Back button */}
        <AnimatedPressable
          onPress={() => router.back()}
          style={[styles.controlBtn, { backgroundColor: 'rgba(255, 255, 255, 0.94)', ...Shadows.sm }]}
        >
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={theme.text} />
        </AnimatedPressable>

        {/* Favorite button */}
        <Animated.View style={heartAnimatedStyle}>
          <AnimatedPressable
            onPress={handleFavoritePress}
            style={[styles.controlBtn, { backgroundColor: 'rgba(255, 255, 255, 0.94)', ...Shadows.sm }]}
          >
            <MaterialIcons
              name={isFavorited ? 'favorite' : 'favorite-border'}
              size={22}
              color={isFavorited ? '#DC2626' : theme.text}
            />
          </AnimatedPressable>
        </Animated.View>
      </View>

      {/* ── Content sheet ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 130 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer that aligns with end of image */}
        <View style={{ height: IMAGE_HEIGHT - SHEET_BORDER_RADIUS }} />

        {/* Warm cream morphing sheet */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surfaceElevated,
              borderTopLeftRadius: SHEET_BORDER_RADIUS,
              borderTopRightRadius: SHEET_BORDER_RADIUS,
              ...Shadows.md,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          {/* Drag handle pill */}
          <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />

          {/* ── Badges Row ── */}
          <View style={[styles.badgeRow, { justifyContent: alignItems }]}>
            {product.is_organic && <Badge label={t.product.organic} variant="success" />}
            {product.seasonal_tag && <Badge label={`🌾 ${product.seasonal_tag}`} variant="accent" />}
            {product.is_featured && (
              <Badge label={language === 'he' ? '⭐ מומלץ המשק' : '⭐ Farm Pick'} variant="primary" />
            )}
            {hasDiscount && (
              <Badge
                label={language === 'he' ? `${discountPercent}% הנחה` : `${discountPercent}% OFF`}
                variant="error"
              />
            )}
          </View>

          {/* ── Name + Stock ── */}
          <View style={[styles.nameBlock, { alignItems }]}>
            <Text
              variant="3xl"
              weight="bold"
              style={[styles.productName, { textAlign }]}
              color={theme.text}
            >
              {productName}
            </Text>

            <View style={[styles.stockRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View
                style={[
                  styles.stockDot,
                  { backgroundColor: isInStock ? theme.success : theme.error },
                ]}
              />
              <Text
                variant="sm"
                color={isInStock ? theme.success : theme.error}
                weight="semiBold"
              >
                {isInStock ? `${product.stock_qty} ${t.product.inStock}` : t.product.outOfStock}
              </Text>
              <Text variant="sm" color={theme.textTertiary}>
                • {product.unit}
              </Text>
            </View>
          </View>

          {/* ── Price Block ── */}
          <View
            style={[
              styles.priceBlock,
              {
                backgroundColor: theme.surface,
                borderRadius: BorderRadius.xl,
                ...Shadows.sm,
                shadowColor: theme.shadowColor,
                alignItems,
              },
            ]}
          >
            <View style={[styles.priceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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
            <Text variant="sm" color={theme.textSecondary} weight="medium" style={{ marginTop: 2 }}>
              {language === 'he' ? 'מחיר לפי ' + product.unit : 'Price per ' + product.unit}
            </Text>
          </View>

          {/* ── Farm Fresh Guarantee Pill ── */}
          <View style={[styles.guaranteePill, { backgroundColor: theme.primaryLight, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialIcons name="verified" size={20} color={theme.primaryDark} />
            <Text variant="sm" weight="semiBold" color={theme.primaryDark} style={{ flex: 1, textAlign }}>
              {language === 'he'
                ? 'נבחר הבוקר טרי ישירות מן השדה והמטעים'
                : 'Picked fresh this morning directly from orchards & fields'}
            </Text>
          </View>

          {/* ── Description ── */}
          {productDescription && (
            <View style={styles.section}>
              <Text
                variant="xl"
                weight="bold"
                color={theme.text}
                style={[styles.sectionTitle, { textAlign }]}
              >
                {t.product.description}
              </Text>
              <Text
                variant="md"
                color={theme.textSecondary}
                style={[styles.description, { textAlign, lineHeight: 26 }]}
              >
                {productDescription}
              </Text>
            </View>
          )}

          {/* ── Related products ── */}
          <View style={styles.section}>
            <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Sticky Bottom Bar ── */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
            backgroundColor: theme.surfaceElevated,
            ...Shadows.lg,
            shadowColor: theme.shadowColor,
          },
        ]}
      >
        {cartItemQuantity > 0 ? (
          // In Cart State
          <View style={[styles.inCartRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.inCartLabel, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <MaterialIcons name="shopping-basket" size={22} color={theme.primary} />
              <Text variant="md" weight="bold" color={theme.primary}>
                {cartItemQuantity} {t.product.inCart}
              </Text>
            </View>
            <QuantitySelector
              quantity={cartItemQuantity}
              onIncrement={() => incrementItem(product.id)}
              onDecrement={() => decrementItem(product.id)}
            />
          </View>
        ) : (
          // Add To Cart State
          <View style={[styles.addToCartRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {/* Stepper */}
            <View
              style={[
                styles.qtyStepper,
                {
                  backgroundColor: theme.surface,
                  ...Shadows.sm,
                  shadowColor: theme.shadowColor,
                },
              ]}
            >
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

            {/* CTA Button */}
            <Button
              title={`${t.product.addToCart} • ${formatPrice(price * quantityToAdd)}`}
              onPress={handleAddToCart}
              icon="shopping-basket"
              style={styles.addBtn}
              size="lg"
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
    padding: Spacing.xl,
  },
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
    height: 80,
  },
  topControls: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sheet: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.58,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  dragHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  nameBlock: {
    marginBottom: Spacing.lg,
  },
  stockRow: {
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xs,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productName: {
    lineHeight: 38,
  },
  priceBlock: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  priceRow: {
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
  guaranteePill: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  description: {
    lineHeight: 26,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  inCartRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inCartLabel: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  addToCartRow: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 6,
    height: 52,
  },
  qtyBtn: {
    width: 38,
    height: 38,
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
