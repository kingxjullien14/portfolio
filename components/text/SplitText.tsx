import type { CSSProperties, ElementType } from "react";

/**
 * Revelo-style headline: every word rises out of its own mask, staggered.
 * Pure CSS driven by Boot's observer; the real text stays readable to
 * assistive tech and search, and nothing is hidden without JavaScript.
 */
export function SplitText({
  text,
  as: Tag = "span",
  id,
  className = "",
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  /** ms before the first word moves */
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={`split ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="w">
              <span style={{ "--i": i } as CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
