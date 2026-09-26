// ============================================================
// Login Screen — Farm Member Sign-In
// ============================================================

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { signIn } = useAuth();
  const { t, language } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = language === 'he';
  const textAlign = isRTL ? 'right' : 'left';
  const alignSelf = isRTL ? 'flex-start' : 'flex-end';
  const backButtonPosition = isRTL ? { right: Spacing.lg } : { left: Spacing.lg };
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        t.common.error,
        language === 'he' ? 'אנא הזן אימייל וסיסמה' : 'Please enter email and password'
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)/account');
    } catch (error: any) {
      Alert.alert(
        language === 'he' ? 'שגיאת התחברות' : 'Login Error',
        error.message ||
          (language === 'he' ? 'שם משתמש או סיסמה שגויים' : 'Invalid email or password')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AnimatedPressable
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top + Spacing.sm }, backButtonPosition]}
      >
        <MaterialIcons
          name={isRTL ? 'arrow-forward' : 'arrow-back'}
          size={26}
          color={theme.text}
        />
      </AnimatedPressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 50 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.springify()}>
            {/* Farm Brand Header */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/logo.svg')}
                style={{ width: 110, height: 110 }}
                contentFit="contain"
              />
            </View>

            <Text variant="3xl" weight="bold" style={[styles.title, { textAlign }]}>
              {t.auth.welcomeBack}
            </Text>
            <Text
              variant="md"
              color={theme.textSecondary}
              style={[styles.subtitle, { textAlign }]}
            >
              {language === 'he'
                ? 'התחבר לחשבונך כדי ליהנות מתוצרת חקלאית טרייה'
                : 'Sign in to enjoy farm fresh fruits, vegetables & produce'}
            </Text>

            <View style={styles.form}>
              <Input
                label={t.auth.email}
                placeholder="mail@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                icon="email"
              />
              <Input
                label={t.auth.password}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock"
              />

              <AnimatedPressable style={[styles.forgotPassword, { alignSelf }]}>
                <Text variant="sm" color={theme.primary} weight="semiBold">
                  {t.auth.forgotPassword}
                </Text>
              </AnimatedPressable>

              <Button
                title={t.auth.signIn}
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="lg"
                style={{ marginTop: Spacing.xl }}
                icon="login"
              />
            </View>

            <View style={[styles.footer, { flexDirection: flexDirection as any }]}>
              <Text variant="md" color={theme.textSecondary}>
                {t.auth.noAccount}
              </Text>
              <AnimatedPressable
                onPress={() => router.push('/(auth)/register' as any)}
                style={{ paddingHorizontal: 4 }}
              >
                <Text variant="md" color={theme.primary} weight="bold">
                  {t.auth.signUp}
                </Text>
              </AnimatedPressable>
            </View>
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
  backButton: {
    position: 'absolute',
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  forgotPassword: {
    marginTop: 2,
    paddingVertical: 4,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});
