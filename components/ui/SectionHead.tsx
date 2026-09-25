import type { ReactNode } from "react";
import { SplitText } from "@/components/text/SplitText";

/** Heading plus one supporting line. No eyebrow: the heading carries itself. */
export function SectionHead({
  title,
  children,
  id,
  className = "",
}: {
  title: string;
  children?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`grid max-w-[62rem] gap-[calc(var(--cell)*0.8)] ${className}`}>
      <SplitText as="h2" id={id} text={title} className="display text-[clamp(2.75rem,6.4vw,5.6rem)] text-ink" />
      {children ? (
        <p className="max-w-[56ch] text-[1.125rem] leading-relaxed text-ink-2" data-reveal="rise" style={{ "--d": "160ms" } as React.CSSProperties}>
          {children}
        </p>
      ) : null}
    </div>
  );
}
