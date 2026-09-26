// ============================================================
// Register Screen — Farm Member Registration
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

import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { signUp } = useAuth();
  const { t, language } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = language === 'he';
  const textAlign = isRTL ? 'right' : 'left';
  const backButtonPosition = isRTL ? { right: Spacing.lg } : { left: Spacing.lg };
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert(
        t.common.error,
        language === 'he'
          ? 'אנא מלא את שדות החובה: שם, אימייל וסיסמה'
          : 'Please fill required fields: name, email and password'
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsLoading(true);
    try {
      await signUp(email, password, fullName, phone);
      Alert.alert(
        language === 'he' ? 'ברוכים הבאים למשק!' : 'Welcome to the Farm!',
        language === 'he'
          ? 'ההרשמה הושלמה בהצלחה. כעת תוכל ליהנות מתוצרת טרייה!'
          : 'Registration completed successfully. Enjoy fresh organic produce!'
      );
      router.replace('/(tabs)/account');
    } catch (error: any) {
      Alert.alert(
        language === 'he' ? 'שגיאת הרשמה' : 'Registration Error',
        error.message ||
          (language === 'he' ? 'התרחשה שגיאה בהרשמה.' : 'An error occurred during registration.')
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 50 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.springify()}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/logo.svg')}
                style={{ width: 100, height: 100 }}
                contentFit="contain"
              />
            </View>

            <Text variant="3xl" weight="bold" style={[styles.title, { textAlign }]}>
              {t.auth.welcome}
            </Text>
            <Text
              variant="md"
              color={theme.textSecondary}
              style={[styles.subtitle, { textAlign }]}
            >
              {language === 'he'
                ? 'הצטרפו למועדון הלקוחות של המשק לקבלת משלוחים טריים'
                : 'Join the farm club for direct-to-door fresh deliveries'}
            </Text>

            <View style={styles.form}>
              <Input
                label={t.auth.fullName}
                placeholder={language === 'he' ? 'ישראל ישראלי' : 'John Doe'}
                value={fullName}
                onChangeText={setFullName}
                icon="person"
              />
              <Input
                label={t.auth.phone}
                placeholder={language === 'he' ? '050-1234567' : '+972-50-1234567'}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                icon="phone"
              />
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

              <Button
                title={t.auth.signUp}
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                size="lg"
                style={{ marginTop: Spacing.lg }}
                icon="eco"
              />
            </View>

            <View style={[styles.footer, { flexDirection: flexDirection as any }]}>
              <Text variant="md" color={theme.textSecondary}>
                {t.auth.hasAccount}
              </Text>
              <AnimatedPressable
                onPress={() => router.push('/(auth)/login' as any)}
                style={{ paddingHorizontal: 4 }}
              >
                <Text variant="md" color={theme.primary} weight="bold">
                  {t.auth.signIn}
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
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});
