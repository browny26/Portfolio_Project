"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/PageTransition";
import { REDUCED_MOTION, useMediaQuery } from "@/components/useMediaQuery";
import { useI18n } from "@/i18n/provider";

gsap.registerPlugin(ScrollTrigger);

// How often the preview moves on to the next project while the pointer rests
// on the banner.
const CYCLE_MS = 900;

export default function ProjectsBanner() {
  const { t, href } = useI18n();
  const bannerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // The preview follows a mouse, so it only exists where there is one — and not
  // for anyone who asked for less motion. On touch screens the banner stays
  // the plain link it always was.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useMediaQuery(REDUCED_MOTION);
  const withPreview = canHover && !reduced;

  const previews = t.projects.filter((p) => !p.image.endsWith(".svg"));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: bannerRef.current, start: "top 85%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  // A project cover rides under the pointer while it is on the banner: it
  // trails the pointer slightly, leans into fast movements and, every
  // CYCLE_MS, wipes up to the next project.
  useEffect(() => {
    const banner = bannerRef.current;
    const link = linkRef.current;
    const preview = previewRef.current;
    if (!withPreview || !banner || !link || !preview) return;

    const shots = Array.from(preview.children) as HTMLElement[];
    let current = 0;
    let timer = 0;
    let settle = 0;
    let lastX: number | null = null;
    let shown = false;

    const ctx = gsap.context(() => {
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0 });
    });
    const moveX = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });
    const lean = gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3.out" });

    const next = () => {
      const previous = shots[current];
      current = (current + 1) % shots.length;
      shots.forEach((shot) => (shot.style.zIndex = "0"));
      previous.style.zIndex = "1";
      shots[current].style.zIndex = "2";
      gsap.fromTo(
        shots[current],
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65, ease: "power4.inOut" },
      );
    };

    const show = (visible: boolean) => {
      if (visible === shown) return;
      shown = visible;
      gsap.to(preview, {
        scale: visible ? 1 : 0,
        duration: visible ? 0.55 : 0.4,
        ease: visible ? "power3.out" : "power3.in",
        overwrite: "auto",
      });
      window.clearInterval(timer);
      if (visible) timer = window.setInterval(next, CYCLE_MS);
    };

    const onMove = (event: PointerEvent) => {
      const box = banner.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      if (lastX === null) {
        gsap.set(preview, { x, y });
        moveX(x, x);
        moveY(y, y);
      }
      moveX(x);
      moveY(y);
      lean(gsap.utils.clamp(-12, 12, (x - (lastX ?? x)) * 0.6));
      lastX = x;
      window.clearTimeout(settle);
      settle = window.setTimeout(() => lean(0), 90);
      show(true);
    };

    const onLeave = () => {
      lastX = null;
      show(false);
    };

    link.addEventListener("pointermove", onMove);
    link.addEventListener("pointerleave", onLeave);
    return () => {
      link.removeEventListener("pointermove", onMove);
      link.removeEventListener("pointerleave", onLeave);
      window.clearInterval(timer);
      window.clearTimeout(settle);
      gsap.killTweensOf([preview, ...shots]);
      ctx.revert();
    };
  }, [withPreview]);

  const handleEnter = () => {
    gsap.to(arrowRef.current, { x: 8, duration: 0.3, ease: "power2.out" });
  };
  const handleLeave = () => {
    gsap.to(arrowRef.current, { x: 0, duration: 0.4, ease: "power2.out" });
  };

  return (
    <div className="bg-[#1a1a1a] w-full">
      <div
        ref={bannerRef}
        id="projects"
        className="scroll-mt-24"
        style={{
          position: "relative",
          // Above the sections that follow, which the preview can overhang.
          zIndex: 5,
          borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
          opacity: 0,
        }}
      >
        <TransitionLink
          ref={linkRef}
          href={href("/projects")}
          label={t.projectsBanner.title}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="block no-underline"
        >
          <div className="section flex items-center justify-between gap-8 cursor-pointer">
            {/* Left */}
            <div>
              <span className="label block mb-3">{t.projectsBanner.label}</span>
              <h2
                ref={textRef}
                className="flex items-baseline gap-6 flex-wrap m-0"
              >
                <span
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
                  className="font-bold tracking-[-0.03em] leading-none text-cream"
                >
                  {t.projectsBanner.title}
                </span>
                <span
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
                  className="font-bold tracking-[-0.03em] leading-none text-taupe italic"
                >
                  {t.projectsBanner.titleItalic}
                </span>
              </h2>
            </div>

            {/* Right arrow */}
            <span
              ref={arrowRef}
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              className="font-light text-cream shrink-0 leading-none"
            >
              →
            </span>
          </div>
        </TransitionLink>

        {withPreview && (
          <div
            ref={previewRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 overflow-hidden bg-light"
            style={{
              width: "clamp(180px, 22vw, 340px)",
              aspectRatio: "16 / 10",
              zIndex: 10,
              transform: "scale(0)",
            }}
          >
            {previews.map((project, i) => (
              <div
                key={project.slug}
                className="absolute inset-0"
                style={{ zIndex: i === 0 ? 2 : 0 }}
              >
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
