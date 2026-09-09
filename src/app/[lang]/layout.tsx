import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/provider";
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
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
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
            <Header />
            {children}
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
