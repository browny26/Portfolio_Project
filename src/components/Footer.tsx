"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import ArrowLabel from "@/components/ArrowLabel";
import { useI18n } from "@/i18n/provider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Style for the block that sits directly above <Footer />.
 *
 * The footer waits, sticky, at the bottom of the viewport underneath the page,
 * and the page lifts off it like a curtain. For that the content before it has
 * to be positioned above it and opaque: a sticky element is positioned, a plain
 * block is not, so without this the footer would paint over the page instead.
 */
export const curtainAbove: CSSProperties = {
  position: "relative",
  zIndex: 1,
  background: "#f5f3ef",
  boxShadow: "0 40px 60px -40px rgba(0, 0, 0, 0.55)",
};

export default function Footer() {
  const { t, href } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // The curtain only works when the whole footer fits on screen: a taller one
  // would keep its top part hidden under the page for good.
  const [fits, setFits] = useState(false);

  useEffect(() => {
    const footer = ref.current;
    if (!footer) return;
    const measure = () => setFits(footer.offsetHeight <= window.innerHeight);
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const footer = ref.current;
    if (!footer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const lines = footer.querySelectorAll(".reveal-line");
      const meta = footer.querySelectorAll(".footer-meta");

      if (fits && !reduced) {
        // Everything is already in place under the page. As the page lifts
        // off, the content settles down from slightly higher and brightens —
        // over exactly the last footer-height of scroll.
        gsap.set(meta, { opacity: 1 });
        gsap.fromTo(
          innerRef.current,
          { yPercent: -30, opacity: 0.35 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: () => `bottom-=${footer.offsetHeight} bottom`,
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
        return;
      }

      gsap.fromTo(
        lines,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: footer, start: "top 80%" },
        },
      );
      gsap.fromTo(
        meta,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: footer, start: "top 75%" },
        },
      );
    }, footer);
    return () => ctx.revert();
  }, [fits]);

  return (
    <footer
      ref={ref}
      className="bg-[#1A1A1A]"
      style={{
        borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
        overflow: "clip",
        ...(fits ? { position: "sticky", bottom: 0, zIndex: 0 } : null),
      }}
    >
      <div ref={innerRef} className="section">
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
                <ArrowLabel text={t.footer.cta} />
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
                className="label link-underline hover:text-cream transition-colors"
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
