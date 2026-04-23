"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollToPlugin);

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();

  const navLinks = [
    { label: "Projects", href: menuOpen ? "/projects" : "/#projects" },
    { label: "Services", href: "/#services" },
    { label: "Skills", href: "/#skills" },
    { label: "Experience", href: "/#experience" },
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash);

    updateHash(); // iniziale
    window.addEventListener("hashchange", updateHash);

    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navLinks
      .filter((l) => l.href.startsWith("/#"))
      .map((l) => document.getElementById(l.href.replace("/#", "")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveHash(`#${id}`);

            // aggiorna anche URL senza jump
            window.history.replaceState(null, "", `#${id}`);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section!));

    return () => observer.disconnect();
  }, [pathname]);

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

      const id = href.replace("/#", "");
      const el = document.getElementById(id);

      if (!el) return;

      setTimeout(() => {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: el,
            offsetY: 80,
          },
          ease: "power3.inOut",
        });
      }, 400);
    }
  };

  const isActive = (href: string) => {
    if (href === "/contact") return pathname === "/contact";

    if (href.startsWith("/#")) {
      return activeHash === href.replace("/", "");
    }

    return false;
  };

  return (
    <>
      {/* Header bar */}
      <header
        ref={headerRef}
        className="fixed left-1/2 z-50 flex items-center justify-between w-full max-w-7xl"
        style={{
          transform: "translateX(-50%)",
          opacity: 0,
          padding: "1.1rem 2rem",
          transition:
            "background 0.45s ease, border-color 0.45s ease, backdrop-filter 0.45s ease, top 0.45s ease, border-radius 0.45s ease",
          background:
            scrolled && !menuOpen ? "rgba(255,255,255,0.70)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
          top: scrolled ? "1.5rem" : "0",
          borderRadius: scrolled ? "4px" : "0",
          border:
            scrolled && !menuOpen
              ? "1px solid #ececec"
              : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 z-50 relative"
          style={{ textDecoration: "none" }}
        >
          <Image
            src="/imgs/noun-y2k-spark-6764461.png"
            alt="Background pattern"
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

        {/* Center nav — desktop only */}
        <nav className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={`relative group inline-block ${isActive(href) ? ((pathname === "/contact" || pathname === "/projects") && !scrolled ? "text-cream" : "text-[#1a1a1a]") : "text-taupe"} hover:text-[#1a1a1a] transition-colors duration-200`}
              style={{ textDecoration: "none" }}
            >
              <span className="label" style={{ color: "inherit" }}>
                {label}
              </span>
              {/* Underline reveal */}
              <span
                className={`absolute left-0 h-px ${(pathname === "/contact" || pathname === "/projects") && !scrolled ? "bg-cream" : "bg-[#1a1a1a]"} transition-all duration-300 ease-out group-hover:w-full`}
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
            className="hidden md:inline-flex btn btn-filled"
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
            className="z-50 flex flex-col justify-center items-end gap-1.25 w-8 h-8"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              style={{
                display: "block",
                width: "1.4rem",
                height: "1px",
                background:
                  menuOpen ||
                  ((pathname === "/contact" || pathname === "/projects") &&
                    !scrolled)
                    ? "#f5f3ef"
                    : "#1a1a1a",
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
                background:
                  menuOpen ||
                  ((pathname === "/contact" || pathname === "/projects") &&
                    !scrolled)
                    ? "#f5f3ef"
                    : "#1a1a1a",
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
                background:
                  menuOpen ||
                  ((pathname === "/contact" || pathname === "/projects") &&
                    !scrolled)
                    ? "#f5f3ef"
                    : "#1a1a1a",
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
            {
              label: "Linkedin",
              value: "luisa-cerin",
              href: "https://linkedin.com/in/luisa-cerin",
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
