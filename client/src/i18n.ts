import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ml"],

    // Define namespaces
    // 'common' usually holds global UI like Nav, Footer, Buttons
    // 'notifications' holds page-specific text
    ns: [
      "common",
      "notifications",
      "aboutus",
      "contact",
      "vision",
      "events",
      "home",
      "gallery",
    ],
    defaultNS: "common",

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    debug: false,
  });

export default i18n;
