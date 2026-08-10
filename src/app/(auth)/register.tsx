// ============================================================
// Register Screen
// ============================================================

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { HE } from '@/constants/hebrew';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { signUp } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('שגיאה', 'אנא מלא את שדות החובה: שם, אימייל וסיסמה');
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password, fullName, phone);
      Alert.alert('הצלחה!', 'ההרשמה בוצעה בהצלחה.');
      router.replace('/(tabs)/account');
    } catch (error: any) {
      Alert.alert('שגיאת הרשמה', error.message || 'התרחשה שגיאה בהרשמה.');
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
              {HE.auth.welcome}
            </Text>
            <Text variant="lg" color={theme.textSecondary} style={styles.subtitle}>
              צור חשבון כדי להתחיל לקנות
            </Text>
            
            <View style={styles.form}>
              <Input
                label={HE.auth.fullName}
                placeholder="ישראל ישראלי"
                value={fullName}
                onChangeText={setFullName}
                icon="person"
              />
              <Input
                label={HE.auth.phone}
                placeholder="05X-XXXXXXX"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                icon="phone"
              />
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
              
              <Button
                title={HE.auth.signUp}
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                style={{ marginTop: Spacing.xl }}
              />
            </View>

            <View style={styles.footer}>
               <Text variant="md" color={theme.textSecondary}>{HE.auth.hasAccount}</Text>
               <AnimatedPressable onPress={() => router.push('/(auth)/login' as any)}>
                  <Text variant="md" color={theme.primary} weight="bold" style={{ marginLeft: Spacing.xs }}>
                    {HE.auth.signIn}
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
    padding: Spacing['2xl'],
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'right',
  },
  subtitle: {
    marginBottom: Spacing['2xl'],
    textAlign: 'right',
  },
  form: {
    marginBottom: Spacing['2xl'],
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
