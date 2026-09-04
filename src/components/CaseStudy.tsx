"use client";

import Footer from "@/components/Footer";
import type { CaseStudy as CaseStudyData, Project } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  project: Project & { caseStudy: CaseStudyData };
  /** 1-based position among the projects that have a case study */
  index: number;
  next: Project | null;
};

const rule = "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)";
const bodyColor = "color-mix(in srgb, #1a1a1a 72%, #f5f3ef)";
const imageSizes = "(max-width: 768px) 100vw, 1376px";

function isRealLink(href?: string) {
  return Boolean(href && href !== "#");
}

function Row({
  label,
  children,
  paddingBottom = "3rem",
}: {
  label: string;
  children: ReactNode;
  paddingBottom?: string;
}) {
  return (
    <div
      className="cs-reveal grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 md:gap-8"
      style={{
        borderTop: rule,
        paddingTop: "2.5rem",
        paddingBottom,
        opacity: 0,
      }}
    >
      <span className="label">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <Row label={label} paddingBottom="1.5rem">
      <h2
        className="font-bold tracking-[-0.03em] text-[#1a1a1a]"
        style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)", lineHeight: 1.05 }}
      >
        {title}
      </h2>
    </Row>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[0.95rem] leading-[1.75] max-w-2xl"
      style={{ color: bodyColor, marginBottom: "1rem" }}
    >
      {children}
    </p>
  );
}

function Figure({
  image,
  priority = false,
}: {
  image: CaseStudyData["hero"];
  priority?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden bg-light"
      style={{ aspectRatio: image.aspect }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={imageSizes}
        className="object-cover"
      />
    </div>
  );
}

export default function CaseStudy({ project, index, next }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cs = project.caseStudy;

  const links = [
    isRealLink(project.links.live)
      ? { label: "View site ↗", href: project.links.live!, filled: true }
      : null,
    isRealLink(project.links.repo)
      ? { label: "GitHub →", href: project.links.repo!, filled: false }
      : null,
  ].filter((l): l is NonNullable<typeof l> => l !== null);

  const meta = [
    { label: "Role", value: cs.role },
    { label: "Type", value: cs.client },
    { label: "Year", value: cs.timeline },
    { label: "Category", value: project.category },
  ];

  // An odd number of gallery images opens with one full-width shot; the rest go in pairs.
  const galleryLead = cs.gallery.length % 2 === 1 ? cs.gallery[0] : null;
  const galleryPairs = galleryLead ? cs.gallery.slice(1) : cs.gallery;

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

      gsap.fromTo(
        headingRef.current?.querySelectorAll(".hero-meta") ?? [],
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.7,
        },
      );

      rootRef.current?.querySelectorAll(".cs-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-cream min-h-screen">
      <main>
        {/* Hero */}
        <div className="bg-[#1a1a1a] w-full">
          <div
            ref={headingRef}
            className="section"
            style={{ paddingBottom: "10rem" }}
          >
            <div className="h-16" />

            <div
              className="hero-meta flex items-center justify-between gap-4"
              style={{ opacity: 0, marginBottom: "1.5rem" }}
            >
              <Link
                href="/projects"
                className="label hover:text-cream transition-colors"
                style={{ textDecoration: "none" }}
              >
                ← All projects
              </Link>
              <span className="label">
                Case study · {String(index).padStart(2, "0")}
              </span>
            </div>

            <div className="overflow-clip">
              <h1
                className="reveal-line block font-bold tracking-[-0.03em] leading-[0.95] text-cream"
                style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
              >
                {project.title}
              </h1>
            </div>
            <div className="overflow-clip">
              <p
                className="reveal-line block text-[0.95rem] leading-[1.7] text-taupe max-w-xl"
                style={{ marginTop: "1.5rem" }}
              >
                {cs.tagline}
              </p>
            </div>

            <div
              className="hero-meta grid grid-cols-2 md:grid-cols-4 gap-6"
              style={{
                opacity: 0,
                marginTop: "3rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(245,243,239,0.1)",
              }}
            >
              {meta.map(({ label, value }) => (
                <div key={label}>
                  <p className="label" style={{ marginBottom: "0.35rem" }}>
                    {label}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "rgba(245,243,239,0.85)" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="hero-meta flex flex-wrap items-center gap-2"
              style={{ opacity: 0, marginTop: "1.75rem" }}
            >
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="tag"
                  style={{ borderColor: "rgba(245,243,239,0.2)" }}
                >
                  {t}
                </span>
              ))}
            </div>

            {links.length > 0 && (
              <div
                className="hero-meta flex flex-wrap gap-3"
                style={{ opacity: 0, marginTop: "2rem" }}
              >
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      l.filled
                        ? "btn btn-filled-inverted text-[0.7rem] py-1 px-4"
                        : "btn text-[0.7rem] py-[0.45rem] px-4"
                    }
                    style={
                      l.filled
                        ? undefined
                        : { borderColor: "#f5f3ef", color: "#f5f3ef" }
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero image, overlapping the dark band */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="cs-reveal" style={{ marginTop: "-8rem", opacity: 0 }}>
            <Figure image={cs.hero} priority />
          </div>
        </div>

        <div className="section" style={{ paddingTop: "5rem" }}>
          {/* Overview */}
          <Row label="Overview">
            {cs.overview.map((p) => (
              <Body key={p}>{p}</Body>
            ))}
          </Row>

          {/* Challenge */}
          <Row label="The challenge">
            <Body>{cs.challenge.intro}</Body>
            <ul className="flex flex-col gap-1" style={{ marginTop: "1.5rem" }}>
              {cs.challenge.constraints.map((c) => (
                <li
                  key={c}
                  className="text-[0.85rem] leading-[1.6] text-taupe"
                >
                  — {c}
                </li>
              ))}
            </ul>
          </Row>

          {/* Process */}
          <SectionHead label="Process" title="How it came together" />
          {cs.process.map((step, i) => (
            <Row key={step.title} label={`0${i + 1}`}>
              <h3 className="text-[1.05rem] font-semibold text-[#1a1a1a]">
                {step.title}
              </h3>
              <div style={{ marginTop: "0.75rem", marginBottom: "2rem" }}>
                <Body>{step.body}</Body>
              </div>
              <Figure image={step.image} />
            </Row>
          ))}

          {/* Key decisions */}
          <SectionHead
            label="Key decisions"
            title="Choices that shaped the product"
          />
          <div
            className="cs-reveal grid grid-cols-1 md:grid-cols-3 gap-8"
            style={{ opacity: 0, paddingBottom: "3rem" }}
          >
            {cs.decisions.map((d) => (
              <div
                key={d.title}
                style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1.25rem" }}
              >
                <h3 className="text-[1.05rem] font-semibold text-[#1a1a1a]">
                  {d.title}
                </h3>
                <p className="label" style={{ marginTop: "1.25rem" }}>
                  Why
                </p>
                <p
                  className="text-[0.85rem] leading-[1.65]"
                  style={{ color: bodyColor, marginTop: "0.35rem" }}
                >
                  {d.why}
                </p>
                <p className="label" style={{ marginTop: "1rem" }}>
                  Trade-off
                </p>
                <p
                  className="text-[0.85rem] leading-[1.65]"
                  style={{ color: bodyColor, marginTop: "0.35rem" }}
                >
                  {d.tradeoff}
                </p>
              </div>
            ))}
          </div>

          {/* Results */}
          <SectionHead label="Results" title="What changed" />
          <div
            className="cs-reveal grid grid-cols-1 md:grid-cols-3 gap-8"
            style={{ opacity: 0, paddingBottom: "3rem" }}
          >
            {cs.results.map((r) => (
              <div key={r.label} style={{ borderTop: rule, paddingTop: "1.25rem" }}>
                <p
                  className="font-bold tracking-[-0.03em] text-[#1a1a1a]"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1 }}
                >
                  {r.value}
                </p>
                <p
                  className="text-[0.85rem] leading-[1.6] text-taupe"
                  style={{ marginTop: "0.75rem" }}
                >
                  {r.label}
                </p>
              </div>
            ))}
          </div>

          {/* Gallery */}
          {cs.gallery.length > 0 && (
            <Row label="Gallery">
              {galleryLead && (
                <div className="cs-reveal" style={{ opacity: 0 }}>
                  <Figure image={galleryLead} />
                </div>
              )}
              {galleryPairs.length > 0 && (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  style={{ marginTop: galleryLead ? "1.5rem" : 0 }}
                >
                  {galleryPairs.map((img) => (
                    <div key={img.src} className="cs-reveal" style={{ opacity: 0 }}>
                      <Figure image={img} />
                    </div>
                  ))}
                </div>
              )}
            </Row>
          )}

          {/* Learnings */}
          <Row label="What I learned" paddingBottom="0">
            {cs.learnings.map((p) => (
              <Body key={p}>{p}</Body>
            ))}
          </Row>
        </div>

        {/* Next project */}
        <div
          className="section"
          style={{ borderTop: rule, paddingTop: "4rem", paddingBottom: "5rem" }}
        >
          <span className="label block" style={{ marginBottom: "1rem" }}>
            {next ? "Next project" : "More work"}
          </span>
          <Link
            href={next ? `/projects/${next.slug}` : "/projects"}
            className="group inline-flex items-baseline gap-4"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-bold tracking-[-0.03em] leading-[0.95] text-[#1a1a1a] group-hover:text-taupe transition-colors duration-300"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              {next ? next.title : "All projects"}
            </span>
            <span
              className="font-bold text-taupe transition-transform duration-300 group-hover:translate-x-2"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              →
            </span>
          </Link>
          {next && (
            <Link
              href="/projects"
              className="label block hover:text-[#1a1a1a] transition-colors"
              style={{ marginTop: "1.5rem", textDecoration: "none" }}
            >
              All projects
            </Link>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
