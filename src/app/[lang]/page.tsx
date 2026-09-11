import HomeContent from "@/components/HomeContent";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { siteUrl } from "@/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({
    lang,
    title: t.meta.title,
    description: t.meta.description,
  });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "it";
  const t = await getDictionary(locale);

  // Person schema. Google's Knowledge Graph and rich results treat this as the
  // authoritative link between name, role, location and external profiles —
  // one place, so it stays consistent across pages instead of duplicated.
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Luisa Cerin Ogbeiwi",
    url: new URL(`/${locale}`, siteUrl).toString(),
    jobTitle: `${t.hero.line1} ${t.hero.line2}`,
    description: t.meta.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gallarate",
      addressRegion: "Lombardia",
      addressCountry: "IT",
    },
    sameAs: [
      "https://github.com/browny26",
      "https://linkedin.com/in/luisa-cerin",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw JSON in a <script> tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <HomeContent />
    </>
  );
}
