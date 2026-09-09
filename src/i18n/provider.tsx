"use client";

import { createContext, useContext, type ReactNode } from "react";
import { localePath, type Locale } from "./config";
import type { Dictionary } from "./types";

type I18nValue = {
  lang: Locale;
  t: Dictionary;
  /** Prefixes an app-relative path with the active locale. */
  href: (path: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const value: I18nValue = {
    lang,
    t: dictionary,
    href: (path) => localePath(lang, path),
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
