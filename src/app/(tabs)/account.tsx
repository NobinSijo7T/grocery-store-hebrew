// ============================================================
// Account Screen
// ============================================================

import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

import { BorderRadius, Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';

type Language = 'he' | 'en';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  
  const { session, customer, isAdmin } = useAuthStore();
  const { signOut } = useAuth();
  const { isDark, toggle } = useThemeStore();
  const { t, language, setLanguage } = useTranslation();

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
          }
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
          }
        },
      ]
    );
  };

  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const renderMenuItem = (icon: any, title: string, onPress: () => void, rightElement?: React.ReactNode, index: number = 0) => (
    <Animated.View entering={FadeInUp.delay(index * 50)}>
      <AnimatedPressable
        onPress={onPress}
        style={[styles.menuItem, { borderBottomColor: theme.borderLight, flexDirection }]}
      >
        <View style={[styles.menuItemLeft, { flexDirection }]}>
           <MaterialIcons name={icon} size={24} color={theme.textSecondary} style={isRTL ? { marginLeft: Spacing.md } : { marginRight: Spacing.md }} />
           <Text variant="md" weight="medium">{title}</Text>
        </View>
        <View style={styles.menuItemRight}>
          {rightElement || <MaterialIcons name={isRTL ? "chevron-left" : "chevron-right"} size={24} color={theme.textTertiary} />}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Text variant="2xl" weight="bold">{t.account.title}</Text>
        </View>
        
        <View style={styles.loginContainer}>
          <Image source={require('../../../assets/images/logo.svg')} style={{ width: 80, height: 80, marginBottom: Spacing.lg }} contentFit="contain" />
          <Text variant="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>
            {language === 'he' ? 'התחבר לחשבון שלך' : 'Sign in to your account'}
          </Text>
          <Text variant="md" color={theme.textSecondary} style={{ textAlign: 'center', marginBottom: Spacing.xl }}>
            {language === 'he' 
              ? 'התחבר כדי לצפות בהיסטוריית הזמנות, לשמור כתובות ולהנות ממבצעים אישיים'
              : 'Sign in to view order history, save addresses and enjoy personal offers'}
          </Text>
          
          <Button 
            title={t.auth.signIn} 
            onPress={() => router.push('/(auth)/login' as any)} 
            fullWidth 
            style={{ marginBottom: Spacing.md }}
          />
          <Button 
            title={t.auth.signUp} 
            variant="outline"
            onPress={() => router.push('/(auth)/register' as any)} 
            fullWidth 
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text variant="2xl" weight="bold">{t.account.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <Animated.View entering={FadeInUp} style={[styles.profileCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, flexDirection }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryLight, ...(isRTL ? { marginLeft: Spacing.lg } : { marginRight: Spacing.lg }) }]}>
            <Text variant="2xl" weight="bold" color={theme.primaryDark}>
              {customer?.full_name?.charAt(0) || (language === 'he' ? 'מ' : 'U')}
            </Text>
          </View>
          <View style={[styles.profileInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text variant="xl" weight="bold">{customer?.full_name || (language === 'he' ? 'משתמש' : 'User')}</Text>
            <Text variant="md" color={theme.textSecondary}>{session.user.email}</Text>
            {customer?.phone && (
              <Text variant="md" color={theme.textSecondary}>{customer.phone}</Text>
            )}
          </View>
        </Animated.View>

        {/* Menu Sections */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {renderMenuItem('person-outline', t.account.profile, () => {}, null, 1)}
          {renderMenuItem('location-on', t.account.addresses, () => {}, null, 2)}
          {renderMenuItem('favorite-border', t.account.favorites, () => router.push('/favorites'), null, 3)}
          {renderMenuItem('receipt-long', t.account.orders, () => router.push('/orders'), null, 4)}
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {renderMenuItem(
            isDark ? 'dark-mode' : 'light-mode', 
            t.account.darkMode, 
            toggle, 
            <Switch value={isDark} onValueChange={toggle} trackColor={{ true: theme.primary }} />, 
            5
          )}
          {renderMenuItem(
            'language', 
            language === 'he' ? 'שפה / Language' : 'Language / שפה',
            () => handleLanguageChange(language === 'he' ? 'en' : 'he'), 
            <Text variant="sm" color={theme.textSecondary}>{language === 'he' ? 'עברית' : 'English'}</Text>, 
            6
          )}
          {renderMenuItem('help-outline', t.account.support, () => {}, null, 7)}
        </View>

        {isAdmin && (
          <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {renderMenuItem('admin-panel-settings', t.account.adminPanel, () => router.push('/(admin)/dashboard' as any), null, 8)}
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {renderMenuItem('logout', t.account.signOut, handleSignOut, null, 9)}
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 112, // Tab bar height + bottom margin + spacing
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemLeft: {
    alignItems: 'center',
  },
  menuItemRight: {
    justifyContent: 'center',
  },
});
