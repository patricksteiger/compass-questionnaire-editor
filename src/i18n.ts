// import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
//import * as VueI18n from "vue-i18n";
import { createI18n, FallbackLocale } from "vue-i18n";
import { en } from "./locales";
/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
/*function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i,
  );
  const messages: any = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}*/

const locale: string = process.env.VUE_APP_I18N_LOCALE || "en";
const fallbackLocale: FallbackLocale =
  process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en";

export const i18n = createI18n({
  legacy: false,
  locale: locale,
  fallbackLocale: fallbackLocale,
  globalInjection: true,
  messages: {
    en: en,
  },
});
