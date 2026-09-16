import HomeContent from "@/components/HomeContent";
import JsonLd from "@/components/JsonLd";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import {
  graph,
  pageNodes,
  personNode,
  PERSON_ID,
  websiteNode,
} from "@/i18n/structuredData";
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

  return (
    <>
      <JsonLd
        data={graph(
          websiteNode(t, locale),
          personNode(t, locale),
          ...pageNodes({
            type: "WebPage",
            lang: locale,
            route: "",
            title: t.meta.title,
            description: t.meta.description,
            crumbs: [],
            extra: { about: { "@id": PERSON_ID } },
          }),
        )}
      />
      <HomeContent />
    </>
  );
}
