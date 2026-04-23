"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

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
          borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
          opacity: 0,
        }}
      >
        <Link
          href="/projects"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="block no-underline"
        >
          <div className="section flex items-center justify-between gap-8 cursor-pointer">
            {/* Left */}
            <div>
              <span className="label block mb-3">Selected work</span>
              <div
                ref={textRef}
                className="flex items-baseline gap-6 flex-wrap"
              >
                <span
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
                  className="font-bold tracking-[-0.03em] leading-none text-cream"
                >
                  Projects
                </span>
                <span
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
                  className="font-bold tracking-[-0.03em] leading-none text-taupe italic"
                >
                  &amp; work
                </span>
              </div>
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
        </Link>
      </div>
    </div>
  );
}
