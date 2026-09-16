import type { Locale } from "./config";
import { projectLinks } from "./projectLinks";
import type { Dictionary, Project } from "./types";
import { owner, siteUrl } from "@/site";

/**
 * schema.org JSON-LD for every page, built from the dictionaries so it always
 * says what the page says. Nodes share stable `@id`s, so search engines and
 * AI assistants read the pages as one person and one site rather than as
 * unrelated documents.
 */

const abs = (path: string) => new URL(path, siteUrl).toString();

export const PERSON_ID = abs("/#person");
export const WEBSITE_ID = abs("/#website");

type Node = Record<string, unknown>;

type Crumb = { name: string; path: string };

export function graph(...nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function personNode(t: Dictionary, lang: Locale): Node {
  const skills = [...new Set(Object.values(t.skills.groups).flat())];
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: owner.name,
    givenName: owner.givenName,
    familyName: owner.familyName,
    url: abs(`/${lang}/about`),
    jobTitle: `${t.hero.line1} ${t.hero.line2}`,
    description: t.about.bio,
    email: `mailto:${owner.email}`,
    telephone: owner.telephone,
    address: {
      "@type": "PostalAddress",
      addressLocality: owner.locality,
      addressRegion: owner.region,
      addressCountry: owner.country,
    },
    knowsLanguage: [
      { "@type": "Language", name: "Italian", alternateName: "it" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    knowsAbout: [...t.services.items.map((s) => s.title), ...skills],
    makesOffer: t.services.items.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@id": PERSON_ID },
      },
    })),
    sameAs: owner.sameAs,
  };
}

/**
 * The person in brief, for pages that only credit her as author. `@id`
 * references resolve within a page, so each page carries the node it points to.
 */
export function personRefNode(lang: Locale): Node {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: owner.name,
    url: abs(`/${lang}/about`),
    sameAs: owner.sameAs,
  };
}

export function websiteNode(t: Dictionary, lang: Locale): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: abs(`/${lang}`),
    name: owner.name,
    description: t.meta.description,
    inLanguage: lang,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

function breadcrumbNode(url: string, crumbs: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

/**
 * The page itself, with its breadcrumb trail. `extra` carries what the page
 * is about (`mainEntity`, `about`), which depends on the page type.
 */
export function pageNodes({
  type,
  lang,
  route,
  title,
  description,
  crumbs,
  extra,
}: {
  type: string;
  lang: Locale;
  route: string;
  title: string;
  description: string;
  /** Trail after the home page, which always comes first. */
  crumbs: Crumb[];
  extra?: Node;
}): Node[] {
  const url = abs(`/${lang}${route}`);
  const trail = [{ name: owner.name, path: `/${lang}` }, ...crumbs];
  return [
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": WEBSITE_ID },
      ...(crumbs.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      ...extra,
    },
    ...(crumbs.length ? [breadcrumbNode(url, trail)] : []),
  ];
}

/** A project as a creative work by the site's owner. */
export function projectNode(t: Dictionary, lang: Locale, project: Project): Node {
  const caseStudyUrl = project.caseStudy
    ? abs(`/${lang}/projects/${project.slug}`)
    : undefined;
  const { live, repos } = projectLinks(project);
  const elsewhere = [...(live ? [live] : []), ...repos.map((r) => r.url)];
  return {
    "@type": "CreativeWork",
    // Projects without a case study have no page of their own.
    "@id": caseStudyUrl
      ? `${caseStudyUrl}#work`
      : abs(`/${lang}/projects#${project.slug}`),
    name: project.title,
    headline: project.caseStudy?.tagline ?? project.subtitle,
    description: project.description,
    url: caseStudyUrl ?? elsewhere[0],
    image: abs(project.caseStudy?.hero.src ?? project.image),
    genre: project.category,
    keywords: project.tech.join(", "),
    inLanguage: lang,
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    ...(elsewhere.length ? { sameAs: elsewhere } : {}),
    ...(project.caseStudy
      ? { abstract: project.caseStudy.overview.join(" ") }
      : {}),
  };
}
