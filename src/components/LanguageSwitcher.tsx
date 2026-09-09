"use client";

import { localeNames, locales } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Swaps the locale segment of the current path, keeping the reader on the same page. */
function swapLocale(pathname: string, locale: string) {
  const segments = pathname.split("/");
  // segments[0] is the empty string before the leading slash.
  segments[1] = locale;
  return segments.join("/");
}

export default function LanguageSwitcher({
  color,
  dim,
}: {
  /** Colour of the active locale. */
  color: string;
  /** Colour of the inactive one. */
  dim: string;
}) {
  const { lang, t } = useI18n();
  const pathname = usePathname();

  return (
    <div
      className="flex items-center gap-1"
      aria-label={t.header.switchLanguage}
    >
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="label" style={{ color: dim }}>
              /
            </span>
          )}
          <Link
            href={swapLocale(pathname, locale)}
            hrefLang={locale}
            aria-current={locale === lang ? "true" : undefined}
            className="label transition-colors duration-200"
            style={{
              color: locale === lang ? color : dim,
              textDecoration: "none",
            }}
          >
            {localeNames[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}
