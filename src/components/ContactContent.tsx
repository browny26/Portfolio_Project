"use client";

import ArrowLabel from "@/components/ArrowLabel";
import Footer, { curtainAbove } from "@/components/Footer";
import { useI18n } from "@/i18n/provider";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const inputBase =
  "w-full py-[0.9rem] bg-transparent border-b text-[#1a1a1a] text-[0.9rem] font-[var(--font-syne)] outline-none transition-colors duration-200 placeholder:text-[#c8c4be] focus:border-[#1a1a1a]";

export default function ContactContent() {
  const { t } = useI18n();
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        headingRef.current?.querySelectorAll(".reveal-line") ?? [],
        { y: "110%" },
        { y: "0%", duration: 0.9, stagger: 0.09, ease: "power3.out" },
      );

      tl.fromTo(
        leftRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        0.6,
      );

      tl.fromTo(
        rightRef.current,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        0.7,
      );
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <div className="bg-cream min-h-screen">
      <main>
        <div style={curtainAbove}>
        {/* Heading */}
        <div className="bg-[#1a1a1a] w-full">
          <div
            ref={headingRef}
            className="section pb-12"
            style={{
              borderBottom:
                "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
            }}
          >
            <div className="h-16" />
            <span className="label block mb-4">{t.contactPage.label}</span>
            <div className="overflow-clip">
              <h1
                className="reveal-line block font-bold tracking-[-0.03em] leading-[0.95] text-cream"
                style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
              >
                {t.contactPage.title}{" "}
                <span className="text-taupe">{t.contactPage.titleAccent}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="section">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 md:gap-24">
            {/* Left — contact info */}
            <div ref={leftRef} className="opacity-0 flex flex-col gap-12">
              <p className="text-[0.95rem] leading-[1.75] text-[#8c8680] max-w-[26rem]">
                {t.contactPage.intro}
              </p>

              <div className="flex flex-col gap-6">
                {[
                  {
                    label: t.contactPage.email,
                    value: "luisa.cerinogbeiwi@gmail.com",
                    href: "mailto:luisa.cerinogbeiwi@gmail.com",
                  },
                  {
                    label: t.contactPage.phone,
                    value: "+39 377 318 3236",
                    href: "tel:+393773183236",
                  },
                  {
                    label: t.contactPage.location,
                    value: t.contactPage.locationValue,
                    href: undefined,
                  },
                ].map(({ label, value, href }) => (
                  <div key={label}>
                    <p className="label mb-1">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-[0.9rem] font-medium text-[#1a1a1a] hover:text-[#8c8680] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[0.9rem] font-medium text-[#1a1a1a]">
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <p className="label mb-3">{t.contactPage.socials}</p>
                <div className="flex flex-col">
                  {[
                    {
                      label: "GitHub",
                      href: "https://github.com/browny26",
                      handle: "@browny26",
                    },
                    {
                      label: "LinkedIn",
                      href: "https://linkedin.com/in/luisa-cerin",
                      handle: "luisa-cerin",
                    },
                    { label: t.contactPage.cv, href: t.cvUrl, handle: "PDF" },
                  ].map(({ label, href, handle }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex justify-between items-center py-[0.85rem] no-underline"
                      style={{
                        borderBottom:
                          "1px solid color-mix(in srgb, #1a1a1a 10%, transparent)",
                      }}
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
                      {t.contactPage.sentTitle}
                    </p>
                  </div>
                  <p className="text-[0.9rem] text-[#8c8680] leading-[1.7]">
                    {t.contactPage.sentBody}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label block mb-2">{t.contactPage.nameLabel}</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t.contactPage.namePlaceholder}
                        required
                        className={inputBase}
                        style={{
                          borderBottomColor:
                            "color-mix(in srgb, #1a1a1a 18%, transparent)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="label block mb-2">{t.contactPage.emailLabel}</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t.contactPage.emailPlaceholder}
                        required
                        className={inputBase}
                        style={{
                          borderBottomColor:
                            "color-mix(in srgb, #1a1a1a 18%, transparent)",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label block mb-2">{t.contactPage.subjectLabel}</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className={`${inputBase} cursor-pointer appearance-none`}
                      style={{
                        borderBottomColor:
                          "color-mix(in srgb, #1a1a1a 18%, transparent)",
                      }}
                    >
                      <option value="">
                        {t.contactPage.subjectPlaceholder}
                      </option>
                      <option value="landing">
                        {t.contactPage.subjects.landing}
                      </option>
                      <option value="ecommerce">
                        {t.contactPage.subjects.ecommerce}
                      </option>
                      <option value="fullstack">
                        {t.contactPage.subjects.fullstack}
                      </option>
                      <option value="job">{t.contactPage.subjects.job}</option>
                      <option value="other">
                        {t.contactPage.subjects.other}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="label block mb-2">{t.contactPage.messageLabel}</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t.contactPage.messagePlaceholder}
                      rows={6}
                      required
                      className={`${inputBase} resize-none`}
                      style={{
                        borderBottomColor:
                          "color-mix(in srgb, #1a1a1a 18%, transparent)",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn btn-filled self-start"
                  >
                    {status === "sending" ? t.contactPage.sending : <ArrowLabel text={t.contactPage.send} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        </div>

        <Footer />
      </main>
    </div>
  );
}
