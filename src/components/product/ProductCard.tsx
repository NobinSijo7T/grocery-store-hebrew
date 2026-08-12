// ============================================================
// ProductCard Component
// ============================================================

import { BorderRadius, Layout, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types/models';
import { formatPrice } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { QuantitySelector } from './QuantitySelector';

interface ProductCardProps {
  product: Product;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export function ProductCard({ product }: ProductCardProps) {
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const cartItemQuantity = useCartStore((state) => state.getItemQuantity(product.id));
  const { addItem, incrementItem, decrementItem } = useCartStore();

  const handleAddToCart = () => addItem(product);
  const handleIncrement = () => incrementItem(product.id);
  const handleDecrement = () => decrementItem(product.id);

  const price = product.discount_price ?? product.price;
  const hasDiscount = !!product.discount_price;
  
  // Get product name based on language
  const productName = language === 'he' ? product.name_he : product.name_en || product.name_he;
  
  // Text alignment based on language direction
  const textAlign = language === 'he' ? 'right' : 'left';
  const flexEnd = language === 'he' ? 'flex-end' : 'flex-start';
  const flexStart = language === 'he' ? 'flex-start' : 'flex-end';

  return (
    <Link href={`/product/${product.id}`} asChild>
      <AnimatedPressable style={styles.container}>
        <Card style={styles.card} padding={false}>
          {/* Badges Container */}
          <View style={styles.badgesContainer}>
            {product.is_organic && (
              <Badge label={t.product.organic} variant="success" style={styles.badge} />
            )}
            {product.seasonal_tag && (
              <Badge label={product.seasonal_tag} variant="accent" style={styles.badge} />
            )}
            {hasDiscount && (
              <Badge label={t.product.offer} variant="error" style={styles.badge} />
            )}
          </View>

          {/* Image */}
          <Image
            source={product.image_url}
            placeholder={blurhash}
            contentFit="cover"
            transition={300}
            style={styles.image}
          />

          {/* Content */}
          <View style={styles.content}>
            <Text variant="md" weight="semiBold" numberOfLines={2} style={{ textAlign }}>
              {productName}
            </Text>
            
            <Text variant="sm" color={theme.textTertiary} style={{ textAlign }}>
              {product.unit}
            </Text>

            <View style={[styles.priceContainer, { justifyContent: flexEnd }]}>
              <Text variant="lg" weight="bold" color={theme.text}>
                {formatPrice(price)}
              </Text>
              {hasDiscount && (
                <Text
                  variant="sm"
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
                <AnimatedPressable
                  onPress={handleAddToCart}
                  style={[styles.addButton, { backgroundColor: theme.primaryLight, alignSelf: flexStart }]}
                  haptic
                >
                  <MaterialIcons name="add-shopping-cart" size={20} color={theme.primaryDark} />
                </AnimatedPressable>
              )}
            </View>
          </View>
        </Card>
      </AnimatedPressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Layout.productCardWidth,
    marginBottom: Spacing.md,
  },
  card: {
    height: 280,
    justifyContent: 'space-between',
  },
  badgesContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  badge: {
    marginBottom: Spacing.xs,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
    // justifyContent is set dynamically
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    marginTop: Spacing.sm,
    height: 36,
    justifyContent: 'flex-end',
  },
  addButton: {
    height: 36,
    width: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf is set dynamically
  },
});
