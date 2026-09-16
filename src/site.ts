/**
 * Single source of truth for the canonical origin of the site.
 * Everything that emits absolute URLs — sitemap, robots, canonical/OG/twitter
 * metadata, JSON-LD — reads from here so that a deploy on a new domain only
 * needs one env var, not a grep across the codebase.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this on the production deploy.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production hostname,
 *      injected automatically on Vercel builds.
 *   3. localhost:3000 — dev fallback so builds don't crash without env vars.
 */
export const siteUrl: URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL("http://localhost:3000");
})();

/**
 * The site's owner as the rest of the web knows her. Read by the structured
 * data and by /llms.txt, so search engines and AI assistants describe the
 * same person the pages do.
 */
export const owner = {
  name: "Luisa Cerin Ogbeiwi",
  givenName: "Luisa",
  familyName: "Cerin Ogbeiwi",
  email: "luisa.cerinogbeiwi@gmail.com",
  telephone: "+393773183236",
  locality: "Gallarate",
  region: "Lombardia",
  country: "IT",
  sameAs: ["https://github.com/browny26", "https://linkedin.com/in/luisa-cerin"],
};
