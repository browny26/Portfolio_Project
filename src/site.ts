/**
 * Single source of truth for the canonical origin of the site.
 * Everything that emits absolute URLs — sitemap, robots, canonical/OG/twitter
 * metadata, JSON-LD — reads from here so that a deploy on a new domain only
 * needs one env var, not a grep across the codebase.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — overrides everything when set.
 *   2. PRODUCTION_URL on production deploys. Vercel's own production hostname
 *      is the *.vercel.app alias, which would make every canonical, hreflang
 *      and sitemap URL point away from the real domain.
 *   3. VERCEL_PROJECT_PRODUCTION_URL — preview deploys.
 *   4. localhost:3000 — dev fallback so builds don't crash without env vars.
 */
const PRODUCTION_URL = "https://luisacerinogbeiwi.dev";

export const siteUrl: URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  if (process.env.VERCEL_ENV === "production") return new URL(PRODUCTION_URL);

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
