"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useEffect, useMemo, useRef } from "react";
import ArrowLabel from "@/components/ArrowLabel";
import { useI18n } from "@/i18n/provider";

gsap.registerPlugin(ScrollTrigger);

// Spacing of the words along the scrubbed timeline, in timeline seconds: each
// word lights over WORD_LENGTH, starting WORD_STEP after the previous one.
const WORD_STEP = 0.35;
const WORD_LENGTH = 0.5;

export default function AboutSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);

  // One span per word. Words, not characters: a screen reader still reads the
  // bio as a sentence, and the DOM stays in the dozens of nodes. Words that
  // belong to a highlight phrase are marked, with trailing punctuation kept
  // outside the highlight block.
  const words = useMemo(() => {
    const keys = new Set(t.about.highlights.flatMap((h) => h.split(/\s+/)));
    return t.about.bio.split(/\s+/).map((raw) => {
      const [, core = raw, tail = ""] = raw.match(/^(.*?)([.,:;]?)$/) ?? [];
      return { raw, core, tail, highlight: keys.has(core) };
    });
  }, [t]);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const spans = Array.from(copy.children) as HTMLElement[];

    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // No scrubbing for anyone who asked for less motion: the text is simply
        // there, highlights included. The CSS resting state is faint, so it has
        // to be cleared here rather than left alone.
        gsap.set(spans, { opacity: 1 });
        gsap.set(copy.querySelectorAll(".about-kw-bg"), { scaleX: 1 });
        gsap.set(copy.querySelectorAll(".about-kw"), { color: "#1a1a1a" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "bottom 62%",
          scrub: 0.4,
        },
      });

      spans.forEach((span, i) => {
        const at = i * WORD_STEP;
        tl.to(span, { opacity: 1, duration: WORD_LENGTH, ease: "none" }, at);

        // A key word, once lit, is covered by a cream block drawn from the
        // left, and its ink flips to dark just as the block passes under it.
        const key = span.querySelector<HTMLElement>(".about-kw");
        if (key) {
          tl.to(key.firstElementChild, { scaleX: 1, duration: WORD_LENGTH, ease: "none" }, at + 0.2);
          tl.to(key, { color: "#1a1a1a", duration: 0.15, ease: "none" }, at + 0.45);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [words]);

  // The facts arrive as a colophon: the rule above them draws from the left,
  // then each fact rises in turn.
  useEffect(() => {
    const facts = factsRef.current;
    if (!facts || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: facts, start: "top 88%" } })
        .fromTo(".about-facts-rule", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power4.inOut" })
        .fromTo(
          ".about-fact",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" },
          0.45,
        );
    }, facts);

    return () => ctx.revert();
  }, []);

  const facts = [
    { label: t.about.facts.location, value: t.about.facts.locationValue },
    { label: t.about.facts.university, value: t.about.facts.universityValue },
    { label: t.about.facts.languages, value: t.about.facts.languagesValue },
    { label: t.about.facts.status, value: t.about.facts.statusValue, live: true },
    { label: t.about.facts.cv, value: t.about.facts.cvValue, href: t.cvUrl },
  ];

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
          {/* h2 for the section landmark; the .label class only carries the
              visual size — search engines and screen readers read a heading. */}
          <h2 className="label block mb-8 m-0">{t.about.label}</h2>

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
              <Fragment key={`${word.raw}-${i}`}>
                <span>
                  {word.highlight ? (
                    <>
                      <span className="about-kw">
                        <span className="about-kw-bg" aria-hidden="true" />
                        {word.core}
                      </span>
                      {word.tail}
                    </>
                  ) : (
                    word.raw
                  )}
                </span>
                {i < words.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </p>

          {/* The facts read as a colophon under the statement, so they get a
              rule of their own rather than sitting loose under the type. */}
          <div
            ref={factsRef}
            className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5"
            style={{ position: "relative", marginTop: "3.5rem", paddingTop: "2rem" }}
          >
            <i
              aria-hidden
              className="about-facts-rule"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "1px",
                background: "color-mix(in srgb, #f5f3ef 12%, transparent)",
                transformOrigin: "left",
              }}
            />
            {facts.map(({ label, value, href, live }) => (
              <div key={label} className="about-fact">
                <p className="label mb-1">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm font-medium text-cream hover:text-taupe transition-colors"
                  >
                    <ArrowLabel text={value} />
                  </a>
                ) : (
                  <p className="text-sm font-medium text-cream">
                    {live && <span className="status-dot" aria-hidden="true" />}
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
