"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { closeCurtain, openCurtain } from "./pageCurtain";

type Go = (href: string, label: string) => void;

const TransitionContext = createContext<Go | null>(null);

/**
 * The curtain between pages: a dark panel rises with the same curve as the
 * menu overlay, names where you are going, and pulls away once the new route
 * has rendered underneath. Only links rendered with `TransitionLink` use it;
 * back/forward and every other link navigate as before.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const coverRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  // Set while the curtain is down and a navigation is on its way.
  const pendingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const failSafeRef = useRef(0);

  const lift = useCallback(() => {
    const cover = coverRef.current;
    const label = labelRef.current;
    if (!cover || !label) return;
    window.clearTimeout(failSafeRef.current);
    timelineRef.current?.kill();
    timelineRef.current = gsap
      .timeline()
      .to(label, { yPercent: -110, duration: 0.4, ease: "power3.in" }, 0.15)
      // The page below starts its own entrance as the curtain starts to move.
      .add(openCurtain, "-=0.1")
      .to(
        cover,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power4.inOut" },
        "<",
      )
      .set(cover, { display: "none" });
  }, []);

  const go = useCallback<Go>(
    (href, label) => {
      if (pendingRef.current) return;
      const cover = coverRef.current;
      const text = labelRef.current;
      const target = new URL(href, window.location.href).pathname;
      if (
        !cover ||
        !text ||
        target === window.location.pathname ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        router.push(href);
        return;
      }

      pendingRef.current = true;
      text.textContent = label;
      closeCurtain();
      timelineRef.current?.kill();
      timelineRef.current = gsap
        .timeline()
        .set(cover, { display: "grid", clipPath: "inset(100% 0% 0% 0%)" })
        .to(cover, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.inOut" })
        .fromTo(text, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: "power3.out" }, "-=0.25")
        .add(() => {
          router.push(href);
          // A route that never commits must not leave the screen covered.
          failSafeRef.current = window.setTimeout(() => {
            pendingRef.current = false;
            lift();
          }, 6000);
        });
    },
    [router, lift],
  );

  // The new route has rendered: lift the curtain off it.
  useEffect(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    lift();
  }, [pathname, lift]);

  useEffect(
    () => () => {
      timelineRef.current?.kill();
      window.clearTimeout(failSafeRef.current);
    },
    [],
  );

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        ref={coverRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          background: "#1a1a1a",
          display: "none",
          placeItems: "center",
          clipPath: "inset(100% 0% 0% 0%)",
        }}
      >
        <span style={{ display: "block", overflow: "clip" }}>
          <span
            ref={labelRef}
            className="label"
            style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.14em" }}
          />
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
  /** What the curtain says while it covers the screen, e.g. "Newmann · Case study". */
  label: string;
};

export function TransitionLink({ href, label, ...props }: TransitionLinkProps) {
  const go = useContext(TransitionContext);
  return (
    <Link
      href={href}
      {...props}
      onNavigate={
        go
          ? (event) => {
              event.preventDefault();
              go(href, label);
            }
          : undefined
      }
    />
  );
}
