import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/**
 * Picks the best supported locale from the Accept-Language header.
 * Kept dependency-free: with two locales a hand-rolled parse is enough.
 */
function getLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q === undefined ? 1 : Number(q) };
    })
    .filter(({ tag, q }) => tag.length > 0 && !Number.isNaN(q) && q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // "en-GB" and "en" both match the "en" locale.
    const base = tag.split("-")[0];
    const match = locales.find((locale) => locale === base);
    if (match) return match;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(request.nextUrl);
  // Where this redirect points depends on the request's own language header,
  // so a shared cache must not hand one visitor's destination to the next.
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  // Everything except Next internals and files served from /public.
  matcher: ["/((?!_next|api|favicon.ico|.*\\.[^/]+$).*)"],
};
