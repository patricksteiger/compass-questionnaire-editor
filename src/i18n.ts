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

export const locales = ["de", "en"] as const;
export type Locale = typeof locales[number];
// TODO: Check for correct locale using i18n
export function isSuppportedLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
export function assertSupportedLocale(
  locale: string,
): asserts locale is Locale {
  if (!isSuppportedLocale(locale)) {
    throw new Error(`Locale '${locale}' is not supported!`);
  }
}
export function getLocaleFromLanguage(language: Language): Locale {
  return isSuppportedLocale(language) ? language : "en";
}

// TODO: Are Locales always strings?
const locale: string = process.env.VUE_APP_I18N_LOCALE || "en";
const fallbackLocale: string = process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en";

assertSupportedLocale(locale);
export const usedLocale: Locale = locale;
assertSupportedLocale(fallbackLocale);
export const usedFallbackLocale: Locale = fallbackLocale;

export const i18n = createI18n({
  legacy: false,
  locale: usedLocale,
  fallbackLocale: fallbackLocale,
  globalInjection: true,
  messages: {
    de: de,
    en: en,
  },
});
