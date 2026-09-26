// ============================================================
// Addresses Screen — Customer Delivery Addresses
// ============================================================
// Full management of customer delivery addresses:
// - View list of saved addresses with default badges
// - Add new address with modal sheet
// - Edit existing address
// - Set as default
// - Delete address with confirmation
// - RTL & LTR aware with organic farm market aesthetics

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SmoothLoader } from '@/components/ui/SmoothLoader';

import { useAddresses, type AddressFormData } from '@/hooks/useAddresses';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import type { Address } from '@/types/models';

export default function AddressesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const customer = useAuthStore((s) => s.customer);

  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  // BottomSheet modal ref
  const sheetRef = useRef<BottomSheetModal>(null);

  // Form State
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [label, setLabel] = useState('בית');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [apartment, setApartment] = useState('');
  const [floor, setFloor] = useState('');
  const [entrance, setEntrance] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Validation
  const [streetError, setStreetError] = useState('');
  const [cityError, setCityError] = useState('');

  // Open modal for adding a new address
  const handleOpenAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingAddressId(null);
    setLabel(language === 'he' ? 'בית' : 'Home');
    setStreet('');
    setCity('');
    setApartment('');
    setFloor('');
    setEntrance('');
    setPostalCode('');
    setNotes('');
    setIsDefault(addresses.length === 0);
    setStreetError('');
    setCityError('');
    sheetRef.current?.present();
  };

  // Open modal for editing an existing address
  const handleOpenEdit = (addr: Address) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingAddressId(addr.id);
    setLabel(addr.label || 'בית');
    setStreet(addr.street);
    setCity(addr.city);
    setApartment(addr.apartment || '');
    setFloor(addr.floor || '');
    setEntrance(addr.entrance || '');
    setPostalCode(addr.postal_code || '');
    setNotes(addr.notes || '');
    setIsDefault(addr.is_default);
    setStreetError('');
    setCityError('');
    sheetRef.current?.present();
  };

  // Save (Add or Update)
  const handleSave = async () => {
    let hasError = false;
    if (!street.trim()) {
      setStreetError(t.account.fieldRequired);
      hasError = true;
    } else {
      setStreetError('');
    }

    if (!city.trim()) {
      setCityError(t.account.fieldRequired);
      hasError = true;
    } else {
      setCityError('');
    }

    if (hasError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const formData: AddressFormData = {
      label,
      street: street.trim(),
      city: city.trim(),
      apartment: apartment.trim(),
      floor: floor.trim(),
      entrance: entrance.trim(),
      postal_code: postalCode.trim(),
      notes: notes.trim(),
      is_default: isDefault,
    };

    try {
      if (editingAddressId) {
        await updateAddress.mutateAsync({ id: editingAddressId, data: formData });
      } else {
        await addAddress.mutateAsync(formData);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      sheetRef.current?.dismiss();
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t.common.error, err.message || (isRTL ? 'שגיאה בשמירת הכתובת' : 'Could not save address'));
    }
  };

  // Confirm delete address
  const handleDelete = (addr: Address) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      t.account.deleteAddress,
      t.account.deleteAddressConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress.mutateAsync(addr.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (err: any) {
              Alert.alert(t.common.error, err.message || 'Could not delete address');
            }
          },
        },
      ]
    );
  };

  if (!customer) {
    return (
      <ThemedView style={styles.centerContainer}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm, flexDirection }]}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons
              name={isRTL ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color={theme.text}
            />
          </AnimatedPressable>
          <Text variant="xl" weight="bold">
            {t.account.addresses}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <Text variant="lg" weight="bold" style={{ marginBottom: Spacing.sm }}>
          {isRTL ? 'התחברו כדי לנהל כתובות למשלוח' : 'Sign in to manage your addresses'}
        </Text>
        <Button
          title={t.auth.signIn}
          onPress={() => router.push('/(auth)/login' as any)}
          size="lg"
        />
      </ThemedView>
    );
  }

  const labelOptions = [
    { key: 'home', label: t.account.labelHome, value: language === 'he' ? 'בית' : 'Home' },
    { key: 'work', label: t.account.labelWork, value: language === 'he' ? 'עבודה' : 'Work' },
    { key: 'other', label: t.account.labelOther, value: language === 'he' ? 'אחר' : 'Other' },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Top Bar Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.sm,
            flexDirection,
            borderBottomColor: theme.borderLight,
          },
        ]}
      >
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons
            name={isRTL ? 'arrow-forward' : 'arrow-back'}
            size={24}
            color={theme.text}
          />
        </AnimatedPressable>
        <Text variant="xl" weight="bold">
          {t.account.addresses}
        </Text>
        <AnimatedPressable onPress={handleOpenAdd} style={styles.addButtonIcon}>
          <MaterialIcons name="add" size={26} color={theme.primary} />
        </AnimatedPressable>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing['2xl'] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {isLoading ? (
          <SmoothLoader
            variant="inline"
            message={isRTL ? 'טוען כתובות שמורות...' : 'Loading saved addresses...'}
          />
        ) : addresses.length === 0 ? (
          <Animated.View entering={FadeInDown.springify()} style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: '#FEF3D6' }]}>
              <MaterialIcons name="add-location-alt" size={44} color="#A47814" />
            </View>
            <Text variant="xl" weight="bold" style={styles.emptyTitle}>
              {t.account.noAddresses}
            </Text>
            <Text variant="md" color={theme.textSecondary} style={styles.emptySubtitle}>
              {t.account.noAddressesSubtitle}
            </Text>
            <Button
              title={t.account.addAddress}
              onPress={handleOpenAdd}
              size="lg"
              icon="add"
            />
          </Animated.View>
        ) : (
          <View style={{ gap: Spacing.md }}>
            {addresses.map((addr, index) => {
              const isDefaultAddr = addr.is_default || customer.default_address === addr.id;

              return (
                <Animated.View
                  key={addr.id}
                  entering={FadeInDown.delay(index * 60).springify()}
                  exiting={FadeOut.duration(200)}
                >
                  <View
                    style={[
                      styles.addressCard,
                      {
                        backgroundColor: theme.surfaceElevated,
                        borderColor: isDefaultAddr ? theme.primary : theme.border,
                        borderWidth: isDefaultAddr ? 1.5 : 1,
                        ...Shadows.sm,
                      },
                    ]}
                  >
                    {/* Header Row: Label & Badges */}
                    <View style={[styles.cardHeader, { flexDirection }]}>
                      <View style={[styles.cardLabelRow, { flexDirection }]}>
                        <View style={[styles.labelBadge, { backgroundColor: theme.primaryLight }]}>
                          <Text variant="xs" weight="bold" color={theme.primaryDark}>
                            {addr.label || (isRTL ? 'בית' : 'Home')}
                          </Text>
                        </View>

                        {isDefaultAddr && (
                          <View style={[styles.defaultBadge, { backgroundColor: '#FEF3D6' }]}>
                            <MaterialIcons name="star" size={14} color="#A47814" />
                            <Text variant="xs" weight="bold" color="#A47814">
                              {t.account.isDefaultBadge}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Action buttons: Edit & Delete */}
                      <View style={[styles.cardActions, { flexDirection }]}>
                        <AnimatedPressable
                          onPress={() => handleOpenEdit(addr)}
                          style={[styles.actionIconBtn, { backgroundColor: theme.surface }]}
                          hitSlop={6}
                        >
                          <MaterialIcons name="edit" size={18} color={theme.textSecondary} />
                        </AnimatedPressable>
                        <AnimatedPressable
                          onPress={() => handleDelete(addr)}
                          style={[styles.actionIconBtn, { backgroundColor: theme.surface }]}
                          hitSlop={6}
                        >
                          <MaterialIcons name="delete-outline" size={18} color={theme.error} />
                        </AnimatedPressable>
                      </View>
                    </View>

                    {/* Street & City */}
                    <Text
                      variant="lg"
                      weight="bold"
                      style={[styles.streetText, { textAlign: isRTL ? 'right' : 'left' }]}
                    >
                      {addr.street}
                    </Text>

                    <Text
                      variant="md"
                      color={theme.textSecondary}
                      style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: Spacing.xs }}
                    >
                      {addr.city}
                      {addr.postal_code ? ` • ${addr.postal_code}` : ''}
                    </Text>

                    {/* Apartment, Floor, Entrance info */}
                    {(addr.apartment || addr.floor || addr.entrance) && (
                      <View style={[styles.detailsRow, { flexDirection }]}>
                        {addr.apartment ? (
                          <Text variant="sm" color={theme.textTertiary}>
                            {`${t.account.apartment}: ${addr.apartment}`}
                          </Text>
                        ) : null}
                        {addr.floor ? (
                          <Text variant="sm" color={theme.textTertiary}>
                            {` • ${t.account.floor}: ${addr.floor}`}
                          </Text>
                        ) : null}
                        {addr.entrance ? (
                          <Text variant="sm" color={theme.textTertiary}>
                            {` • ${t.account.entrance}: ${addr.entrance}`}
                          </Text>
                        ) : null}
                      </View>
                    )}

                    {/* Notes */}
                    {addr.notes ? (
                      <View style={[styles.notesContainer, { backgroundColor: theme.surface }]}>
                        <MaterialIcons name="notes" size={16} color={theme.textTertiary} />
                        <Text
                          variant="xs"
                          color={theme.textSecondary}
                          style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}
                          numberOfLines={2}
                        >
                          {addr.notes}
                        </Text>
                      </View>
                    ) : null}

                    {/* Set as Default Toggle if not default */}
                    {!isDefaultAddr && (
                      <AnimatedPressable
                        onPress={() => setDefaultAddress.mutate(addr.id)}
                        style={[
                          styles.setDefaultBtn,
                          {
                            borderColor: theme.border,
                            flexDirection,
                          },
                        ]}
                      >
                        <MaterialIcons name="star-outline" size={18} color={theme.primary} />
                        <Text variant="sm" weight="semiBold" color={theme.primary}>
                          {t.account.setAsDefault}
                        </Text>
                      </AnimatedPressable>
                    )}
                  </View>
                </Animated.View>
              );
            })}

            {/* Bottom Add Address Button */}
            <Button
              title={t.account.addAddress}
              onPress={handleOpenAdd}
              variant="outline"
              size="lg"
              icon="add-location"
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}
      </ScrollView>

      {/* Add / Edit Address BottomSheet Modal */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={['85%']}
        scrollable={true}
      >
        <View style={styles.sheetContent}>
          {/* Sheet Title */}
          <Text
            variant="xl"
            weight="bold"
            style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: Spacing.xs }}
          >
            {editingAddressId ? t.account.editAddress : t.account.addAddress}
          </Text>

          {/* Label selector pills (Home, Work, Other) */}
          <View style={[styles.labelChipsRow, { flexDirection }]}>
            {labelOptions.map((opt) => {
              const isSelected = label === opt.value;
              return (
                <AnimatedPressable
                  key={opt.key}
                  onPress={() => setLabel(opt.value)}
                  style={[
                    styles.labelChip,
                    {
                      backgroundColor: isSelected ? theme.primaryLight : theme.surfaceElevated,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    variant="sm"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? theme.primaryDark : theme.text}
                  >
                    {opt.label}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>

          {/* City */}
          <Input
            label={t.account.city}
            value={city}
            onChangeText={(text) => {
              setCity(text);
              if (cityError) setCityError('');
            }}
            placeholder={isRTL ? 'למשל: תל אביב, ירושלים' : 'e.g. Tel Aviv, Jerusalem'}
            error={cityError}
            icon="location-city"
          />

          {/* Street & House Number */}
          <Input
            label={t.account.street}
            value={street}
            onChangeText={(text) => {
              setStreet(text);
              if (streetError) setStreetError('');
            }}
            placeholder={isRTL ? 'למשל: הרצל 14' : 'e.g. Herzl St 14'}
            error={streetError}
            icon="home"
          />

          {/* Apartment, Floor, Entrance Row */}
          <View style={[styles.row3, { flexDirection }]}>
            <View style={{ flex: 1 }}>
              <Input
                label={t.account.apartment}
                value={apartment}
                onChangeText={setApartment}
                placeholder="4"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label={t.account.floor}
                value={floor}
                onChangeText={setFloor}
                placeholder="2"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label={t.account.entrance}
                value={entrance}
                onChangeText={setEntrance}
                placeholder="א"
              />
            </View>
          </View>

          {/* Postal Code */}
          <Input
            label={t.account.postalCode}
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="6100000"
            keyboardType="numeric"
          />

          {/* Delivery Notes / Gate Code */}
          <Input
            label={t.account.addressNotes}
            value={notes}
            onChangeText={setNotes}
            placeholder={t.account.notesPlaceholder}
            multiline
            numberOfLines={2}
            style={{ height: 60 }}
          />

          {/* Set as Default Switch */}
          <View
            style={[
              styles.switchRow,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
                flexDirection,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text variant="md" weight="semiBold">
                {t.account.defaultAddress}
              </Text>
              <Text variant="xs" color={theme.textSecondary}>
                {isRTL ? 'השתמש בכתובת זו באופן אוטומטי בקופה' : 'Use this address automatically at checkout'}
              </Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ true: theme.primary, false: theme.border }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Submit Button */}
          <Button
            title={t.account.save}
            onPress={handleSave}
            loading={addAddress.isPending || updateAddress.isPending}
            size="lg"
            fullWidth
            icon="check"
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </BottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: Spacing.xs,
  },
  addButtonIcon: {
    padding: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: Spacing.xl,
  },
  addressCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardLabelRow: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  labelBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  cardActions: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streetText: {
    marginBottom: 2,
  },
  detailsRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  setDefaultBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  sheetContent: {
    gap: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  labelChipsRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  labelChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  row3: {
    gap: Spacing.sm,
  },
  switchRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginTop: Spacing.xs,
  },
});
