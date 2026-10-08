import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteUrl } from "@/site";

/**
 * Static routes rendered under every locale. Slug-driven routes (case studies)
 * are added below by reading the dictionaries — the same source of truth the
 * page uses, so a new case study appears in the sitemap the moment it appears
 * in `projects`.
 */
const STATIC_ROUTES = ["", "/projects", "/about", "/contact"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const abs = (path: string) => new URL(path, siteUrl).toString();

  // hreflang alternates: every entry declares the other locales so Google can
  // group translations of the same page instead of picking one arbitrarily.
  // x-default matches the hreflang links the pages themselves declare.
  const languagesFor = (route: string) => ({
    ...Object.fromEntries(locales.map((l) => [l, abs(`/${l}${route}`)])),
    "x-default": abs(`/${defaultLocale}${route}`),
  });

  // The site is statically built, so its content changes only on deploy.
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    STATIC_ROUTES.map((route) => ({
      url: abs(`/${lang}${route}`),
      lastModified,
      alternates: { languages: languagesFor(route) },
    })),
  );

  const caseStudyEntries: MetadataRoute.Sitemap = (
    await Promise.all(
      locales.map(async (lang) => {
        const dict = await getDictionary(lang);
        return dict.projects
          .filter((p) => p.caseStudy)
          .map((p) => ({
            url: abs(`/${lang}/projects/${p.slug}`),
            lastModified,
            alternates: { languages: languagesFor(`/projects/${p.slug}`) },
          }));
      }),
    )
  ).flat();

  return [...staticEntries, ...caseStudyEntries];
}
