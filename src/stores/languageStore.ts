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
export type Translations = typeof HE | typeof EN;

interface LanguageState {
  language: Language;
  translations: Translations;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      translations: EN,
      isRTL: false,

      setLanguage: (lang: Language) => {
        const translations = lang === 'he' ? HE : EN;
        const isRTL = lang === 'he';
        set({ language: lang, translations, isRTL });
      },
    }),
    {
      name: 'language-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
