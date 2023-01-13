import { createI18n, FallbackLocale } from "vue-i18n";
import de from "./locales/de.json";
import en from "./locales/en.json";

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
console.log(d ? "" : "Error asserting locale type");
/*
 * Error if:
 * de is missing key
 * de and en have mismatching value
 * */
const e: SimpleEquals<typeof en, typeof de> = en;
console.log(e ? "" : "Error asserting locale type");

export const locales = ["de", "en"] as const;
export type Locale = typeof locales[number];
export function isSupportedLocale(locale: string): asserts locale is Locale {
  if (!locales.includes(locale as Locale)) {
    throw new Error(`Locale '${locale}' is not supported`);
  }
}

const locale: string = process.env.VUE_APP_I18N_LOCALE || "en";
const fallbackLocale: FallbackLocale =
  process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en";

isSupportedLocale(locale);

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
