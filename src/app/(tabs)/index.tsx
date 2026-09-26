// ============================================================
// Home Screen — Farm Market Storefront
// ============================================================
// Warm cream header, organic search bar, farm brand identity,
// rich hero banners, emoji category chips, staggered product grid.

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChips } from '@/components/home/CategoryChips';
import { HeroBanner } from '@/components/home/HeroBanner';
import { ProductGrid } from '@/components/home/ProductGrid';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Text } from '@/components/ui/Text';
import { ThemedView } from '@/components/ui/ThemedView';

import { useBanners } from '@/hooks/useBanners';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';
import { useThemeStore } from '@/stores/themeStore';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import type { Language } from '@/stores/languageStore';
import type { Banner } from '@/types/models';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const settingsSheetRef = useRef<BottomSheetModal>(null);
  const { isDark, toggle } = useThemeStore();
  const { t, language, setLanguage } = useTranslation();

  const customer = useAuthStore((s) => s.customer);
  const { categoryId, setCategory } = useFilterStore();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: banners, isLoading: bannersLoading } = useBanners();

  const activeFilters = useMemo(() => ({ categoryId }), [categoryId]);

  const {
    data: products,
    isLoading: productsLoading,
    refetch,
    isRefetching
  } = useProducts(activeFilters);

  const handleBannerPress = (banner: Banner) => {
    if (banner.link_type === 'category' && banner.link_value) {
      const targetCategory = categories?.find(c => c.slug === banner.link_value);
      if (targetCategory) {
        setCategory(targetCategory.id);
      }
    } else if (banner.link_type === 'product' && banner.link_value) {
      router.push(`/product/${banner.link_value}`);
    }
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const openSettings = () => {
    settingsSheetRef.current?.present();
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    if (nextLanguage === language) return;

    Alert.alert(
      language === 'he' ? 'שינוי שפה' : 'Change Language',
      language === 'he'
        ? 'שינוי השפה ידרוש הפעלה מחדש של האפליקציה. האם להמשיך?'
        : 'Changing language requires app restart. Continue?',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: language === 'he' ? 'המשך' : 'Continue',
          onPress: () => {
            setLanguage(nextLanguage);
            settingsSheetRef.current?.dismiss();
            Alert.alert(
              nextLanguage === 'he' ? 'הפעל מחדש' : 'Restart Required',
              nextLanguage === 'he'
                ? 'אנא סגור והפעל מחדש את האפליקציה כדי להחיל את השינוי'
                : 'Please close and restart the app to apply the change'
            );
          },
        },
      ]
    );
  };

  const languageLabel = language === 'he' ? 'עברית' : 'English';
  const alternateLanguageLabel = language === 'he' ? 'English' : 'עברית';

  const selectedCategoryName = categoryId
    ? (language === 'he'
      ? categories?.find(c => c.id === categoryId)?.name_he
      : categories?.find(c => c.id === categoryId)?.name_en)
    : t.home.featuredProducts;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <Animated.View entering={FadeInDown.delay(50).springify().damping(18).stiffness(80)}>
        <AnimatedPressable
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
            },
          ]}
          onPress={handleSearchPress}
          scaleDown={0.98}
          haptic
        >
          <MaterialIcons name="search" size={22} color={theme.textTertiary} />
          <Text variant="md" color={theme.textTertiary} style={styles.searchText}>
            {t.home.searchPlaceholder}
          </Text>
          {/* Decorative leaf icon on the right end */}
          <Text style={styles.searchLeaf}>🌿</Text>
        </AnimatedPressable>
      </Animated.View>

      {/* Hero Banner */}
      {!bannersLoading && banners && banners.length > 0 && (
        <Animated.View entering={FadeInDown.delay(100).springify().damping(18).stiffness(70)}>
          <HeroBanner banners={banners} onPressBanner={handleBannerPress} />
        </Animated.View>
      )}

      {/* Category Section */}
      {!categoriesLoading && categories && (
        <Animated.View
          entering={FadeInDown.delay(150).springify().damping(18).stiffness(80)}
          style={styles.categoriesWrapper}
        >
          <Text 
            variant="lg" 
            weight="semiBold" 
            style={[styles.sectionTitle, { textAlign: language === 'he' ? 'right' : 'left' }]}
          >
            {language === 'he' ? 'קטגוריות' : 'Categories'}
          </Text>
          <CategoryChips
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategory}
          />
        </Animated.View>
      )}

      {/* Products section header */}
      <Animated.View
        entering={FadeInDown.delay(200).springify().damping(18).stiffness(80)}
        style={styles.gridHeader}
      >
        <Text variant="lg" weight="semiBold">
          {selectedCategoryName}
        </Text>
        {categoryId && (
          <AnimatedPressable onPress={() => setCategory(undefined)}>
            <Text variant="sm" weight="semiBold" color={theme.primary}>
              {t.home.seeAll}
            </Text>
          </AnimatedPressable>
        )}
      </Animated.View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Top Bar */}
      <Animated.View
        entering={FadeInDown.springify().damping(20).stiffness(80)}
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top, Spacing.md),
            borderBottomColor: theme.border,
          },
        ]}
      >
        {/* Logo */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
          <Image
            source={require('../../../assets/images/logo.svg')}
            style={{ width: 140, height: 46 }}
            contentFit="contain"
          />
        </View>

        {/* Right-side actions */}
        <View style={styles.topBarActions}>
          {/* Settings */}
          <AnimatedPressable onPress={openSettings} scaleDown={0.92} haptic>
            <View
              style={[
                styles.iconButton,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                },
              ]}
            >
              <MaterialIcons name="tune" size={20} color={theme.text} />
            </View>
          </AnimatedPressable>

          {/* Avatar */}
          <AnimatedPressable
            onPress={() => router.push('/account')}
            scaleDown={0.92}
            haptic
          >
            <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
              <MaterialIcons name="person" size={22} color={theme.primary} />
            </View>
          </AnimatedPressable>
        </View>
      </Animated.View>

      {/* Product Grid */}
      <View style={{ flex: 1 }}>
        <ProductGrid
          products={products || []}
          isLoading={productsLoading}
          header={renderHeader()}
        />
      </View>

      {/* Settings Bottom Sheet */}
      <BottomSheet ref={settingsSheetRef} snapPoints={['44%']} scrollable={false}>
        <View style={styles.sheetContent}>
          {/* Sheet handle area title */}
          <View style={styles.sheetHeader}>
            <Text variant="xl" weight="bold">
              {t.account.settings}
            </Text>
            <Text variant="sm" color={theme.textSecondary} style={styles.sheetSubtitle}>
              {language === 'he'
                ? 'גישה מהירה לשפה, תצוגה והחשבון שלך'
                : 'Quick access to language, appearance and your account'}
            </Text>
          </View>

          {/* Settings Card */}
          <View
            style={[
              styles.settingsCard,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
              },
            ]}
          >
            {/* Language */}
            <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
              <View style={styles.settingText}>
                <Text variant="md" weight="semiBold">
                  {language === 'he' ? 'שפה' : 'Language'}
                </Text>
                <Text variant="sm" color={theme.textSecondary}>
                  {languageLabel}
                </Text>
              </View>
              <AnimatedPressable
                onPress={() => handleLanguageChange(language === 'he' ? 'en' : 'he')}
                style={[
                  styles.settingAction,
                  { backgroundColor: theme.primaryLight },
                ]}
              >
                <Text variant="sm" weight="semiBold" color={theme.primary}>
                  {alternateLanguageLabel}
                </Text>
              </AnimatedPressable>
            </View>

            {/* Dark Mode */}
            <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
              <View style={styles.settingText}>
                <Text variant="md" weight="semiBold">
                  {t.account.darkMode}
                </Text>
                <Text variant="sm" color={theme.textSecondary}>
                  {isDark
                    ? language === 'he' ? 'מצב לילה פעיל' : 'Night mode active'
                    : language === 'he' ? 'מצב יום פעיל' : 'Day mode active'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggle}
                trackColor={{ true: theme.primary, false: theme.border }}
                thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            {/* More settings */}
            <AnimatedPressable
              onPress={() => {
                settingsSheetRef.current?.dismiss();
                router.push('/account');
              }}
              style={styles.settingRow}
            >
              <View style={styles.settingText}>
                <Text variant="md" weight="semiBold">
                  {language === 'he' ? 'הגדרות נוספות' : 'More settings'}
                </Text>
                <Text variant="sm" color={theme.textSecondary}>
                  {language === 'he'
                    ? 'פרופיל, כתובות, הזמנות ותמיכה'
                    : 'Profile, addresses, orders and support'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textTertiary} />
            </AnimatedPressable>
          </View>
        </View>
      </BottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0, // No divider — let the cream flow
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerContainer: {
    paddingBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 50,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  searchText: {
    flex: 1,
    textAlign: 'right', // RTL
  },
  searchLeaf: {
    fontSize: 16,
    opacity: 0.6,
  },
  categoriesWrapper: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sheetContent: {
    gap: Spacing.lg,
  },
  sheetHeader: {
    alignItems: 'flex-start',
  },
  sheetSubtitle: {
    marginTop: Spacing.xs,
  },
  settingsCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingText: {
    flex: 1,
    marginEnd: Spacing.md,
  },
  settingAction: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
});
