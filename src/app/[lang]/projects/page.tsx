import JsonLd from "@/components/JsonLd";
import ProjectsContent from "@/components/ProjectsContent";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import {
  graph,
  pageNodes,
  personRefNode,
  projectNode,
} from "@/i18n/structuredData";
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

export default async function ProjectsPage({
  params,
}: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "it";
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={graph(
          personRefNode(locale),
          ...pageNodes({
            type: "CollectionPage",
            lang: locale,
            route: "/projects",
            title: t.meta.projectsTitle,
            description: t.meta.projectsDescription,
            crumbs: [{ name: t.nav.projects, path: `/${locale}/projects` }],
            extra: {
              mainEntity: {
                "@type": "ItemList",
                itemListElement: t.projects.map((project, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  item: projectNode(t, locale, project),
                })),
              },
            },
          }),
        )}
      />
      <ProjectsContent />
    </>
  );
}
