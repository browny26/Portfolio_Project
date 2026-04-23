"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.5 });

      [line1Ref, line2Ref].forEach((ref, i) => {
        tl.fromTo(
          ref.current,
          { y: "110%" },
          { y: "0%", duration: 1, ease: "power3.out" },
          i * 0.08,
        );
      });

      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0.5,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-cream min-h-screen flex flex-col px-8 md:px-16"
    >
      <div className="h-28" />

      <div className="flex-1 flex flex-col justify-center gap-[0.2rem]">
        {[
          {
            ref: line1Ref,
            text: "software & ai",
            textClass: "text-[#1a1a1a]",
            italic: false,
          },
          {
            ref: line2Ref,
            text: "developer",
            textClass: "text-[#8c8680]",
            italic: true,
          },
        ].map(({ ref, text, textClass, italic }) => (
          <div
            key={text}
            className="overflow-clip flex items-center justify-center"
          >
            <div
              ref={ref}
              style={{ fontSize: "clamp(3.2rem, 8.5vw, 6rem)" }}
              className={`font-bold leading-none tracking-[-0.03em] ${textClass} ${italic ? "italic" : ""}`}
            >
              {text}
            </div>
          </div>
        ))}
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
          }}
          className="pt-6 w-full pb-10 mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex flex-col gap-[0.35rem]">
            <span className="label">Based in Milan, Italy</span>
            <span className="label">Available for freelance</span>
          </div>

          {/* <div className="flex flex-col items-center gap-2">
          <span className="label">Scroll</span>
          <div className="w-px h-10 bg-linear-to-b from-[#1a1a1a] to-transparent" />
        </div> */}

          <p className="max-w-md text-sm leading-[1.7] text-taupe">
            I craft modern websites and sleek interfaces — blending design and
            code to deliver unique digital experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
