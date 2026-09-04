import CaseStudy from "@/components/CaseStudy";
import { projects } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const caseStudies = projects.filter((p) => p.caseStudy);

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project?.caseStudy) return {};
  return {
    title: `${project.title} — Case study · Luisa Cerin Ogbeiwi`,
    description: project.caseStudy.tagline,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = caseStudies.findIndex((p) => p.slug === slug);
  const project = caseStudies[index];
  if (!project?.caseStudy) notFound();

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
