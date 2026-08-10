// ============================================================
// Home Screen
// ============================================================

import React, { useMemo, useRef } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { ThemedView } from '@/components/ui/ThemedView';
import { Text } from '@/components/ui/Text';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryChips } from '@/components/home/CategoryChips';
import { ProductGrid } from '@/components/home/ProductGrid';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { BottomSheet } from '@/components/ui/BottomSheet';

import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBanners } from '@/hooks/useBanners';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeStore } from '@/stores/themeStore';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import type { Banner } from '@/types/models';
import type { Language } from '@/stores/languageStore';

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
  
  // Memoize filters for useProducts hook
  const activeFilters = useMemo(() => ({ categoryId }), [categoryId]);
  
  const { 
    data: products, 
    isLoading: productsLoading,
    refetch,
    isRefetching
  } = useProducts(activeFilters);

  const handleBannerPress = (banner: Banner) => {
    if (banner.link_type === 'category' && banner.link_value) {
      // Find category ID by slug if possible, or assume link_value is the ID/slug
      const targetCategory = categories?.find(c => c.slug === banner.link_value);
      if (targetCategory) {
        setCategory(targetCategory.id);
      }
    } else if (banner.link_type === 'product' && banner.link_value) {
       // Search for the product by slug, then navigate
       router.push(`/product/${banner.link_value}`); // We need to handle slug-based routing or map slug to ID
    }
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const openSettings = () => {
    settingsSheetRef.current?.present();
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    if (nextLanguage === language) {
      return;
    }

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar - Fake input that navigates to search screen */}
        <AnimatedPressable 
          style={[styles.searchBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]} 
          onPress={handleSearchPress}
        >
        <MaterialIcons name="search" size={24} color={theme.textTertiary} />
        <Text variant="md" color={theme.textTertiary} style={styles.searchText}>
          {t.home.searchPlaceholder}
        </Text>
      </AnimatedPressable>

      {/* Hero Banner */}
      {!bannersLoading && banners && banners.length > 0 && (
        <HeroBanner banners={banners} onPressBanner={handleBannerPress} />
      )}

      {/* Category Chips */}
      {!categoriesLoading && categories && (
        <View style={styles.categoriesWrapper}>
          <Text variant="xl" weight="semiBold" style={styles.sectionTitle}>
            {t.home.categories}
          </Text>
          <CategoryChips
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategory}
          />
        </View>
      )}

      {/* Title for Product Grid */}
      <View style={styles.gridHeader}>
        <Text variant="xl" weight="semiBold">
          {categoryId ? categories?.find(c => c.id === categoryId)?.name_he : t.home.featuredProducts}
        </Text>
        {categoryId && (
           <AnimatedPressable onPress={() => setCategory(undefined)}>
             <Text variant="sm" weight="medium" color={theme.primary}>
               {t.home.seeAll}
             </Text>
           </AnimatedPressable>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Top Bar Area */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, Spacing.md) }]}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm }}>
          <Image source={require('../../../assets/images/logo.svg')} style={{ width: 40, height: 40 }} contentFit="contain" />
          <View>
            <Text variant="sm" color={theme.textSecondary} style={{ textAlign: 'right' }}>
              {t.home.greeting}
            </Text>
            <Text variant="lg" weight="bold" style={{ textAlign: 'right' }}>
              {customer?.full_name || t.appName}
            </Text>
          </View>
        </View>
        <View style={styles.topBarActions}>
          <AnimatedPressable onPress={openSettings}>
            <View style={[styles.iconButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <MaterialIcons name="settings" size={22} color={theme.text} />
            </View>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => router.push('/account')}>
             <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
               <MaterialIcons name="person" size={24} color={theme.primaryDark} />
             </View>
          </AnimatedPressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ProductGrid
          products={products || []}
          isLoading={productsLoading && !isRefetching}
          header={renderHeader()}
        />
      </View>

      <BottomSheet ref={settingsSheetRef} snapPoints={['42%']} scrollable={false}>
        <View style={styles.sheetContent}>
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

          <View style={[styles.settingsCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <View style={[styles.settingRow, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingText}>
                <Text variant="md" weight="semiBold">{language === 'he' ? 'שפה' : 'Language'}</Text>
                <Text variant="sm" color={theme.textSecondary}>{languageLabel}</Text>
              </View>
              <AnimatedPressable
                onPress={() => handleLanguageChange(language === 'he' ? 'en' : 'he')}
                style={[styles.settingAction, { backgroundColor: theme.primaryLight }]}
              >
                <Text variant="sm" weight="semiBold" color={theme.primaryDark}>
                  {alternateLanguageLabel}
                </Text>
              </AnimatedPressable>
            </View>

            <View style={[styles.settingRow, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingText}>
                <Text variant="md" weight="semiBold">{t.account.darkMode}</Text>
                <Text variant="sm" color={theme.textSecondary}>
                  {isDark
                    ? language === 'he' ? 'ערכת צבעים כהה פעילה' : 'Dark appearance is active'
                    : language === 'he' ? 'ערכת צבעים בהירה פעילה' : 'Light appearance is active'}
                </Text>
              </View>
              <Switch value={isDark} onValueChange={toggle} trackColor={{ true: theme.primary }} />
            </View>

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
              <MaterialIcons name="chevron-left" size={24} color={theme.textTertiary} />
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
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  searchText: {
    marginLeft: Spacing.sm,
    flex: 1,
    textAlign: 'right', // RTL
  },
  categoriesWrapper: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'right', // RTL
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
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingAction: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
});
