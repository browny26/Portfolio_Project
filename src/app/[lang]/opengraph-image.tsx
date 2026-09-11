import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * OG card generated at build time, one per locale. Route-nested at
 * `app/[lang]/opengraph-image.tsx` so Next.js's file-based metadata pipeline
 * auto-attaches the right one for whichever locale the URL is in.
 *
 * Cream ground, ink type — the same palette the site opens on, so a shared
 * link previews like the home page rather than a generic brand card.
 */

export const alt = "Luisa Cerin Ogbeiwi — Software & AI Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamicParams = false;

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = isLocale(lang)
    ? await getDictionary(lang)
    : await getDictionary("it");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5f3ef",
          color: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8c8680",
          }}
        >
          Luisa Cerin Ogbeiwi
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 128,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>{t.hero.line1}</span>
            <span style={{ fontStyle: "italic", color: "#8c8680" }}>
              {t.hero.line2}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8c8680",
          }}
        >
          <span>{t.hero.based}</span>
          <span>{t.hero.availability}</span>
        </div>
      </div>
    ),
    size,
  );
}

// generateImageMetadata isn't used, but `generateStaticParams` from the
// parent layout already tells Next what to pre-render for [lang].
