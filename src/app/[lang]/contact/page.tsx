import ContactContent from "@/components/ContactContent";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.meta.contactTitle,
    description: t.meta.contactDescription,
    alternates: alternates(lang, "/contact"),
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
