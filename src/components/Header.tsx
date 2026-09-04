"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cvUrl } from "@/lib/data";
import { useLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollToPlugin);

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/#services" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
];

const menuInfo: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}[] = [
  { label: "Status", value: "Available for projects" },
  {
    label: "Email",
    value: "luisa.cerinogbeiwi@gmail.com",
    href: "mailto:luisa.cerinogbeiwi@gmail.com",
  },
  {
    label: "Linkedin",
    value: "luisa-cerin",
    href: "https://linkedin.com/in/luisa-cerin",
    external: true,
  },
  { label: "CV", value: "Open PDF ↗", href: cvUrl, external: true },
  { label: "Location", value: "Milan, Italy" },
];

// The glass layer that appears once the page is scrolled. Blur is never
// transitioned (it steps visibly); the whole layer fades in with opacity.
const glass = {
  background: "rgba(245,243,239,0.55)",
  backdropFilter: "blur(14px) saturate(140%)",
  WebkitBackdropFilter: "blur(14px) saturate(140%)",
  border: "1px solid rgba(26,26,26,0.08)",
  borderRadius: "4px",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.55), 0 12px 32px -16px rgba(26,26,26,0.28)",
};

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lenisRef = useLenis();
  const initialPathname = useRef(pathname);

  // Pages whose hero is dark: the bar sits on #1a1a1a until the glass appears.
  const darkHero =
    pathname === "/contact" || pathname.startsWith("/projects");
  const onDark = menuOpen || (darkHero && !scrolled);
  const chrome = onDark ? "#f5f3ef" : "#1a1a1a";
  const glassVisible = scrolled && !menuOpen;

  useEffect(() => {
    const delay = initialPathname.current === "/" ? 2.4 : 0.2;
    gsap.fromTo(
      headerRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay },
    );
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      lenisRef?.current?.stop();
      gsap.to(overlayRef.current, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.75,
        ease: "power3.inOut",
      });
      gsap.fromTo(
        menuLinksRef.current?.querySelectorAll(".menu-item") ?? [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.55,
          ease: "power3.out",
          delay: 0.3,
        },
      );
    } else {
      lenisRef?.current?.start();
      gsap.to(overlayRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [menuOpen, lenisRef]);

  useEffect(
    () => () => {
      lenisRef?.current?.start();
    },
    [lenisRef],
  );

  // Escape closes the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== "/") return;
    const id = sessionStorage.getItem("pendingHash");
    if (!id) return;
    sessionStorage.removeItem("pendingHash");
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) lenisRef?.current?.scrollTo(el, { offset: -80 });
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname, lenisRef]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMenuOpen(false);

    if (href.startsWith("/#")) {
      if (pathname === "/") {
        e.preventDefault();
        const id = href.replace("/#", "");
        const el = document.getElementById(id);
        if (!el) return;
        setTimeout(() => {
          lenisRef?.current?.scrollTo(el, { offset: -80 });
        }, 400);
      } else {
        sessionStorage.setItem("pendingHash", href.replace("/#", ""));
      }
    }
  };

  const burgerLine = (width: string, extra: React.CSSProperties) => (
    <span
      style={{
        display: "block",
        width,
        height: "1px",
        background: chrome,
        transformOrigin: "center",
        transition:
          "transform 0.35s ease, opacity 0.2s ease, background 0.4s, width 0.25s ease",
        ...extra,
      }}
    />
  );

  return (
    <>
      {/* Header bar: centred with auto margins, inset from the edges once scrolled.
          The margin is inline because the global `* { margin: 0 }` reset in
          globals.css sits outside Tailwind's layers and overrides `mx-auto`. */}
      <header
        ref={headerRef}
        className="fixed left-0 right-0 z-50 flex w-full max-w-7xl items-center justify-between"
        style={{
          opacity: 0,
          marginInline: "auto",
          padding: "1.1rem 2rem",
          top: scrolled ? "1.5rem" : "0",
          width: scrolled ? "calc(100% - 2rem)" : "100%",
          transition: "top 0.45s ease, width 0.45s ease",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            ...glass,
            opacity: glassVisible ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="relative z-50 flex items-center gap-3"
          style={{ textDecoration: "none" }}
        >
          <Image
            src="/imgs/noun-y2k-spark-6764461.png"
            alt=""
            aria-hidden
            width={32}
            height={32}
          />
          <span
            className="label"
            style={{
              color: menuOpen ? "rgba(245,243,239,0.45)" : "#8c8680",
              transition: "color 0.4s",
            }}
          >
            LCO Studio
          </span>
        </Link>

        {/* Right side */}
        <div className="relative z-50 flex items-center gap-5">
          {/* Contact button, desktop only. Inverted on dark heroes. */}
          <Link
            href="/contact"
            className={`btn hidden md:inline-flex ${darkHero && !scrolled ? "btn-filled-inverted" : "btn-filled"}`}
            style={{
              fontSize: "0.72rem",
              padding: "0.55rem 1.1rem",
              opacity: menuOpen ? 0 : 1,
              transition:
                "opacity 0.3s, background 0.25s, color 0.25s, border-color 0.25s",
              pointerEvents: menuOpen ? "none" : "auto",
            }}
          >
            Get in touch
          </Link>

          {/* Burger with its label, all screens */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="z-50 flex items-center gap-3"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <span
              className="label"
              style={{ color: chrome, transition: "color 0.4s" }}
            >
              {menuOpen ? "Close" : "Menu"}
            </span>
            <span className="flex h-8 w-8 flex-col items-end justify-center gap-1.25">
              {burgerLine("1.4rem", {
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              })}
              {burgerLine("0.9rem", { opacity: menuOpen ? 0 : 1 })}
              {burgerLine("1.4rem", {
                transform: menuOpen
                  ? "translateY(-6px) rotate(-45deg)"
                  : "none",
              })}
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen overlay. Inert while closed so hidden links are not focusable. */}
      <div
        ref={overlayRef}
        id="site-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className="fixed inset-0 z-40 flex flex-col"
        style={{
          background: "#1a1a1a",
          clipPath: "inset(0 0 100% 0)",
          padding: "clamp(1.5rem, 4vw, 3.5rem)",
        }}
      >
        {/* Nav links */}
        <div
          ref={menuLinksRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "2rem",
          }}
        >
          {navLinks.map(({ label, href }, i) => (
            <div
              key={href}
              className="menu-item flex items-baseline gap-5"
              style={{
                opacity: 0,
                borderTop: "1px solid rgba(245,243,239,0.07)",
                padding: "0.9rem 0",
              }}
            >
              <span
                className="label shrink-0"
                style={{ color: "rgba(245,243,239,0.28)", minWidth: "2.2rem" }}
              >
                0{i + 1}
              </span>
              <Link
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="hover:text-taupe transition-colors duration-200"
                style={{
                  fontSize: "clamp(2.2rem, 6.5vw, 5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "#f5f3ef",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(245,243,239,0.07)" }} />
        </div>

        {/* Bottom info */}
        <div
          style={{
            borderTop: "1px solid rgba(245,243,239,0.1)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
          }}
          className="md:justify-between"
        >
          {menuInfo.map(({ label, value, href, external }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                className="label"
                style={{ color: "rgba(245,243,239,0.3)" }}
              >
                {label}
              </span>
              {href ? (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(245,243,239,0.65)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                  className="hover:text-cream transition-colors"
                >
                  {value}
                </a>
              ) : (
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(245,243,239,0.65)",
                    fontWeight: 500,
                  }}
                >
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
