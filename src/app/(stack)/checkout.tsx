// ============================================================
// Checkout Screen — Farm Delivery & Order
// ============================================================
// Multi-step organic checkout flow with farm-fresh scheduling,
// warm cream surface cards, spring step transitions, and smooth button feedback.

import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartSummary } from '@/components/cart/CartSummary';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useAddresses } from '@/hooks/useAddresses';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

type CheckoutStep = 'address' | 'deliveryTime' | 'payment';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();

  const customer = useAuthStore((s) => s.customer);
  const { items, subtotal, deliveryFee, total, clearCart } = useCartStore();
  const { addresses, defaultAddress } = useAddresses();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlot, setTimeSlot] = useState<string | null>(null);

  // Auto prefill from customer's default address
  useEffect(() => {
    if (defaultAddress && !street && !city) {
      setCity(defaultAddress.city);
      setStreet(defaultAddress.street);
      if (defaultAddress.notes) setNotes(defaultAddress.notes);
    }
  }, [defaultAddress]);

  const isRTL = language === 'he';
  const textAlign = isRTL ? 'right' : 'left';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  if (items.length === 0) {
    router.replace('/');
    return null;
  }

  const handleNextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'address') setStep('deliveryTime');
    else if (step === 'deliveryTime') setStep('payment');
  };

  const handleBackStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'payment') setStep('deliveryTime');
    else if (step === 'deliveryTime') setStep('address');
    else router.back();
  };

  const handlePlaceOrder = async () => {
    if (!customer?.id) {
      console.warn('User must be logged in to place order');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsProcessing(true);

    try {
      // 1. Create Address
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          customer_id: customer.id,
          label: language === 'he' ? 'כתובת למשלוח' : 'Delivery Address',
          street,
          city,
          notes,
        })
        .select()
        .single();

      if (addressError) throw addressError;

      // 2. Create Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customer.id,
          address_id: addressData.id,
          subtotal: subtotal(),
          delivery_fee: deliveryFee(),
          discount_total: 0,
          grand_total: total(),
          payment_status: 'pending',
          order_status: 'pending',
          delivery_slot: timeSlot,
          notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create Order Items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name_snapshot: item.product.name_he,
        unit_snapshot: item.product.unit,
        price_snapshot: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. Success - Clear cart and redirect
      clearCart();
      router.replace(`/order/${orderData.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isNextDisabled = () => {
    if (step === 'address') return !street.trim() || !city.trim();
    if (step === 'deliveryTime') return !timeSlot;
    return false;
  };

  const stepsList: { key: CheckoutStep; title: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { key: 'address', title: language === 'he' ? 'כתובת' : 'Address', icon: 'location-on' },
    { key: 'deliveryTime', title: language === 'he' ? 'מועד משלוח' : 'Time', icon: 'schedule' },
    { key: 'payment', title: language === 'he' ? 'סיכום' : 'Review', icon: 'check-circle' },
  ];

  const currentStepIndex = step === 'address' ? 0 : step === 'deliveryTime' ? 1 : 2;

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
        <AnimatedPressable onPress={handleBackStep} style={styles.backButton}>
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
        </AnimatedPressable>
        <Text variant="xl" weight="bold">
          {t.checkout.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* STEP PROGRESS PILL BAR */}
          <View style={[styles.stepIndicatorContainer, { flexDirection }]}>
            {stepsList.map((s, idx) => {
              const isPastOrCurrent = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <React.Fragment key={s.key}>
                  <View
                    style={[
                      styles.stepPill,
                      {
                        backgroundColor: isCurrent
                          ? theme.primary
                          : isPastOrCurrent
                          ? theme.primaryLight
                          : theme.surfaceElevated,
                        ...Shadows.sm,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={s.icon}
                      size={16}
                      color={isCurrent ? '#FFFFFF' : isPastOrCurrent ? theme.primaryDark : theme.textTertiary}
                    />
                    <Text
                      variant="xs"
                      weight={isCurrent ? 'bold' : 'medium'}
                      color={isCurrent ? '#FFFFFF' : isPastOrCurrent ? theme.primaryDark : theme.textTertiary}
                    >
                      {s.title}
                    </Text>
                  </View>

                  {idx < stepsList.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        {
                          backgroundColor: idx < currentStepIndex ? theme.primary : theme.border,
                        },
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* STEP: ADDRESS */}
          {step === 'address' && (
            <Animated.View entering={FadeInRight.springify()} exiting={FadeOutLeft} style={styles.stepContent}>
              <View style={[styles.stepTitleRow, { flexDirection }]}>
                <Text style={{ fontSize: 24 }}>🏡</Text>
                <Text variant="xl" weight="bold" style={[styles.sectionTitle, { textAlign }]}>
                  {t.checkout.selectAddress}
                </Text>
              </View>

              <Text variant="sm" color={theme.textSecondary} style={{ textAlign, marginBottom: Spacing.lg }}>
                {language === 'he'
                  ? 'השליח שלנו יביא את התוצרת הטרייה ישירות לדלת שלך'
                  : 'Our courier will deliver the fresh produce straight to your doorstep'}
              </Text>

              {/* Saved Addresses quick selection */}
              {addresses.length > 0 && (
                <View style={{ marginBottom: Spacing.md }}>
                  <Text
                    variant="xs"
                    weight="bold"
                    color={theme.textSecondary}
                    style={{ marginBottom: Spacing.xs, textAlign }}
                  >
                    {language === 'he' ? 'בחר מכתובות שמורות:' : 'Select from saved addresses:'}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={[
                      styles.savedAddressesRow,
                      { flexDirection },
                    ]}
                  >
                    {addresses.map((addr) => {
                      const isSelected = city === addr.city && street === addr.street;
                      return (
                        <AnimatedPressable
                          key={addr.id}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setCity(addr.city);
                            setStreet(addr.street);
                            if (addr.notes) setNotes(addr.notes);
                          }}
                          style={[
                            styles.savedAddressPill,
                            {
                              backgroundColor: isSelected ? theme.primaryLight : theme.surfaceElevated,
                              borderColor: isSelected ? theme.primary : theme.border,
                            },
                          ]}
                        >
                          <Text
                            variant="xs"
                            weight={isSelected ? 'bold' : 'medium'}
                            color={isSelected ? theme.primaryDark : theme.text}
                          >
                            {addr.label}: {addr.street}, {addr.city}
                          </Text>
                        </AnimatedPressable>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              <Input
                label={t.checkout.city}
                value={city}
                onChangeText={setCity}
                placeholder={language === 'he' ? 'למשל: תל אביב' : 'e.g., Tel Aviv'}
                icon="location-city"
              />
              <Input
                label={t.checkout.street}
                value={street}
                onChangeText={setStreet}
                placeholder={language === 'he' ? 'למשל: הרצל 15, דירה 3' : 'e.g., Herzl 15, Apt 3'}
                icon="place"
              />
              <Input
                label={t.checkout.notes}
                value={notes}
                onChangeText={setNotes}
                placeholder={
                  language === 'he'
                    ? 'הערות לשליח (למשל: להשאיר ליד הדלת)'
                    : 'Notes for driver (e.g., leave at door)'
                }
                icon="notes"
              />
            </Animated.View>
          )}

          {/* STEP: DELIVERY TIME */}
          {step === 'deliveryTime' && (
            <Animated.View entering={FadeInRight.springify()} exiting={FadeOutLeft} style={styles.stepContent}>
              <View style={[styles.stepTitleRow, { flexDirection }]}>
                <Text style={{ fontSize: 24 }}>🚚</Text>
                <Text variant="xl" weight="bold" style={[styles.sectionTitle, { textAlign }]}>
                  {t.checkout.deliveryTime}
                </Text>
              </View>

              <Text variant="sm" color={theme.textSecondary} style={{ textAlign, marginBottom: Spacing.lg }}>
                {language === 'he'
                  ? 'בחר חלון זמן שמתאים לך לאיסוף התוצרת מהשדה'
                  : 'Select a convenient time window for your fresh delivery'}
              </Text>

              {(Object.keys(t.checkout.timeSlots) as Array<keyof typeof t.checkout.timeSlots>).map((key) => {
                const label = t.checkout.timeSlots[key];
                const isSelected = timeSlot === label;
                return (
                  <AnimatedPressable
                    key={key}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setTimeSlot(label);
                    }}
                    style={[
                      styles.timeSlotCard,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.surfaceElevated,
                        ...Shadows.sm,
                        shadowColor: isSelected ? theme.primary : theme.shadowColor,
                        flexDirection,
                      },
                    ]}
                  >
                    <View style={[styles.timeSlotLeft, { flexDirection }]}>
                      <View
                        style={[
                          styles.timeIconWrap,
                          {
                            backgroundColor: isSelected ? theme.primary : theme.surface,
                          },
                        ]}
                      >
                        <MaterialIcons
                          name="access-time"
                          size={18}
                          color={isSelected ? '#FFFFFF' : theme.textSecondary}
                        />
                      </View>
                      <Text
                        variant="md"
                        weight={isSelected ? 'bold' : 'medium'}
                        color={isSelected ? theme.primaryDark : theme.text}
                      >
                        {label}
                      </Text>
                    </View>

                    {isSelected && (
                      <MaterialIcons name="check-circle" size={24} color={theme.primary} />
                    )}
                  </AnimatedPressable>
                );
              })}
            </Animated.View>
          )}

          {/* STEP: PAYMENT & REVIEW */}
          {step === 'payment' && (
            <Animated.View entering={FadeInRight.springify()} exiting={FadeOutLeft} style={styles.stepContent}>
              <View style={[styles.stepTitleRow, { flexDirection }]}>
                <Text style={{ fontSize: 24 }}>🧾</Text>
                <Text variant="xl" weight="bold" style={[styles.sectionTitle, { textAlign }]}>
                  {t.checkout.review}
                </Text>
              </View>

              <CartSummary subtotal={subtotal()} deliveryFee={deliveryFee()} total={total()} />

              {/* Delivery Details Card */}
              <View
                style={[
                  styles.detailsCard,
                  {
                    backgroundColor: theme.surfaceElevated,
                    ...Shadows.sm,
                    shadowColor: theme.shadowColor,
                  },
                ]}
              >
                <View style={[styles.detailRow, { flexDirection }]}>
                  <MaterialIcons name="place" size={20} color={theme.primary} />
                  <Text variant="sm" weight="medium" style={{ flex: 1, textAlign }}>
                    {city}, {street}
                  </Text>
                </View>

                {timeSlot && (
                  <View style={[styles.detailRow, { flexDirection, marginTop: Spacing.sm }]}>
                    <MaterialIcons name="schedule" size={20} color={theme.primary} />
                    <Text variant="sm" weight="medium" style={{ flex: 1, textAlign }}>
                      {timeSlot}
                    </Text>
                  </View>
                )}

                {notes ? (
                  <View style={[styles.detailRow, { flexDirection, marginTop: Spacing.sm }]}>
                    <MaterialIcons name="notes" size={20} color={theme.textTertiary} />
                    <Text variant="xs" color={theme.textSecondary} style={{ flex: 1, textAlign }}>
                      {notes}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Demo Payment Notice */}
              <View
                style={[
                  styles.placeholderPayment,
                  {
                    backgroundColor: theme.surfaceElevated,
                    ...Shadows.sm,
                    shadowColor: theme.shadowColor,
                  },
                ]}
              >
                <MaterialIcons name="verified-user" size={32} color={theme.primary} style={{ marginBottom: Spacing.xs }} />
                <Text variant="sm" weight="semiBold" color={theme.primaryDark} style={{ textAlign: 'center', marginBottom: 4 }}>
                  {language === 'he' ? 'הזמנה מאובטחת ישירות מהמשק' : 'Secure Farm Direct Order'}
                </Text>
                <Text variant="xs" color={theme.textSecondary} style={{ textAlign: 'center', lineHeight: 18 }}>
                  {language === 'he'
                    ? 'ההזמנה תישלח למשק לאיסוף ואריזה טרייה. התשלום יתבצע בעת האספקה או בהמשך.'
                    : 'Your order will be sent to the farm for fresh packing. Payment is verified upon delivery.'}
                </Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, Spacing.md),
            backgroundColor: theme.surfaceElevated,
            ...Shadows.lg,
            shadowColor: theme.shadowColor,
          },
        ]}
      >
        {step !== 'payment' ? (
          <Button
            title={t.common.next || 'המשך'}
            onPress={handleNextStep}
            disabled={isNextDisabled()}
            size="lg"
            fullWidth
          />
        ) : (
          <Button
            title={t.checkout.placeOrder}
            onPress={handlePlaceOrder}
            loading={isProcessing}
            size="lg"
            fullWidth
            icon="shopping-basket"
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
  },
  stepConnector: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  stepContent: {
    marginBottom: Spacing.xl,
  },
  stepTitleRow: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {},
  timeSlotCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  timeSlotLeft: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  placeholderPayment: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  savedAddressesRow: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  savedAddressPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
});
