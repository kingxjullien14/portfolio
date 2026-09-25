import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Unit } from "@/lib/data";
import { FlapDisplay } from "@/components/board/FlapDisplay";
import { Lamp } from "@/components/board/Lamp";
import { StampOnView } from "./StampOnView";

export type BayLayout = "split-left" | "split-right" | "wide";

const statusLine: Record<string, string> = {
  fathopes: "In production",
};

/**
 * One console bay per unit: a flap header, a recessed well holding the live
 * recreation, and the operator's handover note.
 */
export function Bay({
  unit,
  layout,
  screen,
  wellClassName = "",
}: {
  unit: Unit;
  layout: BayLayout;
  screen: ReactNode;
  wellClassName?: string;
}) {
  const recreated = unit.owner === "fathopes";
  // desktop-sized screens get a pannable viewport on phones
  const wide = unit.platform !== "MOBILE";
  const status = recreated ? statusLine.fathopes : unit.period;

  const well = (
    <figure className="m-0 min-w-0">
      <div className={`enamel-sunk screen-well ${wide ? "screen-well-wide" : ""} ${wellClassName}`} data-reveal="shutter">
        {wide ? (
          <div className="screen-pan" tabIndex={0} aria-label={`${unit.name} screen, scroll sideways to explore`}>
            <div className="screen-pan-inner">{screen}</div>
          </div>
        ) : (
          screen
        )}
        <StampOnView id={unit.id} />
      </div>
      <figcaption className="mt-3 text-[0.8125rem] text-ink-3">
        {wide ? <span className="md:hidden">Drag the screen sideways to explore. </span> : null}
        {recreated ? "Recreated with made-up data. The real screens hold customer information." : null}
      </figcaption>
    </figure>
  );

  const lead = (
    <div className="grid content-start gap-[calc(var(--cell)*0.7)]">
      <p className="max-w-[34ch] text-[1.3125rem] leading-[1.35] font-medium text-ink" data-reveal="rise">
        {unit.summary}
      </p>
      <p className="max-w-[58ch] text-ink-2 italic" data-reveal="rise" style={{ "--d": "80ms" } as React.CSSProperties}>
        {unit.note}
      </p>
    </div>
  );

  const detail = (
    <div className="grid content-start gap-[calc(var(--cell)*0.7)]">
      <ul className="grid max-w-[58ch] gap-2 text-[0.9375rem] text-ink-2" data-reveal="rise" style={{ "--d": "140ms" } as React.CSSProperties}>
        {unit.built.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-[0.6em] size-1.5 shrink-0 rounded-[1px] bg-ink-3" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5" data-reveal="rise" style={{ "--d": "200ms" } as React.CSSProperties}>
        {unit.tech.map((t) => (
          <span key={t} className="tag tag-light">
            {t}
          </span>
        ))}
      </div>
      {unit.links || unit.credit ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3" data-reveal="rise" style={{ "--d": "240ms" } as React.CSSProperties}>
          {unit.links?.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="keycap">
              {l.label}
              <ArrowUpRight weight="bold" className="size-3.5" aria-hidden />
            </a>
          ))}
          {unit.credit ? (
            <a href={unit.credit.href} target="_blank" rel="noreferrer" className="text-[0.8125rem] text-ink-3 underline decoration-line-strong hover:text-ink-2">
              {unit.credit.text}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const copy = (
    <div className="grid content-start gap-[calc(var(--cell)*0.9)]">
      {lead}
      {detail}
    </div>
  );

  return (
    <article id={unit.id} className="bay scroll-mt-20" aria-labelledby={`${unit.id}-title`}>
      <header className="bay-head">
        <h3 id={`${unit.id}-title`} className="sr-only">
          {unit.name}
        </h3>
        <div className="housing inline-flex p-[calc(var(--cell)*0.22)]" aria-hidden>
          <div className="well inline-flex px-[calc(var(--cell)*0.28)] py-[calc(var(--cell)*0.22)]">
            <FlapDisplay text={unit.board} length={14} cellClassName="cell-bay" intro="view" decorative />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-ink">
            <Lamp lit size="0.55rem" />
            {status}
          </span>
          <span className="tag">{unit.platform}</span>
          {recreated ? <span className="text-[0.875rem] text-ink-3">{unit.period}</span> : null}
        </div>
      </header>

      {layout === "wide" ? (
        <div className="grid grid-cols-1 gap-[calc(var(--cell)*1.4)]">
          {well}
          <div className="grid grid-cols-1 gap-[calc(var(--cell)*1.2)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            {lead}
            {detail}
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 items-start gap-[calc(var(--cell)*1.4)] ${
            unit.platform === "MOBILE"
              ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
              : layout === "split-left"
                ? "lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]"
                : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)]"
          }`}
        >
          {layout === "split-left" ? (
            <>
              {well}
              {copy}
            </>
          ) : (
            <>
              <div className="max-lg:order-2">{copy}</div>
              {well}
            </>
          )}
        </div>
      )}
    </article>
  );
}
