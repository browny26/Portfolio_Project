"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { greetings, locales } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { markIntroDone } from "./introSignal";

/* A layout effect, so a skipped intro is gone before the browser paints rather
   than a frame later — that frame is long enough to read as a flash of the
   first greeting. `useLayoutEffect` does nothing during the server render, so
   the plain effect stands in there to keep React quiet. */
const useBeforePaint =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The intro runs on CSS transitions driven by the state below rather than on a
   timeline: every position it can be in is written in the markup, so the words
   are already stacked correctly before any script runs. Times are milliseconds. */

/** How long each greeting stays on screen. */
const HOLD = 850;
/** The swap: the greeting leaves upwards as the next one arrives from below. */
const SLIDE = 550;
/** Greetings and line fading out once the last greeting has had its beat. */
const FADE = 300;
/** The cream panel lifting away. */
const WIPE = 900;
/**
 * How far into the wipe the home page is told to start. The hero's lines are
 * then still rising when the panel clears them, instead of already in place.
 */
const HANDOFF = 350;

type Phase = "greeting" | "fading" | "wiping" | "done";

/* Session storage throws outright where site data is blocked, and the intro is
   not worth a broken page: a visitor without storage simply sees it every time. */
function introAlreadyShown() {
  try {
    return sessionStorage.getItem("introShown") === "true";
  } catch {
    return false;
  }
}

function rememberIntro() {
  try {
    sessionStorage.setItem("introShown", "true");
  } catch {
    // Nothing to remember it with; the intro plays again next navigation.
  }
}

export default function Intro() {
  const { lang } = useI18n();
  const introRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("greeting");
  const [index, setIndex] = useState(0);

  // The visitor's own language first, then the other one the site speaks. One
  // greeting each: the intro says hello twice and gets out of the way.
  const words = useMemo(
    () => [
      greetings[lang],
      ...locales.filter((l) => l !== lang).map((l) => greetings[l]),
    ],
    [lang],
  );

  // The last greeting arrives one slide after the final swap, and then holds
  // for the same beat as every other one before anything fades.
  const greetingsEnd = HOLD * words.length + SLIDE;

  useBeforePaint(() => {
    if (introAlreadyShown()) {
      // Hidden on the element rather than through state: a state update would
      // only land after the next paint. React never writes `display` back,
      // because the style prop below does not change while the intro is skipped.
      if (introRef.current) introRef.current.style.display = "none";
      markIntroDone();
      return;
    }

    const timers: number[] = [];
    const at = (ms: number, run: () => void) => {
      timers.push(window.setTimeout(run, ms));
    };

    for (let i = 1; i < words.length; i++) at(HOLD * i, () => setIndex(i));

    at(greetingsEnd, () => setPhase("fading"));
    at(greetingsEnd + FADE, () => setPhase("wiping"));
    at(greetingsEnd + FADE + HANDOFF, () => {
      rememberIntro();
      markIntroDone();
    });
    at(greetingsEnd + FADE + WIPE, () => setPhase("done"));

    return () => timers.forEach(clearTimeout);
  }, [words, greetingsEnd]);

  return (
    <div
      ref={introRef}
      className="intro"
      style={{
        zIndex: 1000,
        display: phase === "done" ? "none" : "flex",
        transform: phase === "wiping" ? "translateY(-100%)" : "translateY(0%)",
        transition: `transform ${WIPE}ms cubic-bezier(0.76, 0, 0.24, 1)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          opacity: phase === "greeting" ? 1 : 0,
          transition: `opacity ${FADE}ms ease`,
        }}
      >
        <div className="intro-mask">
          {/* Stepped in `em`, not in percentages: one step is exactly one word's
              height whatever the column measures. */}
          <div
            className="intro-words"
            style={{
              transform: `translateY(calc(${index} * -1.2em))`,
              transition: `transform ${SLIDE}ms cubic-bezier(0.76, 0, 0.24, 1)`,
            }}
          >
            {words.map((word, i) => (
              // The first and last greeting are the same word by design.
              <div key={`${word}-${i}`} className="intro-word">
                {word}
              </div>
            ))}
          </div>
        </div>

        <div
          className="intro-line"
          style={{
            animation: `intro-line ${greetingsEnd}ms cubic-bezier(0.4, 0, 0.2, 1) both`,
          }}
        />
      </div>
    </div>
  );
}
