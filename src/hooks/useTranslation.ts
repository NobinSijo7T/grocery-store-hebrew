// ============================================================
// useTranslation Hook
// ============================================================
// Provides access to translations and language settings.

import { useLanguageStore } from '@/stores/languageStore';

export function useTranslation() {
  const { translations, language, isRTL, setLanguage } = useLanguageStore();

  return {
    t: translations,
    language,
    isRTL,
    setLanguage,
  };
}
