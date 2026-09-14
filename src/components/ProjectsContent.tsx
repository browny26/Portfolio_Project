"use client";

import ArrowLabel from "@/components/ArrowLabel";
import Footer, { curtainAbove } from "@/components/Footer";
import { TransitionLink } from "@/components/PageTransition";
import { useCurtainOpen } from "@/components/pageCurtain";
import { useI18n } from "@/i18n/provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsContent() {
  const { t, href } = useI18n();
  const projects = t.projects;
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
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
  }, [curtainOpen]);

  return (
    <div className="bg-cream min-h-screen">
      <main>
        <div style={curtainAbove}>
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
            <span className="label block mb-4">{t.projectsPage.label}</span>
            <div className="overflow-clip">
              <h1
                className="reveal-line block font-bold tracking-[-0.03em] leading-[0.95] text-cream"
                style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
              >
                {t.projectsPage.title}{" "}
                <span className="text-taupe">{t.projectsPage.titleAccent}</span>
              </h1>
            </div>
            <div className="overflow-clip">
              <p className="reveal-line block mt-8 text-[0.9rem] leading-[1.7] text-taupe max-w-xl">
                {t.projectsPage.intro}
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
                    {project.tech.slice(0, 4).map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.caseStudy && (
                      <TransitionLink
                        href={href(`/projects/${project.slug}`)}
                        label={`${project.title} · ${t.caseStudy.counter}`}
                        className="btn btn-filled text-[0.7rem] py-1 px-4"
                      >
                        <ArrowLabel text={t.projectsPage.caseStudy} />
                      </TransitionLink>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn text-[0.7rem] py-[0.45rem] px-4"
                      >
                        <ArrowLabel text={t.projectsPage.viewSite} />
                      </a>
                    )}
                    {project.links.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn text-[0.7rem] py-[0.45rem] px-4"
                      >
                        <ArrowLabel text={t.projectsPage.github} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
