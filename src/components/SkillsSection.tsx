"use client";

import { skills } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
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

      const cols = sectionRef.current?.querySelectorAll(".skill-col");
      cols?.forEach((col, i) => {
        gsap.fromTo(
          col,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: col, start: "top 88%" },
          },
        );
      });

      const tags = sectionRef.current?.querySelectorAll(".skill-tag");
      if (tags) {
        gsap.fromTo(
          tags,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          },
        );
      }
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
        <span className="label block mb-4">Tech stack</span>
        <div className="overflow-clip">
          <h2
            className="reveal-line block font-bold tracking-[-0.03em] text-[#1a1a1a]"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            Skills
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {Object.entries(skills).map(([category, list]) => (
          <div key={category} className="skill-col opacity-0">
            <h3
              className="label text-[#1a1a1a]"
              style={{
                borderBottom:
                  "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)",
                marginBottom: "1.5rem",
                paddingBottom: "0.25rem",
              }}
            >
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {list.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag tag hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-default"
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
