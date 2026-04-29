import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpApi) // Enables loading translation files over HTTP.
  .use(LanguageDetector) // Detects user language.
  .use(initReactI18next) // Initializes the react-i18next plugin.
  .init({
    supportedLngs: ['en', 'hn'], // Languages we're supporting.
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'], // Order of language detection.
      caches: ['cookie'] // Cache the detected language in cookies.
    },
    backend: {
      loadPath: '/locales/{{lng}}.json' // Path to the translation files.
    },
    fallbackLng: 'en' // Fallback language if user's language isn't supported.
  });

export default i18n;
