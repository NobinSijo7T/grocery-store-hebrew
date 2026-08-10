// ============================================================
// Language Store
// ============================================================
// Manages app language (Hebrew/English) and RTL/LTR direction.

import { EN } from '@/constants/english';
import { HE } from '@/constants/hebrew';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Language = 'he' | 'en';
export type Translations = typeof HE;

interface LanguageState {
  language: Language;
  translations: Translations;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'he',
      translations: HE,
      isRTL: true,

      setLanguage: (lang: Language) => {
        const translations = lang === 'he' ? HE : EN;
        const isRTL = lang === 'he';

        // Update I18nManager if RTL setting changed
        if (isRTL !== I18nManager.isRTL) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          // Note: Changing RTL requires app restart to take full effect
        }

        set({ language: lang, translations, isRTL });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
