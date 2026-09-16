import { getDictionary } from "@/i18n/dictionaries";
import { realLink } from "@/i18n/structuredData";
import { owner, siteUrl } from "@/site";

/**
 * /llms.txt: the site summarised in Markdown for AI assistants and answer
 * engines, following https://llmstxt.org. Written from the English dictionary
 * (with links to both languages) so it never drifts from the pages.
 */
export const dynamic = "force-static";

const abs = (path: string) => new URL(path, siteUrl).toString();

export async function GET() {
  const t = await getDictionary("en");
  const f = t.about.facts;

  const caseStudies = t.projects.filter((p) => p.caseStudy);
  const otherProjects = t.projects.filter((p) => !p.caseStudy);

  const body = [
    `# ${owner.name}`,
    "",
    `> ${t.meta.description}`,
    "",
    t.about.bio,
    "",
    "## Key facts",
    "",
    `- ${f.location}: ${f.locationValue}`,
    `- ${f.university}: ${f.universityValue}`,
    `- ${f.languages}: ${f.languagesValue}`,
    `- ${f.status}: ${f.statusValue}`,
    `- Email: ${owner.email}`,
    `- Contact form: ${abs("/en/contact")}`,
    ...owner.sameAs.map((url) => `- ${new URL(url).hostname}: ${url}`),
    "",
    "## Services",
    "",
    ...t.services.items.map(
      (s) => `- **${s.title}** (${s.subtitle}): ${s.description} Tools: ${s.tech.join(", ")}.`,
    ),
    "",
    "## Experience",
    "",
    ...t.experience.items.flatMap((e) => [
      `### ${e.role} — ${e.company}${e.location ? `, ${e.location}` : ""} (${e.period})`,
      "",
      ...e.bullets.map((b) => `- ${b}`),
      `- Stack: ${e.tech.join(", ")}`,
      "",
    ]),
    "## Case studies",
    "",
    ...caseStudies.map(
      (p) =>
        `- [${p.title}](${abs(`/en/projects/${p.slug}`)}): ${p.caseStudy?.tagline} Role: ${p.caseStudy?.role}. Stack: ${p.tech.join(", ")}.`,
    ),
    "",
    "## Other projects",
    "",
    ...otherProjects.map((p) => {
      const link = realLink(p.links.live) ?? realLink(p.links.repo);
      const name = link ? `[${p.title}](${link})` : p.title;
      return `- ${name} (${p.category}, ${p.year}): ${p.description}`;
    }),
    "",
    "## Skills",
    "",
    ...Object.entries(t.skills.groups).map(([group, list]) => `- ${group}: ${list.join(", ")}`),
    "",
    "## Pages",
    "",
    `- [Home](${abs("/en")}) · [Italiano](${abs("/it")})`,
    `- [About](${abs("/en/about")}) · [Chi sono](${abs("/it/about")})`,
    `- [Projects](${abs("/en/projects")}) · [Progetti](${abs("/it/projects")})`,
    `- [Contact](${abs("/en/contact")}) · [Contatti](${abs("/it/contact")})`,
    `- [CV (PDF)](${abs(t.cvUrl)})`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
