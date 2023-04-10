import { createI18n } from "vue-i18n";
import de from "./locales/de.json";
import en from "./locales/en.json";
import { Language } from "./store";

type SimpleEquals<T extends object, O extends object> = {
  [TKey in keyof T]: TKey extends keyof O
    ? O[TKey] extends object
      ? T[TKey] extends object
        ? SimpleEquals<O[TKey], T[TKey]>
        : never
      : O[TKey] extends T[TKey]
      ? O[TKey]
      : never
    : never;
};

/*
 * Error if:
 * en is missing key
 * de and en have mismatching value
 * */
const d: SimpleEquals<typeof de, typeof en> = de;
/*
 * Error if:
 * de is missing key
 * de and en have mismatching value
 * */
const e: SimpleEquals<typeof en, typeof de> = en;

export type Locale = "de" | "en";

const locale = process.env.VUE_APP_I18N_LOCALE || "en";
const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en";

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

export const defaultLanguage: Language = "en";

export function getLocaleFromLanguage(language: Language): Locale {
  return i18n.global.te(language as string) ? (language as Locale) : "en";
}
