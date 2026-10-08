import Header from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { I18nProvider } from "@/i18n/provider";
import { siteUrl } from "@/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { DM_Mono, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);

  return {
    // metadataBase is what turns the relative `alternates.canonical` and the
    // `/opengraph-image` OG image into full absolute URLs — crawlers and
    // social-preview bots reject anything relative.
    metadataBase: siteUrl,
    keywords: t.meta.keywords,
    authors: [{ name: "Luisa Cerin Ogbeiwi" }],
    creator: "Luisa Cerin Ogbeiwi",
    // Let Google show large image previews and full-length snippets.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Search Console's HTML-tag verification, if the domain isn't verified by DNS.
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    ...pageMetadata({
      lang,
      title: t.meta.title,
      description: t.meta.description,
    }),
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} className={`${syne.variable} ${dmMono.variable}`}>
      <body className="antialiased">
        <I18nProvider lang={lang} dictionary={dictionary}>
          <SmoothScroll>
            <PageTransition>
              <Header />
              {children}
            </PageTransition>
          </SmoothScroll>
        </I18nProvider>
        {/* Page views and Core Web Vitals, collected only on Vercel deployments. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
