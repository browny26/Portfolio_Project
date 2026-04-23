"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/#services" },
  { label: "Skills", href: "/#skills" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 },
    );
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleAnchor = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const id = href.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500"
      style={{ opacity: 0 }}
    >
      <div
        className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-500 ${
          scrolled ? "glass shadow-lg shadow-black/40" : "glass"
        }`}
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="mr-2 px-3 py-1.5 text-sm font-semibold text-white/90 hover:text-white transition-colors"
        >
          LC
        </Link>

        <div className="w-px h-4 bg-white/10" />

        {/* Nav links */}
        <div className="flex items-center gap-1 ml-2">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleAnchor(e, href)}
              className="px-3.5 py-1.5 text-sm font-medium text-white/60 hover:text-white rounded-full hover:bg-white/8 transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="w-px h-4 bg-white/10 ml-2" />

        {/* CTA */}
        <a
          href="mailto:luisa.cerinogbeiwi@gmail.com"
          className="ml-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "#fff",
          }}
        >
          Hire me
        </a>
      </div>
    </nav>
  );
}
