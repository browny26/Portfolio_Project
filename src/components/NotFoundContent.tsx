"use client";

import ArrowLabel from "@/components/ArrowLabel";
import Footer, { curtainAbove } from "@/components/Footer";
import { useI18n } from "@/i18n/provider";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NotFoundContent() {
  const { t, href } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        sectionRef.current?.querySelectorAll(".reveal-line") ?? [],
        { y: "110%" },
        { y: "0%", duration: 0.9, stagger: 0.09, ease: "power3.out" },
      );

      tl.fromTo(
        sectionRef.current?.querySelectorAll(".nf-meta") ?? [],
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.45,
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      <main>
        <div style={curtainAbove}>
        <section
          ref={sectionRef}
          className="section relative flex min-h-screen flex-col justify-center"
        >
          {/* Same mark as the hero, sitting behind the numeral. */}
          <Image
            src="/imgs/noun-y2k-spark-6764461.png"
            alt=""
            aria-hidden
            width={300}
            height={300}
            loading="eager"
            className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
          />

          <div className="relative">
            <span
              className="nf-meta label block"
              style={{ opacity: 0, marginBottom: "1rem" }}
            >
              {t.notFound.label}
            </span>

            {/* The counter typeface from the intro loader. */}
            <div className="overflow-clip">
              <div
                className="reveal-line block"
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "clamp(4.5rem, 15vw, 12rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 0.9,
                  color: "#1a1a1a",
                }}
              >
                {t.notFound.code}
              </div>
            </div>

            <div className="overflow-clip" style={{ marginTop: "1.5rem" }}>
              <h1
                className="reveal-line block font-bold tracking-[-0.03em] leading-[0.95] text-[#1a1a1a]"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                {t.notFound.title}{" "}
                <span className="text-taupe italic">
                  {t.notFound.titleAccent}
                </span>
              </h1>
            </div>

            <p
              className="nf-meta text-[0.95rem] leading-[1.7] text-taupe max-w-md"
              style={{ opacity: 0, marginTop: "2rem" }}
            >
              {t.notFound.body}
            </p>

            <div
              className="nf-meta flex flex-wrap gap-3"
              style={{ opacity: 0, marginTop: "2.5rem" }}
            >
              <Link href={href("/")} className="btn btn-filled">
                <ArrowLabel text={t.notFound.home} />
              </Link>
              <Link href={href("/projects")} className="btn">
                {t.notFound.projects}
              </Link>
            </div>
          </div>
        </section>

        </div>

        <Footer />
      </main>
    </div>
  );
}
