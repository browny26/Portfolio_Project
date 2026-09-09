"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/provider";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const { t, href } = useI18n();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = ref.current?.querySelectorAll(".reveal-line");
      if (lines) {
        gsap.fromTo(
          lines,
          { y: "110%" },
          {
            y: "0%",
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 80%" },
          },
        );
      }
      gsap.fromTo(
        ref.current?.querySelectorAll(".footer-meta") ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      className="bg-[#1A1A1A]"
      style={{
        borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
      }}
    >
      <div className="section">
        <div className="mb-14">
          <div className="overflow-clip">
            <div
              className="reveal-line block font-bold tracking-[-0.03em] leading-[0.95] text-cream"
              style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
            >
              {t.footer.line1}
            </div>
          </div>
          <div className="overflow-clip">
            <div
              className="reveal-line block italic font-bold tracking-[-0.03em] leading-[0.95] text-taupe"
              style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
            >
              {t.footer.line2}
            </div>
          </div>
          <div
            className="overflow-clip mt-4"
            style={{ marginTop: "1rem", marginBottom: "3rem" }}
          >
            <div className="reveal-line block">
              <Link
                href={href("/contact")}
                className="btn btn-filled-inverted inline-flex mt-6"
              >
                {t.footer.cta}
              </Link>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6"
          style={{
            borderTop: "1px solid color-mix(in srgb, #f5f3ef 10%, transparent)",
            paddingTop: "1.5rem",
          }}
        >
          <div className="footer-meta opacity-0">
            <p className="font-semibold text-cream text-[0.9rem]">
              Luisa Cerin Ogbeiwi
            </p>
            <p className="label mt-0.5">
              {t.footer.role}
            </p>
          </div>

          <div className="footer-meta flex gap-6 opacity-0">
            {[
              { label: t.footer.github, href: "https://github.com/browny26" },
              {
                label: t.footer.linkedin,
                href: "https://linkedin.com/in/luisa-cerin",
              },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="label hover:text-cream transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="footer-meta label opacity-0">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
