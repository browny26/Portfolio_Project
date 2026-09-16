"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/provider";

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headingLines = sectionRef.current?.querySelectorAll(".reveal-line");
      if (headingLines) {
        gsap.fromTo(
          headingLines,
          { y: "110%" },
          {
            y: "0%",
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          },
        );
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Each group counts its technologies up from zero while its tags are
      // unmasked from the bottom, one group a beat after the other.
      gsap.utils.toArray<HTMLElement>(".skill-col").forEach((col, i) => {
        const tl = gsap.timeline({
          delay: i * 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });

        const count = col.querySelector<HTMLElement>(".skill-count");
        if (count) {
          const counter = { value: 0 };
          count.textContent = "0";
          tl.to(
            counter,
            {
              value: Number(count.dataset.count),
              duration: 0.8,
              ease: "power2.out",
              onUpdate: () => {
                count.textContent = String(Math.round(counter.value));
              },
            },
            0,
          );
        }

        tl.fromTo(
          col.querySelectorAll(".skill-tag"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.5,
            stagger: 0.015,
            ease: "power3.out",
          },
          0,
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section"
      style={{
        borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
      }}
    >
      <div className="mb-12 md:mb-16">
        <span className="label block mb-4">{t.skills.label}</span>
        <div className="overflow-clip">
          <h2
            className="reveal-line block font-bold tracking-[-0.03em] text-[#1a1a1a]"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {t.skills.title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {Object.entries(t.skills.groups).map(([category, list]) => (
          <div key={category} className="skill-col">
            <div
              className="flex items-baseline justify-between gap-4"
              style={{
                borderBottom:
                  "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)",
                marginBottom: "1.5rem",
                paddingBottom: "0.4rem",
              }}
            >
              <h3 className="label text-[#1a1a1a]">{category}</h3>
              <span
                className="skill-count font-mono text-[1.35rem] leading-none tabular-nums text-[#1a1a1a]"
                data-count={list.length}
              >
                {list.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {list.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag tag tag-fill cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
