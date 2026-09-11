"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/provider";
import { useIntroDone } from "./introSignal";
import type { CSSProperties } from "react";

/* The two headline colours are not the colours you see. The type sits on top of
   the mark in `mix-blend-mode: difference`, which subtracts it from whatever is
   behind: over the cream ground (#f5f3ef) these land exactly on the site's ink
   (#1a1a1a) and taupe (#8c8680), and over the black mark they invert to a light
   grey. Change the ground and these two have to be recomputed with it. */
const INK_OVER_CREAM = "#dbd9d5";
const TAUPE_OVER_CREAM = "#696d6f";

export default function Hero() {
  const { t } = useI18n();
  const introDone = useIntroDone();
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The entrance is tied to the intro, not to a fixed delay: when the intro
    // is skipped — a second visit, or coming back to the home page — this is
    // already true on mount and the hero animates straight away instead of
    // leaving the first screen empty for the length of an intro that never ran.
    if (!introDone) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // The mark only fades up: it is the ground the type passes over, and it
      // never moves — no scale, no drift, no rotation.
      tl.fromTo(
        markRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        0,
      );

      [line1Ref, line2Ref].forEach((ref, i) => {
        tl.fromTo(
          ref.current,
          { y: "110%" },
          { y: "0%", duration: 1, ease: "power3.out" },
          0.15 + i * 0.08,
        );
      });

      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0.6,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [introDone]);

  return (
    <section
      ref={sectionRef}
      // `isolate` keeps the difference blend inside the hero: without it the
      // headline would blend with the header and the page behind it too.
      className="bg-cream min-h-screen flex flex-col px-8 md:px-16 relative isolate"
    >
      <div className="h-28" />

      <div className="flex-1 flex flex-col justify-center relative">
        {/* Centring lives on the wrapper because GSAP owns the transform of the
            element it animates — it would overwrite the -50% offsets. */}
        <div
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "min(105vw, 82vh)" }}
        >
          <div ref={markRef} style={{ opacity: 0 }}>
            <Image
              src="/imgs/noun-y2k-spark-6764461.png"
              alt=""
              aria-hidden
              width={700}
              height={700}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 700px"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* One <h1> for the whole two-line headline: aria-label carries the
            clean accessible name so the site's owner and role read as a single
            phrase, while the visible lines keep the type-driven layout. Inner
            elements are <span>s so the h1 contains phrasing content only,
            which is what the spec requires. */}
        <h1
          aria-label={`Luisa Cerin Ogbeiwi — ${t.hero.line1} ${t.hero.line2}`}
          className="relative flex flex-col gap-[0.2rem] m-0"
          style={{ mixBlendMode: "difference" }}
        >
          {(
            [
              {
                ref: line1Ref,
                text: t.hero.line1,
                color: INK_OVER_CREAM,
                italic: false,
              },
              {
                ref: line2Ref,
                text: t.hero.line2,
                color: TAUPE_OVER_CREAM,
                italic: true,
              },
            ] as const
          ).map(({ ref, text, color, italic }) => (
            <span
              key={text}
              className="overflow-clip flex items-center justify-center"
            >
              <span
                ref={ref}
                style={{
                  display: "block",
                  fontSize: "clamp(3.2rem, 8.5vw, 6rem)",
                  color,
                  // Hidden from the first paint, so nothing flashes into place
                  // while the intro is still covering the screen.
                  transform: "translateY(110%)",
                } as CSSProperties}
                className={`font-bold leading-none tracking-[-0.03em] ${italic ? "italic" : ""}`}
              >
                {text}
              </span>
            </span>
          ))}
        </h1>
      </div>

      <div
        style={{
          borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
        }}
      ></div>
      <div className="bg-[#1a1a1a] w-full">
        <div
          ref={metaRef}
          style={{
            opacity: 0,
            paddingBlock: "1.5rem",
            paddingInline: "2rem",
            maxWidth: "1440px",
            margin: "0 auto",
            borderBottom: "1px solid #8c86801a",
          }}
          className="pt-6 w-full pb-10 mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex flex-col gap-[0.35rem]">
            <span className="label">{t.hero.based}</span>
            <span className="label">{t.hero.availability}</span>
          </div>

          <p className="max-w-md text-sm leading-[1.7] text-taupe">
            {t.hero.blurb}
          </p>
        </div>
      </div>
    </section>
  );
}
