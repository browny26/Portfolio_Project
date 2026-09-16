import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "./config";
import { owner, siteUrl } from "@/site";

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

/** Facebook's locale format ("it_IT", "en_US"), used by OpenGraph. */
const OG_LOCALE: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
};

/**
 * Full per-page metadata: canonical + hreflang + OpenGraph + Twitter card,
 * generated together so a page only decides its own title and description.
 *
 * OpenGraph and Twitter must be set on every page because Next.js replaces
 * (does not merge) nested metadata fields when a page overrides the layout —
 * so sharing this from one helper is how the two stay in sync per URL.
 */
export function pageMetadata({
  lang,
  route = "",
  title,
  description,
  images,
  kind = { type: "website" },
}: {
  lang: Locale;
  route?: string;
  title: string;
  description: string;
  /**
   * Override images for this page (case studies use their hero). When omitted,
   * the page uses the locale's card from `[lang]/opengraph-image.tsx`: the
   * file convention only attaches it to the home page by itself, because every
   * other page replaces `openGraph` wholesale.
   */
  images?: string[];
  /** What the page is to social previews: a profile, an article or the site. */
  kind?:
    | { type: "website" }
    | { type: "profile" }
    | { type: "article"; tags?: string[] };
}): Metadata {
  const url = new URL(`/${lang}${route}`, siteUrl).toString();
  const ogImages = images
    ? images.map((src) => ({ url: new URL(src, siteUrl).toString(), alt: title }))
    : [
        {
          url: new URL(`/${lang}/opengraph-image`, siteUrl).toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ];

  const shared = {
    title,
    description,
    url,
    siteName: owner.name,
    locale: OG_LOCALE[lang],
    alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
    images: ogImages,
  };
  const aboutUrl = new URL(`/${lang}/about`, siteUrl).toString();

  return {
    title,
    description,
    alternates: alternates(lang, route),
    openGraph:
      kind.type === "profile"
        ? {
            ...shared,
            type: "profile",
            firstName: owner.givenName,
            lastName: owner.familyName,
          }
        : kind.type === "article"
          ? { ...shared, type: "article", authors: [aboutUrl], tags: kind.tags }
          : { ...shared, type: "website" },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}
