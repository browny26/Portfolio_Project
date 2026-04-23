"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading reveal
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
          }
        );
      }

      // Cards sequential reveal
      const cards = sectionRef.current?.querySelectorAll(".project-item");
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%" },
              delay: (i % 2) * 0.1,
            }
          );
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section container"
      style={{ borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)" }}
    >
      {/* Section header */}
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <span className="label block mb-4">Selected work</span>
          <div className="overflow-clip">
            <h2
              className="reveal-line block"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#1a1a1a",
              }}
            >
              Projects
            </h2>
          </div>
        </div>
        <Link
          href="/projects"
          className="btn hidden md:inline-flex"
          style={{ fontSize: "0.75rem", padding: "0.6rem 1.2rem" }}
        >
          View all
        </Link>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {projects.slice(0, 6).map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="mt-10 flex justify-center md:hidden">
        <Link href="/projects" className="btn">View all projects</Link>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <article className="project-item group" style={{ opacity: 0 }}>
      {/* Image */}
      <div
        className="relative overflow-hidden mb-4"
        style={{
          aspectRatio: "4/3",
          background: "#e8e4dd",
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="project-image object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "rgba(26,26,26,0.6)" }}
        >
          <span
            className="label"
            style={{ color: "#f5f3ef", letterSpacing: "0.15em" }}
          >
            View project
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#1a1a1a",
              marginBottom: "0.25rem",
            }}
          >
            {project.title}
          </h3>
          <p className="label">{project.category}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="label">{project.year}</span>
        </div>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {project.tech.slice(0, 4).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
    </article>
  );
}
