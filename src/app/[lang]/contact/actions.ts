"use server";

import { Resend } from "resend";
import { getDictionary } from "@/i18n/dictionaries";
import { contactSubjects, type ContactSubject } from "@/i18n/types";

export type ContactMessage = {
  name: string;
  email: string;
  /** One of `contactSubjects`, or "" when none was picked. */
  subject: string;
  message: string;
  /** Honeypot: hidden from people, so only bots fill it in. */
  company: string;
  /** Locale of the page the message was sent from. */
  lang: string;
};

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "unavailable" | "failed" };

const LIMITS = { name: 120, email: 254, message: 1000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/**
 * Sends the contact form to the inbox through Resend. Reachable by any POST,
 * not only the form, so every field is checked again here.
 */
export async function sendContactMessage(
  input: ContactMessage,
): Promise<ContactResult> {
  if (text(input?.company)) return { ok: true };

  const name = text(input?.name);
  const email = text(input?.email);
  const message = text(input?.message);
  const subject = text(input?.subject);
  const lang = text(input?.lang) || "it";

  const valid =
    name.length > 0 &&
    name.length <= LIMITS.name &&
    email.length <= LIMITS.email &&
    EMAIL.test(email) &&
    message.length > 0 &&
    message.length <= LIMITS.message &&
    (subject === "" || contactSubjects.includes(subject as ContactSubject));
  if (!valid) return { ok: false, error: "invalid" };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error(
      "Contact form: RESEND_API_KEY and CONTACT_TO_EMAIL must be set to send messages.",
    );
    return { ok: false, error: "unavailable" };
  }

  // The notification is for the site's owner, so it is always in Italian.
  const it = await getDictionary("it");
  const topic = subject
    ? it.contactPage.subjects[subject as ContactSubject]
    : "Senza oggetto";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from:
      process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Portfolio · ${topic} · ${name}`,
    text: [
      `Nome: ${name}`,
      `Email: ${email}`,
      `Oggetto: ${topic}`,
      `Pagina: /${lang}/contact`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("Contact form: Resend refused the message.", error);
    return { ok: false, error: "failed" };
  }
  return { ok: true };
}
