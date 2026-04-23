"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Intro({ onComplete }: { onComplete: () => void }) {
  const introRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
        gsap.to(introRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete: () => {
            if (introRef.current) introRef.current.style.display = "none";
          },
        });
      },
    });

    // Animate counter 0 → 100
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(obj.val).toString().padStart(3, "0");
        }
      },
    }, 0);

    // Line expand
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
      0
    );

    tl.to([counterRef.current, lineRef.current], {
      opacity: 0,
      duration: 0.3,
    });
  }, [onComplete]);

  return (
    <div ref={introRef} className="intro" style={{ zIndex: 1000 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <span
          ref={counterRef}
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "#1a1a1a",
          }}
        >
          000
        </span>
        <div
          ref={lineRef}
          style={{
            width: "6rem",
            height: "1px",
            background: "#1a1a1a",
            transformOrigin: "left center",
          }}
        />
      </div>
    </div>
  );
}
