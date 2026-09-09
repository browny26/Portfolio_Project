import { defaultLocale, locales, type Locale } from "./config";

/**
 * Canonical and hreflang links for one page.
 * `route` is the path after the locale segment, e.g. "/projects" ("" for the home page).
 */
export function alternates(lang: Locale, route = "") {
  return {
    canonical: `/${lang}${route}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${route}`])),
      "x-default": `/${defaultLocale}${route}`,
    },
  };
}
