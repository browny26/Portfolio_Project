import AboutContent from "@/components/AboutContent";
import JsonLd from "@/components/JsonLd";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { graph, pageNodes, personNode, PERSON_ID } from "@/i18n/structuredData";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({
    lang,
    route: "/about",
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
    kind: { type: "profile" },
  });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "it";
  const t = await getDictionary(locale);

  return (
    <>
      {/* ProfilePage: the page Google and AI assistants should treat as the
          authoritative description of the person. */}
      <JsonLd
        data={graph(
          personNode(t, locale),
          ...pageNodes({
            type: "ProfilePage",
            lang: locale,
            route: "/about",
            title: t.meta.aboutTitle,
            description: t.meta.aboutDescription,
            crumbs: [{ name: t.nav.about, path: `/${locale}/about` }],
            extra: { mainEntity: { "@id": PERSON_ID } },
          }),
        )}
      />
      <AboutContent />
    </>
  );
}
