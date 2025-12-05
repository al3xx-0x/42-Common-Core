// src/i18n.ts
import i18n from "i18next";
import { Translation, initReactI18next } from "react-i18next";
import en from "public/locales/en/translation.json";
import am from "public/locales/am/translation.json";
import ar from "public/locales/ar/translation.json";
import es from "public/locales/es/translation.json";
import fr from "public/locales/fr/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      am: { translation: am },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("language") || "en"
        : "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
