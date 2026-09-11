/**
 * Locale configuration, shared by the proxy, the server and the client.
 * Keep this module free of server-only imports: `proxy.ts` loads it too.
 */

export const locales = ["it", "en"] as const;

export type Locale = (typeof locales)[number];

/** Shown to anyone whose browser does not ask for a language we support. */
export const defaultLocale: Locale = "it";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefixes an app-relative path with the active locale: "/projects" -> "/it/projects". */
export function localePath(locale: Locale, path: string): string {
  if (path === "/") return `/${locale}`;
  // Hash-only links ("/#services") keep their fragment after the prefix.
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The label shown in the language switcher for each locale. */
export const localeNames: Record<Locale, string> = {
  it: "IT",
  en: "EN",
};

/**
 * The greeting each locale opens with. The intro alternates between them —
 * the visitor's own language first — so the site says hello in both languages
 * it speaks before the home page appears.
 */
export const greetings: Record<Locale, string> = {
  it: "Ciao",
  en: "Hello",
};
