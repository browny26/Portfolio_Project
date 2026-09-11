import ProjectsContent from "@/components/ProjectsContent";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({
    lang,
    route: "/projects",
    title: t.meta.projectsTitle,
    description: t.meta.projectsDescription,
  });
}

export default function ProjectsPage() {
  return <ProjectsContent />;
}
