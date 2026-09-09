import NotFoundContent from "@/components/NotFoundContent";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Metadata } from "next";

/**
 * Any path under a locale that matches no other route. More specific routes
 * win, so this only ever catches genuine misses.
 *
 * It renders the 404 as an ordinary page rather than calling `notFound()`:
 * because the root layout lives on the `[lang]` dynamic segment, Next serves
 * `not-found.tsx` from its own error shell, without `<html lang>`, the fonts
 * or the site chrome. Rendering it here keeps the page inside the layout.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[...path]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.meta.notFoundTitle,
    robots: { index: false, follow: true },
  };
}

export default function CatchAll() {
  return <NotFoundContent />;
}
