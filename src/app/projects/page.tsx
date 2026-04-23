"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { projects } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

      gridRef.current?.querySelectorAll(".proj-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            delay: (i % 2) * 0.1,
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      <Header />

      <main>
        {/* Page heading */}
        <div className="bg-[#1a1a1a] w-full">
          <div
            ref={headingRef}
            className="section pb-12"
            style={{
              borderBottom:
                "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
            }}
          >
            <div className="h-16" />
            <span className="label block mb-4">All projects</span>
            <div className="overflow-clip">
              <h1
                className="reveal-line block font-bold tracking-[-0.03em] leading-[0.95] text-cream"
                style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
              >
                My <span className="text-taupe">Work</span>
              </h1>
            </div>
            <div className="overflow-clip">
              <p className="reveal-line block mt-8 text-[0.9rem] leading-[1.7] text-taupe max-w-xl">
                A selection of projects spanning web development, UI/UX design
                and mobile applications.
              </p>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div ref={gridRef} className="section pt-16">
          <div className="grid grid-cols-1 gap-x-6 gap-y-14">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="proj-card group opacity-0 flex gap-20"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden mb-5 bg-light w-1/2"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover aspect-video transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[rgba(26,26,26,0.55)]">
                    <span className="label text-cream">View project</span>
                  </div>
                </div>
                <div className="w-full">
                  {/* Info row */}
                  <div
                    className="flex items-start justify-between gap-4 pb-4 mb-4"
                    style={{
                      borderBottom:
                        "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)",
                      paddingBlock: "1rem",
                    }}
                  >
                    <div>
                      <h2 className="text-[1.15rem] font-semibold tracking-[-0.01em] text-[#1a1a1a] mb-1">
                        {project.title}
                      </h2>
                      <p className="label">{project.category}</p>
                    </div>
                    <span className="label shrink-0 mt-0.5">
                      {project.year}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-[0.85rem] leading-[1.7] text-taupe mb-4"
                    style={{ paddingBlock: "0.25rem" }}
                  >
                    {project.description}
                  </p>

                  {/* Tech + links */}
                  <div
                    className="flex flex-wrap items-center gap-2 mb-4"
                    style={{ paddingBlock: "1rem" }}
                  >
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-filled text-[0.7rem] py-1 px-4"
                      >
                        View site ↗
                      </a>
                    )}
                    {project.links.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn text-[0.7rem] py-[0.45rem] px-4"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
