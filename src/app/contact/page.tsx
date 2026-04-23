"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inputBase = "w-full py-[0.9rem] bg-transparent border-b text-[#1a1a1a] text-[0.9rem] font-[var(--font-syne)] outline-none transition-colors duration-200 placeholder:text-[#c8c4be] focus:border-[#1a1a1a]";

export default function ContactPage() {
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        headingRef.current?.querySelectorAll(".reveal-line") ?? [],
        { y: "110%" },
        { y: "0%", duration: 0.9, stagger: 0.09, ease: "power3.out" }
      );

      tl.fromTo(leftRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        0.6
      );

      tl.fromTo(rightRef.current,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        0.7
      );
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <div className="bg-[#f5f3ef] min-h-screen">
      <Header />

      <main>
        {/* Heading */}
        <div
          ref={headingRef}
          className="section pb-12"
          style={{ borderBottom: "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)" }}
        >
          <div className="h-16" />
          <span className="label block mb-4">Get in touch</span>
          <div className="overflow-clip">
            <h1
              className="reveal-line block font-bold tracking-[-0.03em] leading-[0.95] text-[#1a1a1a]"
              style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
            >
              Let&apos;s talk
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="section">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 md:gap-24">

            {/* Left — contact info */}
            <div ref={leftRef} className="opacity-0 flex flex-col gap-12">
              <p className="text-[0.95rem] leading-[1.75] text-[#8c8680] max-w-[26rem]">
                Have a project in mind, a job offer, or just want to say hello?
                I&apos;d love to hear from you.
              </p>

              <div className="flex flex-col gap-6">
                {[
                  { label: "Email", value: "luisa.cerinogbeiwi@gmail.com", href: "mailto:luisa.cerinogbeiwi@gmail.com" },
                  { label: "Phone", value: "+39 377 318 3236", href: "tel:+393773183236" },
                  { label: "Location", value: "Milan, Italy", href: undefined },
                ].map(({ label, value, href }) => (
                  <div key={label}>
                    <p className="label mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-[0.9rem] font-medium text-[#1a1a1a] hover:text-[#8c8680] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[0.9rem] font-medium text-[#1a1a1a]">{value}</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <p className="label mb-3">Socials</p>
                <div className="flex flex-col">
                  {[
                    { label: "GitHub", href: "https://github.com/browny26", handle: "@browny26" },
                    { label: "LinkedIn", href: "https://linkedin.com/in/luisa-cerin", handle: "luisa-cerin" },
                    { label: "Instagram", href: "https://instagram.com/lui_cerin", handle: "@lui_cerin" },
                  ].map(({ label, href, handle }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex justify-between items-center py-[0.85rem] no-underline"
                      style={{ borderBottom: "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)" }}
                    >
                      <span className="text-sm font-medium text-[#1a1a1a] group-hover/link:text-[#8c8680] transition-colors">
                        {label}
                      </span>
                      <span className="label">{handle} ↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div ref={rightRef} className="opacity-0">
              {status === "sent" ? (
                <div className="pt-8">
                  <div className="overflow-clip mb-4">
                    <p
                      className="font-bold tracking-[-0.03em] leading-none text-[#1a1a1a]"
                      style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
                    >
                      Message sent!
                    </p>
                  </div>
                  <p className="text-[0.9rem] text-[#8c8680] leading-[1.7]">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label block mb-2">Name *</label>
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        placeholder="Your name" required
                        className={inputBase}
                        style={{ borderBottomColor: "color-mix(in srgb, #1a1a1a 18%, transparent)" }}
                      />
                    </div>
                    <div>
                      <label className="label block mb-2">Email *</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="your@email.com" required
                        className={inputBase}
                        style={{ borderBottomColor: "color-mix(in srgb, #1a1a1a 18%, transparent)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label block mb-2">Subject</label>
                    <select
                      name="type" value={form.type} onChange={handleChange}
                      className={`${inputBase} cursor-pointer appearance-none`}
                      style={{ borderBottomColor: "color-mix(in srgb, #1a1a1a 18%, transparent)" }}
                    >
                      <option value="">Select a topic</option>
                      <option value="landing">Landing page</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="fullstack">Full-stack project</option>
                      <option value="job">Job offer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label block mb-2">Message *</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      placeholder="Tell me about your project or idea..." rows={6} required
                      className={`${inputBase} resize-none`}
                      style={{ borderBottomColor: "color-mix(in srgb, #1a1a1a 18%, transparent)" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn btn-filled self-start"
                  >
                    {status === "sending" ? "Sending..." : "Send message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
