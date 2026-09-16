"use client";

import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer, { curtainAbove } from "@/components/Footer";
import SkillsSection from "@/components/SkillsSection";
import { useCurtainOpen } from "@/components/pageCurtain";
import { useI18n } from "@/i18n/provider";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function AboutContent() {
  const { t } = useI18n();
  const headingRef = useRef<HTMLDivElement>(null);
  // Arriving through the page curtain, the entrance waits for it to lift.
  const curtainOpen = useCurtainOpen();

  useEffect(() => {
    if (!curtainOpen) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.querySelectorAll(".reveal-line") ?? [],
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
          delay: 0.25,
        },
      );
    });
    return () => ctx.revert();
  }, [curtainOpen]);

  return (
    <div className="bg-cream min-h-screen">
      <main>
        <div style={curtainAbove}>
          {/* Page heading. No bottom padding: the bio below is on the same dark
              band and its own section padding is the gap between the two. */}
          <div className="bg-[#1a1a1a] w-full">
            <div
              ref={headingRef}
              className="section"
              style={{ paddingBottom: 0 }}
            >
              <div className="h-16" />
              <span className="label block" style={{ marginBottom: "1rem" }}>
                {t.about.label}
              </span>
              {/* The two words rise one after the other. */}
              <h1
                className="flex flex-wrap font-bold tracking-[-0.03em] leading-[0.95] text-cream"
                style={{ fontSize: "clamp(3rem, 8vw, 8rem)", columnGap: "0.24em" }}
              >
                <span className="block overflow-clip">
                  <span className="reveal-line block">{t.about.title}</span>
                </span>
                <span className="block overflow-clip">
                  <span className="reveal-line block text-taupe">
                    {t.about.titleAccent}
                  </span>
                </span>
              </h1>
            </div>
          </div>

          <AboutSection full />
          {/* The story first, then the inventory. */}
          <ExperienceSection />
          <SkillsSection />
        </div>

        <Footer />
      </main>
    </div>
  );
}
