import HomeContent from "@/components/HomeContent";
import { isLocale } from "@/i18n/config";
import { alternates } from "@/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { alternates: alternates(lang) };
}

export default function Home() {
  return <HomeContent />;
}
