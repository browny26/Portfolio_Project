import SmoothScroll from "@/components/SmoothScroll";
import type { Metadata } from "next";
import { DM_Mono, Syne } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Luisa Cerin Ogbeiwi — Software & AI Developer",
  description:
    "Full-stack developer crafting modern websites and sleek interfaces. Blending design and code to deliver unique digital experiences.",
  keywords: [
    "web developer",
    "designer",
    "full-stack",
    "React",
    "Next.js",
    "TypeScript",
    "Milan",
    "freelance",
    "portfolio",
    "modern websites",
    "sleek interfaces",
    "digital experiences",
    "Luisa Cerin Ogbeiwi",
    "Ai Integration",
    "UI/UX",
    "responsive design",
    "frontend",
    "backend",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
