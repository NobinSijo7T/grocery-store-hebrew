// ============================================================
// Account Screen
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';

import { HE } from '@/constants/hebrew';
import { Spacing, BorderRadius } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Image } from 'expo-image';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  
  const { session, customer, isAdmin } = useAuthStore();
  const { signOut } = useAuth();
  const { isDark, toggle } = useThemeStore();

  const handleSignOut = () => {
    Alert.alert(
      'התנתקות',
      HE.account.signOutConfirm,
      [
        { text: HE.common.cancel, style: 'cancel' },
        { 
          text: HE.common.yes, 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  const renderMenuItem = (icon: any, title: string, onPress: () => void, rightElement?: React.ReactNode, index: number = 0) => (
    <Animated.View entering={FadeInUp.delay(index * 50)}>
      <AnimatedPressable
        onPress={onPress}
        style={[styles.menuItem, { borderBottomColor: theme.borderLight }]}
      >
        <View style={styles.menuItemLeft}>
           <MaterialIcons name={icon} size={24} color={theme.textSecondary} style={{ marginLeft: Spacing.md }} />
           <Text variant="md" weight="medium">{title}</Text>
        </View>
        <View style={styles.menuItemRight}>
          {rightElement || <MaterialIcons name="chevron-left" size={24} color={theme.textTertiary} />}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Text variant="2xl" weight="bold">{HE.account.title}</Text>
        </View>
        
        <View style={styles.loginContainer}>
          <Image source={require('../../../assets/images/logo.svg')} style={{ width: 80, height: 80, marginBottom: Spacing.lg }} contentFit="contain" />
          <Text variant="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>
            התחבר לחשבון שלך
          </Text>
          <Text variant="md" color={theme.textSecondary} style={{ textAlign: 'center', marginBottom: Spacing.xl }}>
            התחבר כדי לצפות בהיסטוריית הזמנות, לשמור כתובות ולהנות ממבצעים אישיים
          </Text>
          
          <Button 
            title={HE.auth.signIn} 
            onPress={() => router.push('/(auth)/login' as any)} 
            fullWidth 
            style={{ marginBottom: Spacing.md }}
          />
          <Button 
            title={HE.auth.signUp} 
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
        <Text variant="2xl" weight="bold">{HE.account.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <Animated.View entering={FadeInUp} style={[styles.profileCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
            <Text variant="2xl" weight="bold" color={theme.primaryDark}>
              {customer?.full_name?.charAt(0) || 'מ'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text variant="xl" weight="bold">{customer?.full_name || 'משתמש'}</Text>
            <Text variant="md" color={theme.textSecondary}>{session.user.email}</Text>
            {customer?.phone && (
              <Text variant="md" color={theme.textSecondary}>{customer.phone}</Text>
            )}
          </View>
        </Animated.View>

        {/* Menu Sections */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {renderMenuItem('person-outline', HE.account.profile, () => {}, null, 1)}
          {renderMenuItem('location-on', HE.account.addresses, () => {}, null, 2)}
          {renderMenuItem('favorite-border', HE.account.favorites, () => router.push('/favorites'), null, 3)}
          {renderMenuItem('receipt-long', HE.account.orders, () => router.push('/orders'), null, 4)}
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {renderMenuItem(
            isDark ? 'dark-mode' : 'light-mode', 
            HE.account.darkMode, 
            toggle, 
            <Switch value={isDark} onValueChange={toggle} trackColor={{ true: theme.primary }} />, 
            5
          )}
          {renderMenuItem('help-outline', HE.account.support, () => {}, null, 6)}
        </View>

        {isAdmin && (
          <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {renderMenuItem('admin-panel-settings', HE.account.adminPanel, () => router.push('/(admin)/dashboard' as any), null, 7)}
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {renderMenuItem('logout', HE.account.signOut, handleSignOut, null, 8)}
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
    padding: Spacing.2xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row-reverse', // RTL
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
    marginLeft: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
    alignItems: 'flex-start', // Will be right-aligned due to row-reverse
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  menuItemRight: {
    justifyContent: 'center',
  },
});
