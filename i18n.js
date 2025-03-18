import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importing the language JSON files
import en from './src/locales/en/translation.json';
import ur from './src/locales/ur/translation.json';

// Initializing i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language in case of missing translations
    interpolation: {
      escapeValue: false, // React already escapes strings to prevent XSS
    },
  });

export default i18n;
