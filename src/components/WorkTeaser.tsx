"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const featured = projects.slice(0, 3);

export default function WorkTeaser() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll(".reveal-line") ?? [],
        { y: "110%" },
        {
          y: "0%", duration: 0.85, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        }
      );

      sectionRef.current?.querySelectorAll(".work-card").forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{ borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)" }}
    >
      {/* Header row */}
      <div className="container px-8 md:px-16 pt-20 pb-12 flex items-end justify-between">
        <div>
          <span className="label block mb-3">Selected work</span>
          <div style={{ overflow: "clip" }}>
            <h2
              className="reveal-line block"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#1a1a1a" }}
            >
              Projects
            </h2>
          </div>
        </div>
        <Link href="/projects" className="btn hidden md:inline-flex" style={{ fontSize: "0.72rem", padding: "0.65rem 1.25rem" }}>
          All projects →
        </Link>
      </div>

      {/* Cards */}
      <div className="container px-8 md:px-16 pb-20 grid grid-cols-1 md:grid-cols-3 gap-5">
        {featured.map((project) => (
          <article key={project.slug} className="work-card group" style={{ opacity: 0 }}>
            {/* Image */}
            <div
              className="relative overflow-hidden mb-4"
              style={{ aspectRatio: "3/2", background: "#e8e4dd" }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: "rgba(26,26,26,0.55)" }}
              >
                <span className="label" style={{ color: "#f5f3ef", letterSpacing: "0.18em" }}>View project</span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em", color: "#1a1a1a", marginBottom: "0.2rem" }}>
                  {project.title}
                </h3>
                <p className="label">{project.subtitle}</p>
              </div>
              <span className="label flex-shrink-0 mt-0.5">{project.year}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.tech.slice(0, 3).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="container px-8 pb-16 flex md:hidden">
        <Link href="/projects" className="btn">All projects →</Link>
      </div>
    </section>
  );
}
