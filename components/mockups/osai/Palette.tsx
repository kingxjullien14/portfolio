"use client";

import { ArrowElbowDownLeft, ArrowsDownUp } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import s from "./osai.module.css";
import { COMMANDS, type Command } from "./data";
import { cx, f, Ico } from "./ui";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCOPES = ["all", "open", "resume", "workspaces", "run"];

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const at = text.toLowerCase().indexOf(q);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="font-medium text-(--o-accent)">{text.slice(at, at + q.length)}</span>
      {text.slice(at + q.length)}
    </>
  );
}

function Dialog({
  origin,
  onClose,
  onRun,
}: {
  origin: string;
  onClose: () => void;
  onRun: (c: Command) => void;
}) {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const q = query.trim().toLowerCase();
  const results = q
    ? COMMANDS.filter((c) => c.title.toLowerCase().includes(q) || (c.sub ?? "").toLowerCase().includes(q))
    : COMMANDS;
  const active = results.length ? Math.min(sel, results.length - 1) : -1;
  const optId = (i: number) => `${listId}-opt-${i}`;
  const t = { duration: reduced ? 0 : 0.16, ease: EASE };

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // any press outside the panel (the dimmed app, or the page) closes it
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [onClose]);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const n = results.length;
    if (e.key === "ArrowDown" && n) setSel((active + 1) % n);
    else if (e.key === "ArrowUp" && n) setSel((active - 1 + n) % n);
    else if (e.key === "Home" && n) setSel(0);
    else if (e.key === "End" && n) setSel(n - 1);
    else if (e.key === "Enter" && active >= 0) onRun(results[active]);
    else if (e.key === "Escape") onClose();
    else if (e.key !== "Tab") return;
    e.preventDefault();
    e.stopPropagation();
  };

  let lastGroup = "";

  return (
    <>
      <motion.div
        key="scrim"
        aria-hidden
        className="absolute inset-0 z-50 bg-black/50 backdrop-blur-[calc(var(--mu)*4)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={t}
      />
      <motion.div
        key="panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="absolute top-20 left-72.5 z-50 flex w-155 flex-col"
        style={{ transformOrigin: origin }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={t}
      >
        {/* the omnibar: a lone glowing pill that speaks mono */}
        <div className={cx(s.palBar, "flex items-center gap-3 rounded-full px-5 py-3")}>
          <span aria-hidden className={cx("shrink-0 font-mono font-semibold text-(--o-accent)", f.s15)}>
            ❯
          </span>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? optId(active) : undefined}
            aria-label="Launch, ask, or resume anything"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKey}
            placeholder="launch, ask, or resume anything…"
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent font-mono text-sm text-(--o-text) outline-none placeholder:text-(--o-faint)"
          />
          <span aria-hidden className={cx("shrink-0 font-mono text-(--o-faint) tabular-nums", f.s10)}>
            {results.length}
          </span>
          <kbd className={cx("shrink-0 rounded-sm border border-(--o-border) px-1.5 py-0.5 font-mono leading-none text-(--o-faint)", f.s95)}>
            esc
          </kbd>
        </div>

        {/* scope tabs ride the seam between bar and card */}
        <div className={cx("mt-2 flex items-center gap-0.75 px-2 font-mono text-(--o-faint)", f.s10)} aria-hidden>
          {SCOPES.map((sc) => (
            <span
              key={sc}
              className={cx(
                "rounded-[calc(var(--mu)*7)] px-2.5 py-0.75",
                sc === "all" && "bg-(--o-panel-2)/85 text-(--o-text) shadow-[inset_0_0_0_1px_rgba(242,101,34,0.35)]",
              )}
            >
              {sc}
            </span>
          ))}
          <span className="ml-auto rounded-[calc(var(--mu)*7)] px-2.5 py-0.75">&gt; verbs</span>
        </div>

        {/* the results card, detached, with the filament as its bottom edge */}
        <div className={cx(s.palCard, "relative mt-2 flex flex-col overflow-hidden rounded-2xl")}>
          <div id={listId} role="listbox" aria-label="Commands" className="py-1.5">
            {results.length === 0 ? (
              <div className={cx("px-4 py-9 text-center text-(--o-muted)", f.s125)}>no command matches “{query.trim()}”</div>
            ) : (
              results.map((c, i) => {
                const header = c.group !== lastGroup;
                lastGroup = c.group;
                const on = i === active;
                return (
                  <Fragment key={c.id}>
                    {header ? (
                      <div
                        aria-hidden
                        className={cx("px-4 pt-2.5 pb-1 font-mono tracking-[0.2em] text-(--o-faint) uppercase", f.s9)}
                      >
                        {c.group}
                      </div>
                    ) : null}
                    <div className="px-2">
                      <div
                        id={optId(i)}
                        role="option"
                        aria-selected={on}
                        onMouseMove={() => {
                          if (!on) setSel(i);
                        }}
                        onClick={() => onRun(c)}
                        className={cx(
                          "relative flex cursor-default items-center gap-2.5 rounded-[calc(var(--mu)*10)] px-2.5 py-2 transition-colors duration-100",
                          on ? s.palRowActive : "hover:bg-(--o-panel-2)/50",
                        )}
                      >
                        {on ? <span aria-hidden className={cx(s.palBarMark, "absolute inset-y-1.5 left-0 w-0.5 rounded-full")} /> : null}
                        <span aria-hidden className={cx("w-4.25 shrink-0 text-right font-mono text-(--o-faint) tabular-nums", f.s95)}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cx(
                            "grid size-7 shrink-0 place-items-center rounded-lg border transition-colors duration-100",
                            on
                              ? "border-(--o-accent)/30 bg-(--o-accent)/10 text-(--o-accent)"
                              : "border-(--o-border) bg-(--o-panel-2)/50 text-(--o-muted)",
                          )}
                        >
                          <Ico icon={c.icon} className="size-3.5" />
                        </span>
                        <span className={cx("min-w-0 flex-1 truncate font-mono text-(--o-text)", f.s125)}>
                          <Highlight text={c.title} q={q} />
                        </span>
                        {c.sub ? (
                          <span className={cx("shrink-0 truncate font-mono text-(--o-faint)", f.s105)}>{c.sub}</span>
                        ) : null}
                        {on ? (
                          <span
                            aria-hidden
                            className={cx(
                              "flex shrink-0 items-center gap-1 rounded-md border border-(--o-border) bg-(--o-panel-2) px-1.5 py-0.5 font-mono text-(--o-muted)",
                              f.s10,
                            )}
                          >
                            open
                            <Ico icon={ArrowElbowDownLeft} className="size-2.5" />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Fragment>
                );
              })
            )}
          </div>
          <div
            aria-hidden
            className={cx("flex items-center gap-3.5 border-t border-(--o-border) px-4 pt-2 pb-2.5 font-mono text-(--o-faint)", f.s10)}
          >
            <span className="flex items-center gap-1">
              <Ico icon={ArrowsDownUp} className="size-2.75" />
              navigate
            </span>
            <span className="flex items-center gap-1">
              <Ico icon={ArrowElbowDownLeft} className="size-2.75" />
              open
            </span>
            <span>esc close</span>
            <span className="ml-auto">&gt; verbs</span>
          </div>
          <span aria-hidden className={cx(s.palFilament, "pointer-events-none absolute inset-x-3.5 bottom-0 h-0.5 rounded-full")} />
        </div>
      </motion.div>
    </>
  );
}

export function Palette({
  open,
  origin,
  onClose,
  onRun,
}: {
  open: boolean;
  origin: string;
  onClose: () => void;
  onRun: (c: Command) => void;
}) {
  return <AnimatePresence>{open ? <Dialog key="palette" origin={origin} onClose={onClose} onRun={onRun} /> : null}</AnimatePresence>;
}
