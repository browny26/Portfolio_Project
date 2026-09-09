import CaseStudy from "@/components/CaseStudy";
import NotFoundContent from "@/components/NotFoundContent";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/metadata";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

async function caseStudiesFor(lang: Locale) {
  const t = await getDictionary(lang);
  return t.projects.filter((p) => p.caseStudy);
}

// Generated bottom-up: this page owns both [lang] and [slug].
export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (lang) => {
      const studies = await caseStudiesFor(lang);
      return studies.map((p) => ({ lang, slug: p.slug }));
    }),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const t = await getDictionary(lang);
  const project = t.projects.find((p) => p.slug === slug && p.caseStudy);
  // Unknown slugs render the 404 page below.
  if (!project?.caseStudy) {
    return { title: t.meta.notFoundTitle, robots: { index: false, follow: true } };
  }

  return {
    title: `${project.title} — ${t.meta.caseStudySuffix}`,
    description: project.caseStudy.tagline,
    alternates: alternates(lang, `/projects/${slug}`),
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const caseStudies = await caseStudiesFor(lang);
  const index = caseStudies.findIndex((p) => p.slug === slug);
  const project = caseStudies[index];
  // Same 404 page as any other miss, rendered inside the locale layout.
  if (!project?.caseStudy) return <NotFoundContent />;

  const next =
    caseStudies.length > 1
      ? caseStudies[(index + 1) % caseStudies.length]
      : null;

  return (
    <CaseStudy
      project={{ ...project, caseStudy: project.caseStudy }}
      index={index + 1}
      next={next}
    />
  );
}
