// ============================================================
// Account Screen — Farm Member Profile
// ============================================================
// Warm cream cards, earthy accent icon badges, farm club membership status,
// organic smooth animations and touch feedback.

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

type Language = 'he' | 'en';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const { session, customer, isAdmin } = useAuthStore();
  const { signOut, signInWithGoogle } = useAuth();
  const { isDark, toggle } = useThemeStore();
  const { t, language, setLanguage } = useTranslation();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const handleGoogleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(
        language === 'he' ? 'שגיאת התחברות עם Google' : 'Google Sign-In Error',
        error.message ||
          (language === 'he' ? 'לא ניתן להשלים את ההתחברות' : 'Could not complete Google sign-in')
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    Alert.alert(
      language === 'he' ? 'שינוי שפה' : 'Change Language',
      language === 'he'
        ? 'שינוי השפה ידרוש הפעלה מחדש של האפליקציה. האם להמשיך?'
        : 'Changing language requires app restart. Continue?',
      [
        { text: language === 'he' ? 'ביטול' : 'Cancel', style: 'cancel' },
        {
          text: language === 'he' ? 'המשך' : 'Continue',
          onPress: () => {
            setLanguage(lang);
            Alert.alert(
              language === 'he' ? 'הפעל מחדש' : 'Restart Required',
              language === 'he'
                ? 'אנא סגור והפעל מחדש את האפליקציה כדי להחיל את השינוי'
                : 'Please close and restart the app to apply the change'
            );
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      t.account.signOut,
      t.account.signOutConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.yes,
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const renderMenuItem = (
    icon: keyof typeof MaterialIcons.glyphMap,
    title: string,
    onPress: () => void,
    rightElement?: React.ReactNode,
    index: number = 0,
    iconBgColor: string = theme.primaryLight,
    iconColor: string = theme.primaryDark,
    isLast: boolean = false
  ) => (
    <Animated.View entering={FadeInDown.delay(index * 45).springify()}>
      <AnimatedPressable
        onPress={onPress}
        style={[
          styles.menuItem,
          {
            flexDirection,
            borderBottomColor: theme.borderLight,
            borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          },
        ]}
      >
        <View style={[styles.menuItemLeft, { flexDirection }]}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: iconBgColor,
                ...(isRTL ? { marginLeft: Spacing.md } : { marginRight: Spacing.md }),
              },
            ]}
          >
            <MaterialIcons name={icon} size={20} color={iconColor} />
          </View>
          <Text variant="md" weight="medium">
            {title}
          </Text>
        </View>
        <View style={styles.menuItemRight}>
          {rightElement || (
            <MaterialIcons
              name={isRTL ? 'chevron-left' : 'chevron-right'}
              size={22}
              color={theme.textTertiary}
            />
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Text variant="2xl" weight="bold">
            {t.account.title}
          </Text>
        </View>

        <View style={styles.loginContainer}>
          <Animated.View entering={FadeInDown.springify()} style={styles.guestIconBadge}>
            <Text style={{ fontSize: 52 }}>🌿</Text>
          </Animated.View>

          <Text variant="2xl" weight="bold" style={{ marginBottom: Spacing.xs, textAlign: 'center' }}>
            {language === 'he' ? 'ברוכים הבאים למשק!' : 'Welcome to the Farm!'}
          </Text>
          <Text
            variant="md"
            color={theme.textSecondary}
            style={{ textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl, maxWidth: 300 }}
          >
            {language === 'he'
              ? 'התחבר כדי לצפות בהזמנות הטריות שלך, לשמור מוצרים אהובים ולהנות מהטבות מועדון'
              : 'Sign in to view fresh orders, save your favorite produce, and enjoy farm club perks'}
          </Text>

          <View style={{ width: '100%', gap: Spacing.sm }}>
            <GoogleSignInButton
              onPress={handleGoogleSignIn}
              loading={isGoogleLoading}
            />

            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text variant="sm" color={theme.textTertiary} style={styles.dividerText}>
                {t.auth.orContinueWith}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <Button
              title={t.auth.signIn}
              onPress={() => router.push('/(auth)/login' as any)}
              fullWidth
              size="lg"
            />
            <Button
              title={t.auth.signUp}
              variant="outline"
              onPress={() => router.push('/(auth)/register' as any)}
              fullWidth
              size="lg"
            />
          </View>

          {/* Quick Language Toggle even when logged out */}
          <AnimatedPressable
            onPress={() => handleLanguageChange(language === 'he' ? 'en' : 'he')}
            style={[styles.langTogglePill, { backgroundColor: theme.surfaceElevated, ...Shadows.sm }]}
          >
            <MaterialIcons name="language" size={18} color={theme.primary} />
            <Text variant="sm" weight="medium" color={theme.textSecondary}>
              {language === 'he' ? 'עברית | English' : 'English | עברית'}
            </Text>
          </AnimatedPressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text variant="2xl" weight="bold">
          {t.account.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card — Warm Farm Club Card */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.surfaceElevated,
              ...Shadows.md,
              shadowColor: theme.shadowColor,
              flexDirection,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: theme.primaryLight,
                ...(isRTL ? { marginLeft: Spacing.lg } : { marginRight: Spacing.lg }),
              },
            ]}
          >
            <Text variant="2xl" weight="bold" color={theme.primaryDark}>
              {customer?.full_name?.charAt(0) || (language === 'he' ? 'ח' : 'F')}
            </Text>
            <View style={[styles.avatarBadge, { backgroundColor: theme.primary }]}>
              <MaterialIcons name="eco" size={14} color="#FFFFFF" />
            </View>
          </View>

          <View style={[styles.profileInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <View style={[styles.nameRow, { flexDirection }]}>
              <Text variant="xl" weight="bold">
                {customer?.full_name || (language === 'he' ? 'חבר משק' : 'Farm Member')}
              </Text>
            </View>

            <Text variant="sm" color={theme.textSecondary} style={{ marginTop: 2 }}>
              {session.user.email}
            </Text>

            {customer?.phone && (
              <Text variant="xs" color={theme.textTertiary} style={{ marginTop: 2 }}>
                {customer.phone}
              </Text>
            )}

            <View style={[styles.membershipPill, { backgroundColor: theme.primaryLight }]}>
              <Text variant="xs" weight="bold" color={theme.primaryDark}>
                {language === 'he' ? '🌾 חבר מועדון משק טרי' : '🌾 Fresh Farm Member'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Orders & Shopping Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surfaceElevated,
              ...Shadows.sm,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          {renderMenuItem(
            'receipt-long',
            t.account.orders,
            () => router.push('/orders'),
            null,
            1,
            theme.primaryLight,
            theme.primaryDark
          )}
          {renderMenuItem(
            'favorite-border',
            t.account.favorites,
            () => router.push('/favorites'),
            null,
            2,
            '#FDE8E4', // soft terracotta
            '#C85A32'
          )}
          {renderMenuItem(
            'location-on',
            t.account.addresses,
            () => {},
            null,
            3,
            '#FEF3D6', // warm wheat
            '#A47814'
          )}
          {renderMenuItem(
            'person-outline',
            t.account.profile,
            () => {},
            null,
            4,
            '#E8F5E9',
            theme.primaryDark,
            true
          )}
        </View>

        {/* Preferences Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surfaceElevated,
              ...Shadows.sm,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          {renderMenuItem(
            isDark ? 'dark-mode' : 'light-mode',
            t.account.darkMode,
            toggle,
            <Switch
              value={isDark}
              onValueChange={toggle}
              trackColor={{ true: theme.primary, false: theme.border }}
              thumbColor="#FFFFFF"
            />,
            5,
            isDark ? '#3D3D3D' : '#FFF3D6',
            isDark ? '#F5F0E6' : '#C47B2B'
          )}
          {renderMenuItem(
            'language',
            language === 'he' ? 'שפה / Language' : 'Language / שפה',
            () => handleLanguageChange(language === 'he' ? 'en' : 'he'),
            <View style={[styles.langBadge, { backgroundColor: theme.primaryLight }]}>
              <Text variant="xs" weight="bold" color={theme.primaryDark}>
                {language === 'he' ? 'עברית' : 'English'}
              </Text>
            </View>,
            6,
            '#E0F2FE',
            '#0369A1'
          )}
          {renderMenuItem(
            'help-outline',
            t.account.support,
            () => {},
            null,
            7,
            '#F3E8FF',
            '#7E22CE',
            true
          )}
        </View>

        {/* Admin Dashboard Entry */}
        {isAdmin && (
          <View
            style={[
              styles.section,
              {
                backgroundColor: theme.surfaceElevated,
                ...Shadows.sm,
                shadowColor: theme.shadowColor,
              },
            ]}
          >
            {renderMenuItem(
              'admin-panel-settings',
              t.account.adminPanel,
              () => router.push('/(admin)/dashboard' as any),
              null,
              8,
              '#DCFCE7',
              '#15803D',
              true
            )}
          </View>
        )}

        {/* Logout Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surfaceElevated,
              ...Shadows.sm,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          {renderMenuItem(
            'logout',
            t.account.signOut,
            handleSignOut,
            null,
            9,
            '#FEE2E2',
            '#DC2626',
            true
          )}
        </View>

        {/* App Version & Farm Brand Tag */}
        <View style={styles.footerBrand}>
          <Text variant="xs" color={theme.textTertiary} style={{ textAlign: 'center' }}>
            🌾 {language === 'he' ? 'סופרמרקט המשק — מן השדה לצלחת' : 'Farm Market — Fresh From The Field'}
          </Text>
          <Text variant="xs" color={theme.textTertiary} style={{ textAlign: 'center', marginTop: 4 }}>
            v1.0.0
          </Text>
        </View>
      </ScrollView>
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
  },
  loginContainer: {
    flex: 1,
    padding: Spacing['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestIconBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  langTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xl,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 112,
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    alignItems: 'center',
  },
  membershipPill: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  section: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  menuItemLeft: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemRight: {
    justifyContent: 'center',
  },
  langBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
  },
  footerBrand: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
  },
});
