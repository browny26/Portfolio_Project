import type { Locale } from "./config";
import type { Dictionary } from "./types";

/**
 * Dictionaries are loaded lazily and only on the server: the active locale is
 * serialised into the RSC payload by `I18nProvider`, so the unused language
 * never reaches the browser.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("./dictionaries/it").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
