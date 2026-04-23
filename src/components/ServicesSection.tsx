"use client";

import { services } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
          },
        );
      }

      const items = sectionRef.current?.querySelectorAll(".service-item");
      items?.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section"
      style={{
        borderTop: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
        paddingTop: "6rem",
      }}
    >
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <span className="label block mb-4">What I do</span>
          <div className="overflow-clip">
            <h2
              className="reveal-line block font-bold tracking-[-0.03em] text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Services
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {services.map((service, i) => (
          <div
            key={i}
            className="service-item flex flex-col md:flex-row gap-6 md:gap-16"
            style={{
              borderTop:
                i === 0
                  ? "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)"
                  : "none",
              borderBottom:
                "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)",
              paddingBlock: "2.5rem",
              opacity: 0,
            }}
          >
            <div className="md:w-12 shrink-0">
              <span className="label" style={{ color: "#c8c4be" }}>
                0{i + 1}
              </span>
            </div>
            <div className="md:w-56 shrink-0">
              <h3 className="text-[1.2rem] font-semibold tracking-[-0.01em] text-[#1a1a1a]">
                {service.title}
              </h3>
              <span className="label mt-1 block">{service.subtitle}</span>
            </div>
            <div className="flex-1">
              <p className="text-[0.9rem] leading-[1.7] text-taupe max-w-xl">
                {service.description}
              </p>
            </div>
            <div className="md:w-52 shrink-0 flex flex-wrap gap-2 content-start">
              {service.tech.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
