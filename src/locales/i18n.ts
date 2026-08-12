import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Minimal translation resources — in a production app, replace with real content.
const resources = {
  en: { translation: {} },
  'zh-Hans': { translation: {} },
  'zh-Hant': { translation: {} },
} as const;

export const defaultNS = 'translation';

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: {
    'zh-TW': ['zh-Hant', 'en'],
    'zh-HK': ['zh-Hant', 'en'],
    zh: ['zh-Hans', 'en'],
    default: ['en'],
  },
  fallbackNS: 'translation',
  ns: ['translation'],
  debug: false,
  defaultNS,
  resources,
  interpolation: { escapeValue: false },
});

export default i18n;