// ============================================================
// Checkout Screen
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { CartSummary } from '@/components/cart/CartSummary';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { HE } from '@/constants/hebrew';
import { Spacing, BorderRadius } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

type CheckoutStep = 'address' | 'deliveryTime' | 'payment';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  
  const customer = useAuthStore((s) => s.customer);
  const { items, subtotal, deliveryFee, total, clearCart } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlot, setTimeSlot] = useState<string | null>(null);

  if (items.length === 0) {
    // Should not happen normally, but redirect just in case
    router.replace('/');
    return null;
  }

  const handleNextStep = () => {
    if (step === 'address') setStep('deliveryTime');
    else if (step === 'deliveryTime') setStep('payment');
  };

  const handleBackStep = () => {
    if (step === 'payment') setStep('deliveryTime');
    else if (step === 'deliveryTime') setStep('address');
    else router.back();
  };

  const handlePlaceOrder = async () => {
    if (!customer?.id) {
      // Prompt login or handle guest checkout
      console.warn("User must be logged in to place order (for now)");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Address (simplified, just creating a new one for this order)
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          customer_id: customer.id,
          label: 'כתובת למשלוח',
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
          payment_status: 'pending', // Assume payment integration happens here
          order_status: 'pending',
          delivery_slot: timeSlot,
          notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create Order Items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name_snapshot: item.product.name_he,
        unit_snapshot: item.product.unit,
        price_snapshot: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. Success - Clear cart and redirect to order tracking
      clearCart();
      router.replace(`/order/${orderData.id}`);

    } catch (error) {
      console.error('Error placing order:', error);
      // Show error toast
    } finally {
      setIsProcessing(false);
    }
  };

  const isNextDisabled = () => {
    if (step === 'address') return !street || !city;
    if (step === 'deliveryTime') return !timeSlot;
    return false;
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm, borderBottomColor: theme.border }]}>
        <AnimatedPressable onPress={handleBackStep} style={styles.backButton}>
           <MaterialIcons name="arrow-forward" size={24} color={theme.text} />
        </AnimatedPressable>
        <Text variant="xl" weight="bold">{HE.checkout.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* STEP INDICATOR */}
          <View style={styles.stepIndicator}>
             <View style={[styles.stepDot, { backgroundColor: step === 'address' || step === 'deliveryTime' || step === 'payment' ? theme.primary : theme.border }]} />
             <View style={[styles.stepLine, { backgroundColor: step === 'deliveryTime' || step === 'payment' ? theme.primary : theme.border }]} />
             <View style={[styles.stepDot, { backgroundColor: step === 'deliveryTime' || step === 'payment' ? theme.primary : theme.border }]} />
             <View style={[styles.stepLine, { backgroundColor: step === 'payment' ? theme.primary : theme.border }]} />
             <View style={[styles.stepDot, { backgroundColor: step === 'payment' ? theme.primary : theme.border }]} />
          </View>

          {/* STEP: ADDRESS */}
          {step === 'address' && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Text variant="lg" weight="bold" style={styles.sectionTitle}>{HE.checkout.selectAddress}</Text>
              
              <Input
                label={HE.checkout.city}
                value={city}
                onChangeText={setCity}
                placeholder="למשל: תל אביב"
                icon="location-city"
              />
              <Input
                label={HE.checkout.street}
                value={street}
                onChangeText={setStreet}
                placeholder="למשל: הרצל 15, דירה 3"
                icon="place"
              />
              <Input
                label={HE.checkout.notes}
                value={notes}
                onChangeText={setNotes}
                placeholder="הערות לשליח (למשל: להשאיר ליד הדלת)"
                icon="notes"
              />
            </Animated.View>
          )}

          {/* STEP: DELIVERY TIME */}
          {step === 'deliveryTime' && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Text variant="lg" weight="bold" style={styles.sectionTitle}>{HE.checkout.deliveryTime}</Text>
              
              {(Object.keys(HE.checkout.timeSlots) as Array<keyof typeof HE.checkout.timeSlots>).map((key) => {
                const label = HE.checkout.timeSlots[key];
                const isSelected = timeSlot === label;
                return (
                  <AnimatedPressable
                    key={key}
                    onPress={() => setTimeSlot(label)}
                    style={[
                      styles.timeSlotCard,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.surfaceElevated,
                        borderColor: isSelected ? theme.primary : theme.border,
                      }
                    ]}
                  >
                    <Text variant="md" weight={isSelected ? 'bold' : 'medium'} color={isSelected ? theme.primaryDark : theme.text}>
                      {label}
                    </Text>
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
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
               <Text variant="lg" weight="bold" style={styles.sectionTitle}>{HE.checkout.review}</Text>
               <CartSummary subtotal={subtotal()} deliveryFee={deliveryFee()} total={total()} />
               
               <View style={[styles.placeholderPayment, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                  <MaterialIcons name="payment" size={32} color={theme.textTertiary} style={{ marginBottom: Spacing.sm }} />
                  <Text variant="md" color={theme.textSecondary} style={{ textAlign: 'center' }}>
                    כאן תשולב מערכת סליקת אשראי (למשל Stripe או PayPlus).
                    לצורך ההדגמה, ההזמנה תיווצר בסטטוס "ממתין לתשלום".
                  </Text>
               </View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.md), backgroundColor: theme.surface, borderTopColor: theme.border }]}>
         <Button
           title={step === 'payment' ? HE.checkout.placeOrder : HE.common.next}
           onPress={step === 'payment' ? handlePlaceOrder : handleNextStep}
           disabled={isNextDisabled()}
           loading={isProcessing}
           fullWidth
           size="lg"
         />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 32, // Match back button width to center title
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100, // Space for bottom bar
  },
  stepIndicator: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.2xl,
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepLine: {
    width: 60,
    height: 4,
    marginHorizontal: Spacing.xs,
    borderRadius: 2,
  },
  sectionTitle: {
    marginBottom: Spacing.xl,
    textAlign: 'right', // RTL
  },
  timeSlotCard: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  placeholderPayment: {
    padding: Spacing.xl,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
});
