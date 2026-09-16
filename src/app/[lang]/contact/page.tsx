import ContactContent from "@/components/ContactContent";
import JsonLd from "@/components/JsonLd";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { graph, pageNodes, personNode, PERSON_ID } from "@/i18n/structuredData";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({
    lang,
    route: "/contact",
    title: t.meta.contactTitle,
    description: t.meta.contactDescription,
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "it";
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={graph(
          personNode(t, locale),
          ...pageNodes({
            type: "ContactPage",
            lang: locale,
            route: "/contact",
            title: t.meta.contactTitle,
            description: t.meta.contactDescription,
            crumbs: [{ name: t.nav.contact, path: `/${locale}/contact` }],
            extra: { mainEntity: { "@id": PERSON_ID } },
          }),
        )}
      />
      <ContactContent />
    </>
  );
}
