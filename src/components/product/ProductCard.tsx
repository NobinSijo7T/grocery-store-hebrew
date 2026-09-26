// ============================================================
// ProductCard Component — Farm-to-Table Premium
// ============================================================
// Generous image area, organic badge overlays, spring add-to-cart,
// lift-on-press effect, warm cream background.

import { BorderRadius, Layout, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useFavorites } from '@/hooks/useFavorites';
import { useThemeStore } from '@/stores/themeStore';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types/models';
import { formatPrice } from '@/utils/format';
import { SPRING_CONFIGS } from '@/utils/animations';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { Badge } from '../ui/Badge';
import { Text } from '../ui/Text';
import { QuantitySelector } from './QuantitySelector';
import * as Haptics from 'expo-haptics';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface ProductCardProps {
  product: Product;
  index?: number;
}

const blurhash =
  '|KKoSZ%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const theme = useThemeColor();
  const isDark = useThemeStore((s) => s.isDark);
  const { t, language } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  const cartItemQuantity = useCartStore((state) => state.getItemQuantity(product.id));
  const { addItem, incrementItem, decrementItem } = useCartStore();

  // Card press animation — lift effect
  const cardScale = useSharedValue(1);
  const cardShadowOpacity = useSharedValue(0.10);
  // Add-to-cart button bounce
  const btnScale = useSharedValue(1);
  // Heart bounce animation
  const heartScale = useSharedValue(1);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    shadowOpacity: cardShadowOpacity.value,
  }));

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleFavoritePress = useCallback(
    (e: any) => {
      e?.stopPropagation?.();
      heartScale.value = withSequence(
        withSpring(1.4, { damping: 4, stiffness: 350 }),
        withSpring(1, { damping: 10, stiffness: 300 })
      );
      toggleFavorite(product.id);
    },
    [heartScale, product.id, toggleFavorite]
  );

  const handleCardPress = useCallback(() => {
    router.push(`/product/${product.id}` as any);
  }, [product.id]);

  const handlePressIn = useCallback(() => {
    cardScale.value = withSpring(0.97, SPRING_CONFIGS.snappy);
    cardShadowOpacity.value = withSpring(0.18, SPRING_CONFIGS.snappy);
  }, [cardScale, cardShadowOpacity]);

  const handlePressOut = useCallback(() => {
    cardScale.value = withSpring(1, SPRING_CONFIGS.gentle);
    cardShadowOpacity.value = withSpring(0.10, SPRING_CONFIGS.gentle);
  }, [cardScale, cardShadowOpacity]);

  const handleAddToCart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Bounce the button
    btnScale.value = withSequence(
      withSpring(1.35, SPRING_CONFIGS.cartBounce),
      withSpring(0.9, SPRING_CONFIGS.bouncy),
      withSpring(1, SPRING_CONFIGS.gentle)
    );
    addItem(product);
  }, [addItem, product, btnScale]);

  const handleIncrement = useCallback(() => incrementItem(product.id), [incrementItem, product.id]);
  const handleDecrement = useCallback(() => decrementItem(product.id), [decrementItem, product.id]);

  const price = product.discount_price ?? product.price;
  const hasDiscount = !!product.discount_price;

  // Get product name based on language
  const productName = language === 'he' ? product.name_he : product.name_en || product.name_he;

  // Text alignment based on language direction
  const textAlign = language === 'he' ? 'right' as const : 'left' as const;
  const flexEnd = language === 'he' ? 'flex-end' as const : 'flex-start' as const;
  const flexStart = language === 'he' ? 'flex-start' as const : 'flex-end' as const;

  // Staggered card entry animation
  const entryDelay = Math.min(index * 60, 300);

  return (
    <Animated.View
      entering={FadeInDown.delay(entryDelay).springify().damping(22).stiffness(70)}
      style={[styles.container]}
    >
      <AnimatedPressableBase
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          cardAnimStyle,
          {
            backgroundColor: theme.card,
            shadowColor: theme.shadowColor,
          },
        ]}
      >
          {/* Image with warm placeholder */}
          <View style={styles.imageContainer}>
            <Image
              source={product.image_url}
              placeholder={blurhash}
              contentFit="cover"
              transition={400}
              style={styles.image}
            />

            {/* Badges — organic tags overlay top of image */}
            <View style={styles.badgesContainer}>
              {product.is_organic && (
                <Animated.View entering={ZoomIn.delay(entryDelay + 100).springify()}>
                  <Badge label={t.product.organic} variant="success" style={styles.badge} />
                </Animated.View>
              )}
              {product.seasonal_tag && (
                <Animated.View entering={ZoomIn.delay(entryDelay + 150).springify()}>
                  <Badge label={product.seasonal_tag} variant="accent" style={styles.badge} />
                </Animated.View>
              )}
            </View>

            {/* Discount ribbon */}
            {hasDiscount && (
              <View style={[styles.discountRibbon, { backgroundColor: theme.sale }]}>
                <Text variant="xs" weight="bold" color="#FFFFFF">
                  {`-${Math.round(((product.price - (product.discount_price ?? 0)) / product.price) * 100)}%`}
                </Text>
              </View>
            )}
            {/* Favorite / Like Heart Button */}
            <AnimatedPressableBase
              onPress={handleFavoritePress}
              hitSlop={8}
              style={[
                styles.favoriteButton,
                {
                  backgroundColor: isDark ? 'rgba(30, 30, 26, 0.85)' : 'rgba(255, 255, 255, 0.92)',
                  borderColor: theme.border,
                },
                heartAnimStyle,
              ]}
            >
              <MaterialIcons
                name={favorited ? 'favorite' : 'favorite-border'}
                size={18}
                color={favorited ? '#E63946' : theme.textSecondary}
              />
            </AnimatedPressableBase>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text variant="md" weight="semiBold" numberOfLines={2} style={{ textAlign }}>
              {productName}
            </Text>

            <Text variant="xs" color={theme.textTertiary} style={[styles.unit, { textAlign }]}>
              {product.unit}
            </Text>

            {/* Price row */}
            <View style={[styles.priceContainer, { justifyContent: flexEnd }]}>
              <Text variant="lg" weight="bold" color={hasDiscount ? theme.sale : theme.text}>
                {formatPrice(price)}
              </Text>
              {hasDiscount && (
                <Text
                  variant="xs"
                  color={theme.textTertiary}
                  style={styles.oldPrice}
                >
                  {formatPrice(product.price)}
                </Text>
              )}
            </View>

            {/* Cart Actions */}
            <View style={styles.actionContainer}>
              {cartItemQuantity > 0 ? (
                <QuantitySelector
                  quantity={cartItemQuantity}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  size="sm"
                />
              ) : (
                <Animated.View style={[{ alignSelf: flexStart }, btnAnimStyle]}>
                  <Pressable
                    onPress={handleAddToCart}
                    style={[
                      styles.addButton,
                      {
                        backgroundColor: theme.primary,
                      },
                    ]}
                  >
                    <MaterialIcons name="add" size={22} color="#FFFFFF" />
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </AnimatedPressableBase>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Layout.productCardWidth,
    marginBottom: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    // Shadow declared here, no border (elevation once rule)
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 155, // Taller image area — product hero
    backgroundColor: '#F0EEE4', // Warm linen placeholder
  },
  badgesContainer: {
    position: 'absolute',
    top: Spacing.sm,
    start: Spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  badge: {
    // Slightly smaller, pill-shaped
  },
  discountRibbon: {
    position: 'absolute',
    top: Spacing.sm,
    end: 0,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderTopStartRadius: BorderRadius.sm,
    borderBottomStartRadius: BorderRadius.sm,
  },
  content: {
    padding: Spacing.md,
    gap: 4,
  },
  unit: {
    marginTop: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
    marginTop: 2,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    marginTop: Spacing.sm,
    height: 34,
    justifyContent: 'flex-end',
  },
  addButton: {
    height: 34,
    width: 34,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: Spacing.sm,
    end: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
});
