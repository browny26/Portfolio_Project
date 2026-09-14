const TRAILING_ARROW = /\s*([→↗])\s*$/;

/**
 * A label that ends in → or ↗ ("Scrivimi →", "Vai al sito ↗") rendered with
 * the arrow in its own sliding window: on hover of the surrounding link or
 * button the arrow leaves and an identical one comes back in (see
 * `.arrow-swap` in globals.css). Labels without a trailing arrow render as
 * plain text, so this can wrap any dictionary string safely.
 */
export default function ArrowLabel({ text }: { text: string }) {
  const match = text.match(TRAILING_ARROW);
  if (!match || match.index === undefined) return <>{text}</>;

  const arrow = match[1];
  return (
    <span className="arrow-label">
      {text.slice(0, match.index)}
      {/* Read once by screen readers as part of the label text is enough:
          the two copies of the arrow are decoration. */}
      <span
        className={arrow === "↗" ? "arrow-swap arrow-swap-up" : "arrow-swap"}
        aria-hidden="true"
      >
        <span>{arrow}</span>
        <span>{arrow}</span>
      </span>
    </span>
  );
}
