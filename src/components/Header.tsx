"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 2.4 },
    );
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
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
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(overlayRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power3.inOut",
      });
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMenuOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      setTimeout(() => {
        document
          .getElementById(href.replace("/#", ""))
          ?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
  };

  const isActive = (href: string) =>
    href === "/contact" ? pathname === "/contact" : false;

  return (
    <>
      {/* Header bar */}
      <header
        ref={headerRef}
        className="fixed top-0 left-1/2 z-50 flex items-center justify-between w-full max-w-7xl"
        style={{
          transform: "translateX(-50%)",
          opacity: 0,
          padding: "1.1rem 2rem",
          transition:
            "background 0.45s ease, border-color 0.45s ease, backdrop-filter 0.45s ease",
          background: scrolled ? "rgba(245,243,239,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 z-50 relative"
          style={{ textDecoration: "none" }}
        >
          <span
            className="label"
            style={{
              color: menuOpen ? "rgba(245,243,239,0.45)" : "#8c8680",
              transition: "color 0.4s",
            }}
          >
            LC Studio
          </span>
        </Link>

        {/* Center nav — desktop only */}
        <nav className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={`relative group inline-block ${isActive(href) ? "text-[#1a1a1a]" : "text-[#8c8680]"} hover:text-[#1a1a1a] transition-colors duration-200`}
              style={{ textDecoration: "none" }}
            >
              <span className="label" style={{ color: "inherit" }}>
                {label}
              </span>
              {/* Underline reveal */}
              <span
                className="absolute left-0 h-px bg-[#1a1a1a] transition-all duration-300 ease-out group-hover:w-full"
                style={{
                  bottom: "-3px",
                  width: isActive(href) ? "100%" : "0%",
                }}
              />
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 z-50 relative">
          {/* Contact button — desktop */}
          <Link
            href="/contact"
            className="hidden md:inline-flex btn"
            style={{
              fontSize: "0.72rem",
              padding: "0.55rem 1.1rem",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.3s",
              pointerEvents: menuOpen ? "none" : "auto",
            }}
          >
            Get in touch
          </Link>

          {/* Burger — all screens */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="z-50 flex flex-col justify-center items-end gap-[5px] w-8 h-8"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              style={{
                display: "block",
                width: "1.4rem",
                height: "1px",
                background: menuOpen ? "#f5f3ef" : "#1a1a1a",
                transition:
                  "transform 0.35s ease, background 0.4s, width 0.25s ease",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "0.9rem",
                height: "1px",
                background: menuOpen ? "#f5f3ef" : "#1a1a1a",
                transition:
                  "opacity 0.2s ease, background 0.4s, width 0.25s ease",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "1.4rem",
                height: "1px",
                background: menuOpen ? "#f5f3ef" : "#1a1a1a",
                transition:
                  "transform 0.35s ease, background 0.4s, width 0.25s ease",
                transformOrigin: "center",
                transform: menuOpen
                  ? "translateY(-6px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Full-screen overlay */}
      <div
        ref={overlayRef}
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
                className="label flex-shrink-0"
                style={{ color: "rgba(245,243,239,0.28)", minWidth: "2.2rem" }}
              >
                0{i + 1}
              </span>
              <Link
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="hover:text-[#8c8680] transition-colors duration-200"
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
          {[
            {
              label: "Status",
              value: "Available for projects",
              href: undefined,
            },
            {
              label: "Email",
              value: "luisa.cerinogbeiwi@gmail.com",
              href: "mailto:luisa.cerinogbeiwi@gmail.com",
            },
            { label: "Location", value: "Milan, Italy", href: undefined },
          ].map(({ label, value, href }) => (
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
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(245,243,239,0.65)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                  className="hover:text-[#f5f3ef] transition-colors"
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
