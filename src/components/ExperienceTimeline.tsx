"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/provider";
import type { Experience } from "@/i18n/types";

gsap.registerPlugin(ScrollTrigger);

/** "2025-02" -> months since year 0. "2025" counts from January and is marked fuzzy. */
function parseMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return { at: year * 12 + (month ? month - 1 : 0), fuzzy: !month };
}

const subscribe = () => () => {};

/**
 * Today as a month count, the day as a fraction. `null` on the server and
 * during hydration: the page is built once and served for months, so only the
 * visitor's clock knows where "today" is.
 */
function useToday() {
  return useSyncExternalStore(
    subscribe,
    () => {
      const d = new Date();
      return d.getFullYear() * 12 + d.getMonth() + Math.floor(((d.getDate() - 1) / 31) * 100) / 100;
    },
    () => null,
  );
}

/**
 * One row per role on a shared scale of months, from the January of the first
 * start to the end of the current year: overlapping roles read at a glance.
 * Hovering a row highlights it here and in the list below.
 */
export default function ExperienceTimeline({
  items,
  hot,
  onHot,
}: {
  items: Experience[];
  /** Index of the highlighted role, or null. */
  hot: number | null;
  onHot: (index: number | null) => void;
}) {
  const { t } = useI18n();
  const labels = t.experience.timeline;
  const ref = useRef<HTMLDivElement>(null);
  const today = useToday();
  const ready = today !== null;

  const rows = items.map((item, index) => {
    const start = parseMonth(item.start);
    return {
      index,
      // "Contactlab (Gruppo TeamSystem)" -> "Contactlab": the chart has a narrow label column.
      company: item.company.replace(/\s*\(.*\)\s*$/, ""),
      role: item.role,
      start: start.at,
      fuzzy: start.fuzzy,
      end: item.end ? parseMonth(item.end).at : null,
    };
  });

  const firstYear = Math.floor(Math.min(...rows.map((r) => r.start)) / 12);
  const lastYear = ready ? Math.floor(today / 12) : firstYear;
  const origin = firstYear * 12;
  const span = (lastYear + 1 - firstYear) * 12;
  const pct = (months: number) => `${(months / span) * 100}%`;
  const years = Array.from({ length: lastYear + 1 - firstYear }, (_, i) => firstYear + i);
  // Early in a year its label would sit on top of "today".
  const tickYears = years.filter((y) => !ready || y !== lastYear || today - y * 12 >= 3);

  useEffect(() => {
    const root = ref.current;
    if (!ready || !root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Bars draw in the order the roles started, not the order they are listed.
      const bars = gsap.utils
        .toArray<HTMLElement>(".timeline-bar")
        .sort((a, b) => Number(a.dataset.start) - Number(b.dataset.start));
      const todayAt = (bars.length - 1) * 0.12 + 0.8;

      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 80%" } })
        .fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.12, ease: "power4.inOut" }, 0)
        .fromTo(".timeline-tick:not(.is-today)", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 0.1)
        .fromTo(".timeline-today", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power3.out" }, todayAt)
        .fromTo(".timeline-tick.is-today", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, todayAt + 0.3)
        .fromTo(".timeline-dot", { scale: 0 }, { scale: 1, duration: 0.4, ease: "power3.out" }, todayAt + 0.3);
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={ref} style={{ marginTop: "3.5rem" }}>
      <div role="img" aria-label={labels.label}>
        {rows.map((row) => (
          <div
            key={row.index}
            className={`timeline-row${hot !== null && hot !== row.index ? " is-dimmed" : ""}`}
            onPointerEnter={() => onHot(row.index)}
            onPointerLeave={() => onHot(null)}
          >
            <div className="timeline-name">
              <strong>{row.company}</strong>
              <span className="label">{row.role}</span>
            </div>
            <div className="timeline-track">
              {ready && (
                <>
                  {years.slice(1).map((y) => (
                    <i key={y} className="timeline-year" style={{ left: pct(y * 12 - origin) }} />
                  ))}
                  <i className="timeline-today" style={{ left: pct(today - origin) }} />
                  <i
                    data-start={row.start}
                    className={`timeline-bar${row.fuzzy ? " is-fuzzy" : ""}`}
                    style={{
                      left: pct(row.start - origin),
                      width: pct((row.end ?? today) - row.start),
                    }}
                  />
                  {row.end === null && (
                    <span className="timeline-dot" style={{ left: pct(today - origin) }}>
                      <span className="status-dot" />
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        <div className="timeline-axis" aria-hidden="true">
          <span />
          <div className="timeline-ticks">
            {ready && (
              <>
                {tickYears.map((y) => (
                  <span key={y} className="timeline-tick label" style={{ left: pct(y * 12 - origin) }}>
                    {y}
                  </span>
                ))}
                <span className="timeline-tick label is-today" style={{ left: pct(today - origin) }}>
                  {labels.today}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="timeline-legend label">
        <span>
          <i className="timeline-swatch" aria-hidden="true" />
          {labels.exact}
        </span>
        <span>
          <i className="timeline-swatch is-fuzzy" aria-hidden="true" />
          {labels.yearOnly}
        </span>
        <span>
          <span className="status-dot" aria-hidden="true" />
          {labels.ongoing}
        </span>
      </div>
    </div>
  );
}
