import AboutContent from "@/components/AboutContent";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
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
  });
}

export default function AboutPage() {
  return <AboutContent />;
}
