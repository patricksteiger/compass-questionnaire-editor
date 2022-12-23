import { createI18n, FallbackLocale } from "vue-i18n";
import de from "./locales/de.json";
import en from "./locales/en.json";

const locale: string = process.env.VUE_APP_I18N_LOCALE || "en";
const fallbackLocale: FallbackLocale =
  process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en";

export const i18n = createI18n({
  legacy: false,
  locale: locale,
  fallbackLocale: fallbackLocale,
  globalInjection: true,
  messages: {
    de: de,
    en: en,
  },
});
