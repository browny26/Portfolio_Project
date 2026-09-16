"use client";

import { sendContactMessage } from "@/app/[lang]/contact/actions";
import ArrowLabel from "@/components/ArrowLabel";
import Footer, { curtainAbove } from "@/components/Footer";
import { useCurtainOpen } from "@/components/pageCurtain";
import { useI18n } from "@/i18n/provider";
import { contactSubjects, type ContactSubject } from "@/i18n/types";
import gsap from "gsap";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const EMAIL = "luisa.cerinogbeiwi@gmail.com";
const MAX_MESSAGE = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormState = {
  name: string;
  email: string;
  subject: ContactSubject | "";
  message: string;
  /** Honeypot, see the hidden field at the end of the form. */
  company: string;
};
type RequiredField = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent";

const EMPTY: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

function findErrors(form: FormState): Record<RequiredField, boolean> {
  return {
    name: !form.name.trim(),
    email: !EMAIL_PATTERN.test(form.email.trim()),
    message: !form.message.trim(),
  };
}

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ContactContent() {
  const { t, lang } = useI18n();
  const c = t.contactPage;
  // Arriving through the page curtain, the entrance waits for it to lift.
  const curtainOpen = useCurtainOpen();

  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const emailTextRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const hintTimer = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredField, boolean>>
  >({});
  const [status, setStatus] = useState<Status>("idle");
  const [sendFailed, setSendFailed] = useState(false);
  // `n` changes on every swap, so copying twice in a row still replays it.
  const [hint, setHint] = useState({
    kind: "idle" as "idle" | "copied" | "selected",
    n: 0,
  });

  useEffect(() => {
    if (!curtainOpen) return;
    const ctx = gsap.context(() => {
      const columns = [leftRef.current, rightRef.current];
      if (reducedMotion()) {
        gsap.set(columns, { opacity: 1 });
        return;
      }
      const heading = headingRef.current;
      gsap
        .timeline({ delay: 0.25 })
        .fromTo(
          heading?.querySelectorAll(".reveal-line") ?? [],
          { y: "110%" },
          { y: "0%", duration: 0.9, stagger: 0.09, ease: "power3.out" },
        )
        .fromTo(
          heading?.querySelectorAll(".contact-rise") ?? [],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out" },
          0.45,
        )
        .fromTo(
          leftRef.current,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          0.6,
        )
        .fromTo(
          rightRef.current,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          0.7,
        );
    });
    return () => ctx.revert();
  }, [curtainOpen]);

  // The note under the address leaves upwards, and the new one comes in from
  // below once React has rendered its text.
  const swapHint = (kind: "idle" | "copied" | "selected") => {
    const next = () => setHint((h) => ({ kind, n: h.n + 1 }));
    if (!hintRef.current || reducedMotion()) return next();
    gsap.to(hintRef.current, {
      yPercent: -110,
      duration: 0.22,
      ease: "power3.in",
      overwrite: true,
      onComplete: next,
    });
  };

  useLayoutEffect(() => {
    if (hint.n === 0 || !hintRef.current || reducedMotion()) return;
    gsap.fromTo(
      hintRef.current,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.45, ease: "power3.out", overwrite: true },
    );
  }, [hint]);

  useEffect(() => () => window.clearTimeout(hintTimer.current), []);

  const copyEmail = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(EMAIL);
      copied = true;
    } catch {
      // No clipboard access: select the address so it can be copied by hand.
      const text = emailTextRef.current;
      const selection = window.getSelection();
      if (text && selection) {
        const range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    window.clearTimeout(hintTimer.current);
    swapHint(copied ? "copied" : "selected");
    hintTimer.current = window.setTimeout(() => swapHint("idle"), 2400);
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    // An error goes away as soon as the field is fixed, not on the next submit.
    const field = key as RequiredField;
    if (errors[field] && !findErrors(next)[field]) {
      setErrors((e) => ({ ...e, [key]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;

    const found = findErrors(form);
    setErrors(found);
    const inputs = { name: nameRef, email: emailRef, message: messageRef };
    const firstInvalid = (["name", "email", "message"] as const).find(
      (key) => found[key],
    );
    if (firstInvalid) {
      inputs[firstInvalid].current?.focus();
      return;
    }

    setSendFailed(false);
    setStatus("sending");
    const result = await sendContactMessage({ ...form, lang }).catch(
      () => ({ ok: false }) as const,
    );
    if (!result.ok) {
      setStatus("idle");
      setSendFailed(true);
      return;
    }

    // The form closes from the bottom before the confirmation takes its place.
    if (formRef.current && !reducedMotion()) {
      await gsap.to(formRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.6,
        ease: "power4.inOut",
      });
    }
    setStatus("sent");
  };

  const writeAgain = () => {
    setForm(EMPTY);
    setErrors({});
    setSendFailed(false);
    setStatus("idle");
  };

  const previousStatus = useRef(status);
  useLayoutEffect(() => {
    const previous = previousStatus.current;
    previousStatus.current = status;
    if (previous === status) return;

    if (status === "sent") {
      doneRef.current?.focus({ preventScroll: true });
      if (reducedMotion()) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".reveal-line",
          { y: "110%" },
          { y: "0%", duration: 0.9, stagger: 0.09, ease: "power3.out" },
        );
        gsap.fromTo(
          ".contact-again",
          { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 0.4, ease: "power2.out" },
        );
      }, doneRef);
      return () => ctx.revert();
    }

    if (previous === "sent") {
      nameRef.current?.focus({ preventScroll: true });
      if (reducedMotion()) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        );
      });
      return () => ctx.revert();
    }
  }, [status]);

  const hintText =
    hint.kind === "copied"
      ? c.emailCopied
      : hint.kind === "selected"
        ? c.emailSelected
        : c.copyEmail;

  const recap = c.sentRecap
    .replace("{subject}", form.subject ? c.subjects[form.subject] : c.noSubject)
    .replace("{count}", String(form.message.trim().length));

  const socials = [
    { label: "GitHub", href: "https://github.com/browny26", handle: "@browny26" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/luisa-cerin",
      handle: "luisa-cerin",
    },
    { label: c.cv, href: t.cvUrl, handle: c.cvValue },
  ];

  const describedBy = (...ids: (string | false | undefined)[]) =>
    ids.filter(Boolean).join(" ") || undefined;

  return (
    <div className="bg-cream min-h-screen">
      <main>
        <div style={curtainAbove}>
          {/* Heading, with the address as its second title. */}
          <div className="bg-[#1a1a1a] w-full">
            <div
              ref={headingRef}
              className="section"
              style={{ paddingBottom: "4rem" }}
            >
              <div className="h-16" />
              <span className="label block" style={{ marginBottom: "1rem" }}>
                {c.label}
              </span>
              <h1
                className="flex flex-wrap font-bold tracking-[-0.03em] leading-[0.95] text-cream"
                style={{ fontSize: "clamp(3rem, 8vw, 8rem)", columnGap: "0.24em" }}
              >
                <span className="block overflow-clip">
                  <span className="reveal-line block">{c.title}</span>
                </span>
                <span className="block overflow-clip">
                  <span className="reveal-line block text-taupe">
                    {c.titleAccent}
                  </span>
                </span>
              </h1>

              <div className="grid gap-4" style={{ marginTop: "3rem" }}>
                {/* Bottom padding keeps the hover underline inside the mask. */}
                <div className="overflow-clip" style={{ paddingBottom: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="reveal-line contact-email"
                    aria-describedby="contact-email-hint"
                  >
                    <span ref={emailTextRef} className="contact-email-text">
                      luisa.cerinogbeiwi@
                      <wbr />
                      gmail.com
                    </span>
                  </button>
                </div>
                <div className="contact-rise flex flex-wrap items-center gap-x-7 gap-y-2">
                  <span className="contact-hint-mask">
                    <span
                      ref={hintRef}
                      id="contact-email-hint"
                      aria-live="polite"
                      className="label contact-hint"
                      style={hint.kind === "copied" ? { color: "#f5f3ef" } : undefined}
                    >
                      {hintText}
                    </span>
                  </span>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="label link-underline hover:text-cream transition-colors"
                  >
                    <ArrowLabel text={c.openMail} />
                  </a>
                </div>
              </div>

              <dl
                className="contact-rise flex flex-wrap gap-x-16 gap-y-5"
                style={{
                  marginTop: "3rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid color-mix(in srgb, #f5f3ef 12%, transparent)",
                }}
              >
                <div className="grid gap-1">
                  <dt className="label">{c.status}</dt>
                  <dd className="text-[0.9rem] font-medium text-cream">
                    <span className="status-dot" aria-hidden="true" />
                    {c.statusValue}
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="label">{c.reply}</dt>
                  <dd className="text-[0.9rem] font-medium text-cream">
                    {c.replyValue}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Content */}
          <div className="section">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 md:gap-24">
              {/* Left — contact info */}
              <div ref={leftRef} className="opacity-0 flex flex-col gap-12">
                <p className="text-[0.95rem] leading-[1.75] text-[#8c8680] max-w-[26rem]">
                  {c.intro}
                </p>

                <dl className="flex flex-col gap-6">
                  <div className="grid gap-1">
                    <dt className="label">{c.phone}</dt>
                    <dd>
                      <a
                        href="tel:+393773183236"
                        className="text-[0.9rem] font-medium text-[#1a1a1a] hover:text-[#8c8680] transition-colors"
                      >
                        +39 377 318 3236
                      </a>
                    </dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="label">{c.location}</dt>
                    <dd className="text-[0.9rem] font-medium text-[#1a1a1a]">
                      {c.locationValue}
                    </dd>
                  </div>
                </dl>

                <div>
                  <p className="label" style={{ marginBottom: "0.75rem" }}>
                    {c.socials}
                  </p>
                  <div className="flex flex-col">
                    {socials.map(({ label, href, handle }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link-row"
                      >
                        <span className="text-sm font-medium">{label}</span>
                        <span className="label">
                          <ArrowLabel text={`${handle} ↗`} />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div ref={rightRef} className="opacity-0">
                {status === "sent" ? (
                  <div
                    ref={doneRef}
                    tabIndex={-1}
                    className="grid gap-4 outline-none"
                    style={{ paddingTop: "1rem" }}
                  >
                    <div className="overflow-clip">
                      <p
                        className="reveal-line font-bold tracking-[-0.03em] leading-none text-[#1a1a1a]"
                        style={{
                          fontSize: "clamp(2rem, 5vw, 3.5rem)",
                          paddingBottom: "0.1em",
                        }}
                      >
                        {c.sentTitle}
                      </p>
                    </div>
                    <div className="overflow-clip">
                      <p className="reveal-line text-[0.9rem] text-[#8c8680] leading-[1.7] max-w-[34rem]">
                        {c.sentBody}
                      </p>
                    </div>
                    <div className="overflow-clip">
                      <p
                        className="reveal-line label"
                        style={{
                          paddingTop: "1rem",
                          borderTop:
                            "1px solid color-mix(in srgb, #1a1a1a 12%, transparent)",
                        }}
                      >
                        {recap}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={writeAgain}
                      className="contact-again btn justify-self-start"
                      style={{ marginTop: "1rem" }}
                    >
                      {c.again}
                    </button>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    noValidate
                    className="relative flex flex-col gap-8"
                  >
                    <h2 className="text-[1.15rem] font-semibold tracking-[-0.01em] text-[#1a1a1a]">
                      {c.formTitle}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
                      <Field
                        id="contact-name"
                        label={c.nameLabel}
                        error={errors.name ? c.errors.name : undefined}
                      >
                        <input
                          ref={nameRef}
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          maxLength={120}
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder={c.namePlaceholder}
                          aria-invalid={errors.name || undefined}
                          aria-describedby={describedBy(errors.name && "contact-name-error")}
                          className="field-input"
                        />
                      </Field>
                      <Field
                        id="contact-email"
                        label={c.emailLabel}
                        error={errors.email ? c.errors.email : undefined}
                      >
                        <input
                          ref={emailRef}
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          maxLength={254}
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder={c.emailPlaceholder}
                          aria-invalid={errors.email || undefined}
                          aria-describedby={describedBy(errors.email && "contact-email-error")}
                          className="field-input"
                        />
                      </Field>
                    </div>

                    <fieldset className="choice-group">
                      <legend className="label">{c.subjectLabel}</legend>
                      <div className="choices">
                        {contactSubjects.map((key) => (
                          <label key={key} className="choice">
                            <input
                              type="radio"
                              name="subject"
                              value={key}
                              checked={form.subject === key}
                              onChange={() => update("subject", key)}
                            />
                            <span>{c.subjects[key]}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Field
                      id="contact-message"
                      label={c.messageLabel}
                      error={errors.message ? c.errors.message : undefined}
                      foot={
                        <span id="contact-message-count" className="label field-count">
                          {form.message.length} / {MAX_MESSAGE}
                        </span>
                      }
                    >
                      <textarea
                        ref={messageRef}
                        id="contact-message"
                        name="message"
                        rows={5}
                        maxLength={MAX_MESSAGE}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        placeholder={c.messagePlaceholder}
                        aria-invalid={errors.message || undefined}
                        aria-describedby={describedBy(
                          errors.message && "contact-message-error",
                          "contact-message-count",
                        )}
                        className="field-input"
                      />
                    </Field>

                    {/* Honeypot: off-screen and out of the tab order, so only
                        bots fill it in. The server then drops the message. */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-10000px",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                      }}
                    >
                      <label htmlFor="contact-company">Company</label>
                      <input
                        id="contact-company"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col items-start gap-4">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="btn btn-filled disabled:cursor-progress"
                      >
                        <span className="send-roll" data-busy={status === "sending"}>
                          <span aria-hidden={status === "sending"}>
                            <ArrowLabel text={c.send} />
                          </span>
                          <span aria-hidden={status !== "sending"}>
                            {c.sending}
                            <span className="sending-dots" aria-hidden="true" />
                          </span>
                        </span>
                      </button>
                      {sendFailed && (
                        <p role="alert" className="field-error max-w-[30rem]">
                          {c.errors.send}
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer compact />
      </main>
    </div>
  );
}

/** A labelled control with the line that draws on focus and room for an error. */
function Field({
  id,
  label,
  error,
  foot,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  foot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={error ? "field is-error" : "field"}>
      <label htmlFor={id} className="label field-label">
        {label}
      </label>
      <div className="field-control">
        {children}
        <span className="field-line" aria-hidden="true" />
      </div>
      <div className="field-foot">
        {error && (
          <p id={`${id}-error`} className="field-error">
            {error}
          </p>
        )}
        {foot}
      </div>
    </div>
  );
}
