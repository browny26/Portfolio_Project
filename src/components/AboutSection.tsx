"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useEffect, useRef } from "react";
import { useI18n } from "@/i18n/provider";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // One span per word. Words, not characters: a screen reader still reads the
  // bio as a sentence, and the DOM stays in the dozens of nodes.
  const words = t.about.bio.split(/\s+/);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No scrubbing for anyone who asked for less motion: the text is simply
      // there, at full strength. The CSS resting state is faint, so it has to
      // be cleared here rather than left alone.
      gsap.set(copyRef.current?.querySelectorAll("span") ?? [], { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const spans = copyRef.current?.querySelectorAll("span");
      if (!spans || spans.length === 0) return;

      gsap.to(spans, {
        opacity: 1,
        ease: "none",
        // `stagger` under a scrub is what spreads the words across the scroll:
        // each one lights as the fraction of the range it owns goes by.
        stagger: 0.35,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "bottom 62%",
          scrub: 0.4,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [t]);

  return (
    <div className="bg-[#1a1a1a] w-full">
      <div
        ref={sectionRef}
        id="about"
        className="scroll-mt-24"
        style={{
          // A light hairline, because this section and the projects banner below
          // it are both dark: without it the two read as one block.
          borderBottom:
            "1px solid color-mix(in srgb, #f5f3ef 12%, transparent)",
        }}
      >
        <div className="section">
          <span className="label block mb-8">{t.about.label}</span>

          {/* Full bleed inside the section: no max-width, so the bio runs the
              whole measure. The type scales up with it to keep the lines from
              growing past what a display size can carry. */}
          <p
            ref={copyRef}
            className="about-copy font-bold tracking-[-0.02em] text-cream"
            style={{
              fontSize: "clamp(1.7rem, 3.8vw, 3.2rem)",
              lineHeight: 1.3,
              textWrap: "pretty",
            }}
          >
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span>{word}</span>
                {i < words.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </p>

          {/* The facts read as a colophon under the statement, so they get a
              rule of their own rather than sitting loose under the type. */}
          <div
            className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5"
            style={{
              marginTop: "3.5rem",
              paddingTop: "2rem",
              borderTop:
                "1px solid color-mix(in srgb, #f5f3ef 12%, transparent)",
            }}
          >
            {[
              {
                label: t.about.facts.location,
                value: t.about.facts.locationValue,
              },
              {
                label: t.about.facts.university,
                value: t.about.facts.universityValue,
              },
              {
                label: t.about.facts.languages,
                value: t.about.facts.languagesValue,
              },
              {
                label: t.about.facts.status,
                value: t.about.facts.statusValue,
              },
              {
                label: t.about.facts.cv,
                value: t.about.facts.cvValue,
                href: t.cvUrl,
              },
            ].map(({ label, value, href }) => (
              <div key={label}>
                <p className="label mb-1">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-cream hover:text-taupe transition-colors"
                    style={{ textDecoration: "none" }}
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-cream">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
