"use client";

import { experience } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
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

      const items = sectionRef.current?.querySelectorAll(".exp-row");
      items?.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section"
      style={{
        borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <span className="label block mb-4">About me</span>
          <div className="overflow-clip">
            <h2
              className="reveal-line block font-bold tracking-[-0.03em] text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Experience
            </h2>
          </div>
        </div>
        <div>
          <p className="text-[0.95rem] leading-[1.75] text-taupe mt-1">
            Full-stack developer and designer based in Milan. I&apos;m
            passionate about crafting digital experiences that combine
            thoughtful design with clean, scalable code. Currently studying
            Digital Communication &amp; Computer Science at the University of
            Milan.
          </p>

          <div
            className="grid grid-cols-2 gap-4 mt-8"
            style={{ marginTop: "2rem" }}
          >
            {[
              { label: "Location", value: "Milan, Italy" },
              { label: "University", value: "Univ. degli Studi di Milano" },
              { label: "Languages", value: "Italian · English (B2)" },
              { label: "Status", value: "Open to work" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="label mb-1">{label}</p>
                <p className="text-sm font-medium text-[#1a1a1a]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col" style={{ marginTop: "2rem" }}>
        {experience.map((exp, i) => (
          <div
            key={i}
            className="exp-row py-7"
            style={{
              borderTop:
                "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)",
              opacity: 0,
              paddingBottom: i === experience.length - 1 ? "0" : "1.75rem",
              paddingTop: "1.75rem",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr_12rem] gap-4 md:gap-8">
              <div>
                <p className="label leading-relaxed">{exp.period}</p>
              </div>

              <div>
                <div style={{ paddingBottom: "1rem" }}>
                  <h3 className="text-[1.05rem] font-semibold text-[#1a1a1a] mb-1">
                    {exp.role}
                  </h3>
                  <p className="label mb-3 text-[#1a1a1a]">
                    {exp.company} — {exp.location}
                  </p>
                </div>
                <ul className="flex flex-col gap-1">
                  {exp.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className="text-[0.85rem] text-taupe leading-[1.6]"
                    >
                      — {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 content-start">
                {exp.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
