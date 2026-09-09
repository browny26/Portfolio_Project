import ProjectsContent from "@/components/ProjectsContent";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.meta.projectsTitle,
    description: t.meta.projectsDescription,
    alternates: alternates(lang, "/projects"),
  };
}

export default function ProjectsPage() {
  return <ProjectsContent />;
}
