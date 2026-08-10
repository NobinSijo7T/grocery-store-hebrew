// ============================================================
// Login Screen
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/hooks/useAuth';
import { HE } from '@/constants/hebrew';
import { Spacing, BorderRadius } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('שגיאה', 'אנא הזן אימייל וסיסמה');
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)/account');
    } catch (error: any) {
      Alert.alert('שגיאת התחברות', error.message || 'שם משתמש או סיסמה שגויים');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AnimatedPressable 
        onPress={() => router.back()} 
        style={[styles.backButton, { top: insets.top + Spacing.sm }]}
      >
        <MaterialIcons name="arrow-forward" size={28} color={theme.text} />
      </AnimatedPressable>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 80 }]}>
          
          <Animated.View entering={FadeInDown.springify()}>
            <Image source={require('../../../assets/images/logo.svg')} style={{ width: 80, height: 80, alignSelf: 'center', marginBottom: Spacing.xl }} contentFit="contain" />
            <Text variant="4xl" weight="bold" style={styles.title}>
              {HE.auth.welcomeBack}
            </Text>
            <Text variant="lg" color={theme.textSecondary} style={styles.subtitle}>
              התחבר לחשבונך כדי להמשיך
            </Text>
            
            <View style={styles.form}>
              <Input
                label={HE.auth.email}
                placeholder="mail@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                icon="email"
              />
              <Input
                label={HE.auth.password}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock"
              />
              
              <AnimatedPressable style={styles.forgotPassword}>
                 <Text variant="md" color={theme.primary} weight="medium">
                   {HE.auth.forgotPassword}
                 </Text>
              </AnimatedPressable>

              <Button
                title={HE.auth.signIn}
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                style={{ marginTop: Spacing.xl }}
              />
            </View>

            <View style={styles.footer}>
               <Text variant="md" color={theme.textSecondary}>{HE.auth.noAccount}</Text>
               <AnimatedPressable onPress={() => router.push('/(auth)/register' as any)}>
                  <Text variant="md" color={theme.primary} weight="bold" style={{ marginLeft: Spacing.xs }}>
                    {HE.auth.signUp}
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
    right: Spacing.lg, // RTL
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Spacing.2xl,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'right',
  },
  subtitle: {
    marginBottom: Spacing.2xl,
    textAlign: 'right',
  },
  form: {
    marginBottom: Spacing.2xl,
  },
  forgotPassword: {
    alignSelf: 'flex-start', // RTL left
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
