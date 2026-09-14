"use client";

import ArrowLabel from "@/components/ArrowLabel";
import Footer, { curtainAbove } from "@/components/Footer";
import { TransitionLink } from "@/components/PageTransition";
import { useCurtainOpen } from "@/components/pageCurtain";
import { useI18n } from "@/i18n/provider";
import type { CaseStudy as CaseStudyData, Project } from "@/i18n/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode, useEffect, useMemo, useRef } from "react";

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

// Counterparts for the dark band that holds Key decisions and Results.
const darkRule = "1px solid rgba(245, 243, 239, 0.12)";
const darkBodyColor = "rgba(245, 243, 239, 0.72)";
const darkLabelColor = "rgba(245, 243, 239, 0.45)";

function isRealLink(href?: string) {
  return Boolean(href && href !== "#");
}

function Row({
  label,
  children,
  paddingBottom = "3rem",
  onDark = false,
}: {
  label: string;
  children: ReactNode;
  paddingBottom?: string;
  /** On the dark band the rule and the label have to invert. */
  onDark?: boolean;
}) {
  return (
    <div
      className="cs-reveal grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 md:gap-8"
      style={{
        borderTop: onDark ? darkRule : rule,
        paddingTop: "2.5rem",
        paddingBottom,
        opacity: 0,
      }}
    >
      <span
        className="label"
        style={onDark ? { color: darkLabelColor } : undefined}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

function SectionHead({
  label,
  title,
  onDark = false,
}: {
  label: string;
  title: string;
  onDark?: boolean;
}) {
  return (
    <Row label={label} paddingBottom="1.5rem" onDark={onDark}>
      <h2
        className="font-bold tracking-[-0.03em]"
        style={{
          fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
          lineHeight: 1.05,
          color: onDark ? "#f5f3ef" : "#1a1a1a",
        }}
      >
        {title}
      </h2>
    </Row>
  );
}

/**
 * Editorial paragraph whose words light up one by one as the reader scrolls.
 * Same motor as the About section on the home — words at 0.18 opacity at rest,
 * GSAP scrub takes them to 1 across the row — but sized down: this is body
 * prose that has to stay readable, not a display statement. Applied only to
 * the load-bearing narrative paragraphs (Overview, My role); the rest of the
 * case study keeps the plain <Body> so the effect stays intentional.
 */
function RevealCopy({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => text.split(/\s+/), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // CSS resting state is 0.18 opacity; clear it so reduced-motion
      // readers get the full paragraph, not a permanently faded one.
      gsap.set(el.querySelectorAll("span"), { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const spans = el.querySelectorAll("span");
      if (!spans || spans.length === 0) return;
      gsap.to(spans, {
        opacity: 1,
        ease: "none",
        stagger: 0.35,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 62%",
          scrub: 0.4,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <p
      ref={ref}
      className="reveal-copy font-medium tracking-[-0.005em] text-[#1a1a1a]"
      style={{
        fontSize: "clamp(1.1rem, 1.7vw, 1.4rem)",
        lineHeight: 1.6,
        textWrap: "pretty",
        maxWidth: "42rem",
        marginBottom: "1.25rem",
      }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span>{word}</span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
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

/**
 * A Results value that counts up to its number the first time it enters view.
 * Only the digits in the string animate: the prefix ("~", "€") and suffix
 * ("%", " strade", " min → secondi") come along unchanged, so the final frame
 * matches the source string exactly. Values with no leading digits (e.g.
 * "Gmail · Outlook", "Idempotente") are left as static text — the regex
 * simply doesn't match and the effect is a no-op.
 */
const NUMERIC = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/;

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = useMemo(() => value.match(NUMERIC), [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;

    const [, prefix, numStr, suffix] = parsed;
    const target = parseFloat(numStr.replace(",", "."));
    const decimals = numStr.includes(".") || numStr.includes(",") ? 1 : 0;

    // Reset to 0 before the observer fires: the SSR/hydration output carries
    // the full value, and this is the first client tick that overrides it.
    // Results sit well below the fold on every case study, so the swap
    // happens off-screen — no visible flash for a normal top-of-page load.
    el.textContent = prefix + (decimals === 0 ? "0" : "0.0") + suffix;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = value;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          const start = performance.now();
          const duration = 1200;
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // Ease-out cubic: fast start, gentle land.
            const eased = 1 - Math.pow(1 - t, 3);
            const v = target * eased;
            const rendered =
              decimals === 0 ? Math.round(v).toString() : v.toFixed(1);
            el.textContent = prefix + rendered + suffix;
            if (t < 1) requestAnimationFrame(step);
            // Land on the source string so any character we don't understand
            // (thin spaces, non-breaking punctuation) matches at the end.
            else el.textContent = value;
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, parsed]);

  return <span ref={ref}>{value}</span>;
}

function Figure({
  image,
  eager = false,
}: {
  image: CaseStudyData["hero"];
  /** Set on the hero figure, which is the LCP element of a case study. */
  eager?: boolean;
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
        loading={eager ? "eager" : "lazy"}
        sizes={imageSizes}
        className="object-cover"
      />
    </div>
  );
}

/**
 * The process as a reading column next to one screenshot that stays put. The
 * step being read is at full strength and the others recede; when a new step
 * reaches the middle of the screen its screenshot wipes in over the previous
 * one, from below going down the page and from above coming back up.
 */
function ProcessSteps({ steps }: { steps: CaseStudyData["process"] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const articles = Array.from(root.querySelectorAll<HTMLElement>(".process-step"));
    const shots = Array.from(root.querySelectorAll<HTMLElement>(".process-shot"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setCount = (i: number) => {
      if (countRef.current) countRef.current.textContent = `${pad(i + 1)} / ${pad(steps.length)}`;
    };
    let active = 0;
    setCount(0);

    const activate = (i: number) => {
      if (i === active) return;
      const previous = active;
      active = i;
      articles.forEach((article, j) => article.classList.toggle("is-active", j === i));
      setCount(i);
      shots.forEach((shot) => (shot.style.zIndex = "0"));
      shots[previous].style.zIndex = "1";
      shots[i].style.zIndex = "2";
      if (reduced) return;
      gsap.fromTo(
        shots[i],
        {
          clipPath: i > previous ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          scale: 1.08,
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 0.8,
          ease: "power4.inOut",
          overwrite: "auto",
        },
      );
    };

    const ctx = gsap.context(() => {
      articles.forEach((article, i) => {
        ScrollTrigger.create({
          trigger: article,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) activate(i);
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [steps]);

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 md:gap-8"
      style={{ borderTop: rule, paddingTop: "2.5rem", paddingBottom: "3rem" }}
    >
      {/* Keeps the steps in the content column, aligned with the rows above. */}
      <span aria-hidden className="hidden md:block" />
      <div className="process-split">
        <div className="process-media">
          <div
            className="process-frame"
            style={{ aspectRatio: steps[0]?.image.aspect ?? "16/10" }}
          >
            {steps.map((step, i) => (
              <div
                key={step.image.src}
                className="process-shot"
                style={{ zIndex: i === 0 ? 2 : 0 }}
              >
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover"
                />
              </div>
            ))}
            <span ref={countRef} className="label process-count" aria-hidden />
          </div>
        </div>
        <div>
          {steps.map((step, i) => (
            <article
              key={step.title}
              className={i === 0 ? "process-step is-active" : "process-step"}
            >
              <span className="label">{pad(i + 1)}</span>
              <h3 className="text-[1.05rem] font-semibold text-[#1a1a1a]">
                {step.title}
              </h3>
              <Body>{step.body}</Body>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudy({ project, index, next }: Props) {
  const { t, href } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cs = project.caseStudy;
  // Arriving through the page curtain, the entrance waits for it to lift.
  const curtainOpen = useCurtainOpen();

  const links = [
    isRealLink(project.links.live)
      ? { label: t.caseStudy.viewSite, href: project.links.live!, filled: true }
      : null,
    isRealLink(project.links.repo)
      ? { label: t.caseStudy.github, href: project.links.repo!, filled: false }
      : null,
  ].filter((l): l is NonNullable<typeof l> => l !== null);

  const meta = [
    { label: t.caseStudy.role, value: cs.role },
    { label: t.caseStudy.type, value: cs.client },
    { label: t.caseStudy.year, value: cs.timeline },
    { label: t.caseStudy.category, value: project.category },
  ];

  // An odd number of gallery images opens with one full-width shot; the rest go in pairs.
  const galleryLead = cs.gallery.length % 2 === 1 ? cs.gallery[0] : null;
  const galleryPairs = galleryLead ? cs.gallery.slice(1) : cs.gallery;

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

      // Metadata: the rule above it draws from the left, the labels come in
      // from the left, the values rise out of their own masks, then the stack.
      gsap
        .timeline({ delay: 0.6 })
        .fromTo(".cs-meta-rule", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power4.inOut" })
        .fromTo(
          ".cs-meta-label",
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" },
          0.4,
        )
        .fromTo(
          ".cs-meta-value",
          { y: "110%" },
          { y: "0%", duration: 0.8, stagger: 0.07, ease: "power3.out" },
          0.5,
        )
        .fromTo(
          ".cs-tag",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.03, ease: "none" },
          0.9,
        );

      // Cards stagger in per grid. They carry a backdrop-filter, so the
      // transform is cleared once the reveal is done: leaving one on the
      // element is asking the browser to resolve a filter against a
      // transformed box. Applies to both the dark glass cards
      // (Key Decisions, Results) and the cream-band constraint cards
      // (Challenge) — one selector, same gesture on both bands.
      rootRef.current?.querySelectorAll(".cs-card-grid").forEach((grid) => {
        gsap.fromTo(
          grid.querySelectorAll(".card, .constraint-card"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: grid, start: "top 88%" },
          },
        );
      });

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
  }, [curtainOpen]);

  return (
    <div ref={rootRef} className="bg-cream min-h-screen">
      <main>
        <div style={curtainAbove}>
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
                href={href("/projects")}
                className="label link-underline hover:text-cream transition-colors"
              >
                {t.caseStudy.allProjects}
              </Link>
              <span className="label">
                {t.caseStudy.counter} · {String(index).padStart(2, "0")}
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
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              style={{
                position: "relative",
                marginTop: "3rem",
                paddingTop: "1.5rem",
              }}
            >
              <i
                aria-hidden
                className="cs-meta-rule"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: "1px",
                  background: "rgba(245,243,239,0.1)",
                  transformOrigin: "left",
                  transform: "scaleX(0)",
                }}
              />
              {meta.map(({ label, value }) => (
                <div key={label}>
                  <p
                    className="label cs-meta-label"
                    style={{ marginBottom: "0.35rem", opacity: 0 }}
                  >
                    {label}
                  </p>
                  <div className="overflow-clip">
                    <p
                      className="cs-meta-value text-sm font-medium"
                      style={{
                        color: "rgba(245,243,239,0.85)",
                        transform: "translateY(110%)",
                      }}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex flex-wrap items-center gap-2"
              style={{ marginTop: "1.75rem" }}
            >
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="tag tag-inverted cs-tag"
                  style={{ opacity: 0 }}
                >
                  {tech}
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
                    <ArrowLabel text={l.label} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero image, overlapping the dark band */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="cs-reveal" style={{ marginTop: "-8rem", opacity: 0 }}>
            <Figure image={cs.hero} eager />
          </div>
        </div>

        <div className="section" style={{ paddingTop: "5rem" }}>
          {/* Overview — what the project is */}
          <Row label={t.caseStudy.overview}>
            {cs.overview.map((p) => (
              <RevealCopy key={p} text={p} />
            ))}
          </Row>

          {/* My role — what the author personally did. Rendered only when the
              case study provides it, so projects without a personal-role
              paragraph (e.g. shorter showcases) don't get an empty row. */}
          {cs.myRole && (
            <Row label={t.caseStudy.myRole}>
              <RevealCopy text={cs.myRole} />
            </Row>
          )}

          {/* Challenge */}
          <Row label={t.caseStudy.challenge}>
            <Body>{cs.challenge.intro}</Body>
            {/* Constraints as cards on the cream band. `cs-card-grid` is what
                the entrance stagger below hooks on; the grid holds up at 1–3
                columns depending on width so counts from 3 to 5 sit evenly. */}
            <div
              className="cs-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              style={{ marginTop: "1.5rem" }}
            >
              {cs.challenge.constraints.map((c, i) => (
                <div
                  key={c}
                  className="constraint-card"
                  style={{ opacity: 0 }}
                >
                  <span className="label constraint-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="text-[0.9rem] leading-[1.65]"
                    style={{ color: bodyColor }}
                  >
                    {c}
                  </p>
                </div>
              ))}
            </div>
          </Row>

          {/* Process */}
          <SectionHead label={t.caseStudy.process} title={t.caseStudy.processTitle} />
          <ProcessSteps steps={cs.process} />

        </div>

        {/* Key decisions and Results share one full-width dark band: the glass
            cards need it behind them, and the band carries the fade so its
            background stays inside the cards' backdrop root. */}
        <div className="stage">
          <div className="section" style={{ paddingTop: "4rem" }}>
            {/* Key decisions */}
            <SectionHead
              onDark
              label={t.caseStudy.decisions}
              title={t.caseStudy.decisionsTitle}
            />
            <div
              className="cs-card-grid grid grid-cols-1 md:grid-cols-3 gap-6"
              style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}
            >
              {cs.decisions.map((d) => (
                <div key={d.title} className="card" style={{ opacity: 0 }}>
                  <h3 className="text-[1.05rem] font-semibold text-cream">
                    {d.title}
                  </h3>
                  <p
                    className="label"
                    style={{ color: darkLabelColor, marginTop: "1.25rem" }}
                  >
                    {t.caseStudy.why}
                  </p>
                  <p
                    className="text-[0.85rem] leading-[1.65]"
                    style={{ color: darkBodyColor, marginTop: "0.35rem" }}
                  >
                    {d.why}
                  </p>
                  <p
                    className="label"
                    style={{ color: darkLabelColor, marginTop: "1rem" }}
                  >
                    {t.caseStudy.tradeoff}
                  </p>
                  <p
                    className="text-[0.85rem] leading-[1.65]"
                    style={{ color: darkBodyColor, marginTop: "0.35rem" }}
                  >
                    {d.tradeoff}
                  </p>
                </div>
              ))}
            </div>

            {/* Results */}
            <SectionHead
              onDark
              label={t.caseStudy.results}
              title={t.caseStudy.resultsTitle}
            />
            <div
              className="cs-card-grid grid grid-cols-1 md:grid-cols-2 gap-6"
              style={{ paddingTop: "2.5rem" }}
            >
              {cs.results.map((r) => (
                <div
                  key={r.label}
                  className="card flex flex-col justify-between"
                  style={{ opacity: 0 }}
                >
                  <p
                    className="font-bold tracking-[-0.03em] text-cream"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.25rem)",
                      lineHeight: 1.05,
                      // Some values are words rather than numbers.
                      overflowWrap: "break-word",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <Counter value={r.value} />
                  </p>
                  <p
                    className="text-[0.85rem] leading-[1.6]"
                    style={{ color: darkLabelColor, marginTop: "0.75rem" }}
                  >
                    {r.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section" style={{ paddingTop: "5rem" }}>
          {/* Gallery */}
          {cs.gallery.length > 0 && (
            <Row label={t.caseStudy.gallery}>
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
          <Row label={t.caseStudy.learnings} paddingBottom="0">
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
            {next ? t.caseStudy.nextProject : t.caseStudy.moreWork}
          </span>
          <TransitionLink
            href={href(next ? `/projects/${next.slug}` : "/projects")}
            label={next ? `${next.title} · ${t.caseStudy.counter}` : t.projectsPage.label}
            className="group inline-flex items-baseline gap-4"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-bold tracking-[-0.03em] leading-[0.95] text-[#1a1a1a] group-hover:text-taupe transition-colors duration-300"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              {next ? next.title : t.projectsPage.label}
            </span>
            <span
              className="font-bold text-taupe transition-transform duration-300 group-hover:translate-x-2"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              →
            </span>
          </TransitionLink>
          {next && (
            <Link
              href={href("/projects")}
              className="label block hover:text-[#1a1a1a] transition-colors"
              style={{ marginTop: "1.5rem", textDecoration: "none" }}
            >
              {t.projectsPage.label}
            </Link>
          )}
        </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
