// ============================================================
// Profile Screen — Edit Customer Information
// ============================================================
// Allows customers to update their name, phone number, and details.
// Farm market design system with organic touch feedback, input validation,
// and seamless Supabase synchronization.

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { BorderRadius, Shadows, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const { customer, session, updateProfile } = useAuth();

  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const [fullName, setFullName] = useState(customer?.full_name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState('');

  // Sync if customer changes
  useEffect(() => {
    if (customer) {
      setFullName(customer.full_name || '');
      setPhone(customer.phone || '');
    }
  }, [customer]);

  if (!session || !customer) {
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
            {t.account.editProfile}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <Text variant="lg" weight="bold" style={{ marginBottom: Spacing.sm }}>
          {isRTL ? 'יש להתחבר כדי לערוך פרטים' : 'Sign in to edit your profile'}
        </Text>
        <Button
          title={t.auth.signIn}
          onPress={() => router.push('/(auth)/login' as any)}
          size="lg"
        />
      </ThemedView>
    );
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      setNameError(t.account.fieldRequired);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setNameError('');

    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        t.common.confirm,
        t.account.profileSaved,
        [{ text: t.common.ok, onPress: () => router.back() }]
      );
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t.common.error,
        err.message || (isRTL ? 'שגיאה בשמירת הפרטים' : 'Could not save profile')
      );
    } finally {
      setIsSaving(false);
    }
  };

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
          {t.account.editProfile}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + Spacing['2xl'] },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Avatar Hero */}
          <Animated.View entering={FadeInDown.springify()} style={styles.avatarSection}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
              <Text variant="3xl" weight="bold" color={theme.primaryDark}>
                {fullName.trim().charAt(0) || customer.full_name?.charAt(0) || '🌾'}
              </Text>
              <View style={[styles.avatarLeafBadge, { backgroundColor: theme.primary }]}>
                <MaterialIcons name="eco" size={16} color="#FFFFFF" />
              </View>
            </View>

            <Text variant="lg" weight="bold" style={styles.avatarName}>
              {fullName || (isRTL ? 'חבר משק' : 'Farm Member')}
            </Text>
            <Text variant="sm" color={theme.textSecondary}>
              {session.user.email}
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={[
              styles.formCard,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
                ...Shadows.sm,
              },
            ]}
          >
            {/* Full Name */}
            <Input
              label={t.account.name}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError) setNameError('');
              }}
              placeholder={isRTL ? 'למשל: דניאל כהן' : 'e.g. Daniel Cohen'}
              icon="person"
              error={nameError}
              autoCapitalize="words"
            />

            {/* Phone */}
            <Input
              label={t.account.phone}
              value={phone}
              onChangeText={setPhone}
              placeholder={isRTL ? '050-1234567' : '+972 50 123 4567'}
              icon="phone"
              keyboardType="phone-pad"
            />

            {/* Email (Readonly) */}
            <Input
              label={t.account.email}
              value={session.user.email || ''}
              editable={false}
              icon="email"
              style={{ opacity: 0.7 }}
            />
          </Animated.View>

          {/* Quick link to Manage Addresses */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <AnimatedPressable
              onPress={() => router.push('/addresses' as any)}
              style={[
                styles.addressShortcutCard,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  flexDirection,
                },
              ]}
            >
              <View style={[styles.shortcutIconBg, { backgroundColor: '#FEF3D6' }]}>
                <MaterialIcons name="location-on" size={22} color="#A47814" />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="md" weight="semiBold">
                  {t.account.addresses}
                </Text>
                <Text variant="xs" color={theme.textSecondary}>
                  {isRTL ? 'ניהול כתובות למשלוח מהיר' : 'Manage delivery addresses'}
                </Text>
              </View>
              <MaterialIcons
                name={isRTL ? 'chevron-left' : 'chevron-right'}
                size={22}
                color={theme.textTertiary}
              />
            </AnimatedPressable>
          </Animated.View>

          {/* Save Button */}
          <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginTop: Spacing.xl }}>
            <Button
              title={t.account.save}
              onPress={handleSave}
              loading={isSaving}
              size="lg"
              fullWidth
              icon="check"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  avatarLeafBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarName: {
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  addressShortcutCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  shortcutIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
