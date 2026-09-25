"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretDown, Check, LinkSimple, Plus } from "@phosphor-icons/react";
import { MockScreen } from "@/components/mockups/MockScreen";
import { CommandPill, Dock, FormatBar, Library, Spine, Toolbar, type Mode } from "./chrome";
import { countWords, formatCount, headingsOf, parseBlocks } from "./markdown";
import { renderBlocks, renderSource } from "./render";
import { DOC_TAGS, DOC_TITLE, SAMPLE_DOC, TYPED_SNIPPET } from "./sample";

/*
 * Stone & Chisel, recreated: the Vellum "Paper" scheme with the terracotta
 * accent, drawn at 1180 x 740 design px. Edit / Split / Preview, the Markdown
 * source, the live preview, scroll sync and the Spine all genuinely work.
 */

const W = 1180;
const H = 740;
const EASE = [0.2, 0.8, 0.2, 1] as const;
const mu = (n: number) => `calc(var(--mu) * ${n})`;

type CaretState = "off" | "blink" | "solid";
type Pane = "src" | "prev";

const ROOT_STYLE = {
  "--bg": "oklch(0.972 0.014 84)",
  "--sheet": "oklch(0.988 0.01 86)",
  "--popover": "oklch(0.99 0.009 86)",
  "--fg": "oklch(0.24 0.014 62)",
  "--muted-fg": "oklch(0.47 0.022 66)",
  "--faint": "oklch(0.52 0.02 68)",
  "--primary": "oklch(0.58 0.15 45)",
  "--primary-ink": "oklch(0.54 0.15 45)",
  "--indigo": "oklch(0.5 0.08 265)",
  "--sage": "oklch(0.52 0.06 130)",
  "--amber": "oklch(0.72 0.13 72)",
  "--amber-ink": "oklch(0.53 0.1 70)",
  "--violet-a": "#7c5cff",
  "--violet-b": "#a17dff",
  "--espresso": "#2A211A",
  "--ease": "cubic-bezier(0.2, 0.8, 0.2, 1)",
  "--line": "color-mix(in oklab, var(--fg) 9%, transparent)",
  "--line-strong": "color-mix(in oklab, var(--fg) 16%, transparent)",
  "--sheet-line": "color-mix(in oklab, var(--fg) 10%, transparent)",
  "--box-line": "color-mix(in oklab, var(--fg) 30%, transparent)",
  "--ink-3": "color-mix(in oklab, var(--fg) 3%, transparent)",
  "--ink-4": "color-mix(in oklab, var(--fg) 4%, transparent)",
  "--ink-5": "color-mix(in oklab, var(--fg) 5%, transparent)",
  "--ink-6": "color-mix(in oklab, var(--fg) 6%, transparent)",
  "--ink-8": "color-mix(in oklab, var(--fg) 8%, transparent)",
  "--tint": "color-mix(in oklab, var(--primary) 10%, transparent)",
  "--tint-2": "color-mix(in oklab, var(--primary) 15%, transparent)",
  "--indigo-tint": "color-mix(in oklab, var(--indigo) 12%, transparent)",
  "--link-line": "color-mix(in oklab, var(--primary) 45%, transparent)",
  "--code-ink": "color-mix(in oklab, var(--primary-ink) 78%, var(--fg))",
  "--src-ink": "color-mix(in oklab, var(--fg) 90%, var(--sheet))",
  "--src-code": "color-mix(in oklab, var(--primary-ink) 45%, var(--fg))",
  "--callout": "color-mix(in oklab, var(--amber) 13%, var(--sheet))",
  "--callout-line": "color-mix(in oklab, var(--primary) 24%, transparent)",
  "--diagram": "color-mix(in oklab, var(--indigo) 6%, var(--sheet))",
  "--node": "color-mix(in oklab, var(--primary) 11%, var(--sheet))",
  "--glass-bg": "color-mix(in oklab, var(--popover) 60%, transparent)",
  "--glass-2": "color-mix(in oklab, var(--popover) 84%, transparent)",
  "--glass-rim": "color-mix(in oklab, white 55%, transparent)",
  "--glow": `0 ${mu(12)} ${mu(34)} ${mu(-24)} color-mix(in oklab, var(--fg) 19%, transparent), 0 ${mu(1)} ${mu(3)} color-mix(in oklab, var(--fg) 7%, transparent)`,
  "--sheet-shadow": `0 ${mu(24)} ${mu(60)} ${mu(-30)} color-mix(in oklab, var(--fg) 30%, transparent), 0 ${mu(2)} ${mu(6)} ${mu(-3)} color-mix(in oklab, var(--fg) 10%, transparent)`,
  "--pop-shadow": `0 ${mu(16)} ${mu(38)} ${mu(-20)} color-mix(in oklab, var(--fg) 34%, transparent), 0 ${mu(6)} ${mu(14)} ${mu(-10)} color-mix(in oklab, var(--fg) 18%, transparent), 0 ${mu(1)} ${mu(2)} color-mix(in oklab, var(--fg) 6%, transparent)`,
  "--new-shadow": `0 ${mu(6)} ${mu(16)} ${mu(-8)} color-mix(in oklab, #7c5cff 60%, transparent), inset 0 1px 0 color-mix(in oklab, white 30%, transparent)`,
  "--code-shadow": `0 ${mu(14)} ${mu(32)} ${mu(-20)} rgba(60, 40, 25, 0.6)`,
  "--card-shadow": `0 ${mu(12)} ${mu(30)} ${mu(-22)} rgba(60, 40, 25, 0.45)`,
  backgroundColor: "var(--bg)",
  backgroundImage:
    "radial-gradient(115% 85% at 6% -8%, color-mix(in oklab, var(--primary) 13%, transparent), transparent 48%), radial-gradient(120% 90% at 104% 106%, color-mix(in oklab, var(--primary) 9%, transparent), transparent 52%)",
} as CSSProperties;

const GRAIN_STYLE: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
  backgroundSize: `${mu(140)} ${mu(140)}`,
};

const FADE_MASK = `linear-gradient(to bottom, transparent 0, #000 ${mu(12)}, #000 calc(100% - ${mu(104)}), transparent calc(100% - ${mu(30)}))`;
const LIB_W = 244;
const FADE_STYLE: CSSProperties = { maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK };

/** Deterministic typing cadence: a little uneven, never random. */
const JITTER = [0, 24, 9, 38, 15, 4, 30, 11, 19];
const cadence = (ch: string, pos: number) =>
  46 + JITTER[pos % JITTER.length] + (ch === " " ? 44 : 0) + (/[.,!?]/.test(ch) ? 170 : 0);

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/* ------------------------------------------------------------ small parts */

function Caret({ blink }: { blink: boolean }) {
  return (
    <span aria-hidden className="relative inline-block h-[1.25em] w-0 align-[-0.26em]">
      <motion.span
        className="absolute left-0 top-0 h-full w-[calc(var(--mu)*1.6)] rounded-full bg-(--primary)"
        initial={false}
        animate={blink ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
        transition={
          blink
            ? { duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.52, 1], ease: "linear" }
            : { duration: 0 }
        }
      />
    </span>
  );
}

function ColumnLabel({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex h-8 shrink-0 select-none items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-3xs font-semibold uppercase tracking-[0.16em] text-(--faint) transition-colors duration-160 group-focus-within:text-(--primary-ink)">
        <span className="size-1 rounded-full bg-current opacity-0 transition-opacity duration-160 group-focus-within:opacity-100" />
        {children}
      </span>
      {aside}
    </div>
  );
}

type SourceProps = {
  text: string;
  size: "split" | "edit";
  caret: CaretState;
  paneRef: RefObject<HTMLDivElement | null>;
  padClass: string;
  innerClass?: string;
  onScroll: () => void;
  onActivate: () => void;
  onFocus: () => void;
  onEdit: (value: string) => void;
};

/**
 * A real textarea over a tinted mirror. The mirror sets the height, the
 * transparent textarea on top takes the input, and the wrapper scrolls, so
 * both always wrap identically.
 */
function SourceEditor({ text, size, caret, paneRef, padClass, innerClass, onScroll, onActivate, onFocus, onEdit }: SourceProps) {
  const overlay = useMemo(
    () => renderSource(text, caret === "off" ? null : 0, caret === "off" ? null : <Caret blink={caret === "blink"} />),
    [text, caret],
  );
  const type = cx(
    "m-0 block w-full border-0 font-mono tracking-normal whitespace-pre-wrap [overflow-wrap:break-word] [tab-size:2] [font-variant-ligatures:none]",
    size === "split"
      ? "text-[length:calc(var(--mu)*11.5)] leading-[1.8]"
      : "text-[length:calc(var(--mu)*12.5)] leading-[1.85]",
    padClass,
  );
  return (
    <div
      ref={paneRef}
      onScroll={onScroll}
      onPointerEnter={onActivate}
      onWheel={onActivate}
      onTouchStart={onActivate}
      data-lenis-prevent=""
      className="relative min-h-0 flex-1 overflow-y-auto"
      style={FADE_STYLE}
    >
      <div className={cx("relative", innerClass)}>
        <pre aria-hidden className={cx(type, "pointer-events-none text-(--src-ink)")}>
          {overlay}
          {"\u200b"}
        </pre>
        <textarea
          value={text}
          onChange={(e) => onEdit(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onActivate}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Markdown source"
          className={cx(
            type,
            "absolute inset-0 h-full resize-none overflow-hidden bg-transparent text-transparent caret-(--primary) outline-none",
            "selection:bg-[color-mix(in_oklab,var(--primary)_24%,transparent)] selection:text-transparent",
          )}
        />
      </div>
    </div>
  );
}

function DocHeader({ words, minutes, saving }: { words: number; minutes: number; saving: boolean }) {
  return (
    <div className="relative shrink-0 px-6 pt-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 font-serif text-[length:calc(var(--mu)*30)] font-semibold leading-[1.08] tracking-[-0.02em] text-(--fg)">
          {DOC_TITLE}
        </div>
        <span className="mt-1 inline-flex select-none items-center gap-1.5 rounded-[calc(var(--mu)*10)] border border-(--line) bg-(--ink-4) px-2.5 py-1 font-mono text-2xs font-medium text-(--muted-fg) transition-colors duration-160 hover:text-(--fg)">
          MD
          <CaretDown weight="bold" className="size-2.5" />
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-4 border-b border-(--line) pb-3.5">
        <div className="flex items-center gap-2 whitespace-nowrap font-mono text-[length:calc(var(--mu)*11)] tabular-nums text-(--muted-fg)">
          <span>{formatCount(words)} words</span>
          <span aria-hidden className="text-(--faint)">
            ·
          </span>
          <span>{minutes} min read</span>
          <span aria-hidden className="text-(--faint)">
            ·
          </span>
          {saving ? (
            <span className="inline-flex items-center gap-1.5 text-(--amber-ink)">
              <span className="size-1.5 rounded-full bg-(--amber)" />
              saving
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-(--sage)">
              <Check weight="bold" className="size-3" />
              saved
            </span>
          )}
        </div>
        <div className="flex select-none items-center gap-1.5">
          {DOC_TAGS.map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-(--line) bg-(--ink-4) px-2 py-[calc(var(--mu)*3)] text-[length:calc(var(--mu)*11)] text-(--muted-fg) transition-colors duration-160 hover:border-(--callout-line) hover:bg-(--tint) hover:text-(--primary-ink)"
            >
              <span className="size-1.5 rounded-full" style={{ background: tag.color }} />
              {tag.name}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-[calc(var(--mu)*3)] text-[length:calc(var(--mu)*11)] text-(--faint)">
            <Plus weight="bold" className="size-2.5" />
            Tag
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- main */

export function StoneChiselMock({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const panelId = useId();

  const [text, setText] = useState(SAMPLE_DOC);
  const [mode, setMode] = useState<Mode>("split");
  const [switched, setSwitched] = useState(false);
  const [libOpen, setLibOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [caret, setCaret] = useState<CaretState>("off");
  const [reading, setReading] = useState({ idx: -1, progress: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const srcRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const activePane = useRef<Pane | null>(null);
  const ratio = useRef(0);
  const frame = useRef(0);
  const saveTimer = useRef<number | undefined>(undefined);
  const touched = useRef(false);

  const deferred = useDeferredValue(text);
  const blocks = useMemo(() => parseBlocks(deferred), [deferred]);
  const headings = useMemo(() => headingsOf(blocks), [blocks]);
  const preview = useMemo(() => renderBlocks(blocks), [blocks]);
  const words = useMemo(() => countWords(text), [text]);
  const minutes = Math.max(1, Math.round(words / 200));

  /* save status: "saving" while typing, "saved" after an 800 ms pause */
  const markDirty = useCallback(() => {
    setSaving(true);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaving(false), 800);
  }, []);
  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  const onEdit = useCallback(
    (value: string) => {
      touched.current = true;
      setCaret("off");
      setText(value);
      markDirty();
    },
    [markDirty],
  );

  const onSourceFocus = useCallback(() => {
    touched.current = true;
    activePane.current = "src";
    setCaret("off");
  }, []);

  /* the Spine: which heading is being read, and how far along */
  const measure = useCallback(() => {
    frame.current = 0;
    const pane = mode === "edit" ? srcRef.current : prevRef.current;
    if (!pane) return;
    const box = pane.getBoundingClientRect();
    const max = pane.scrollHeight - pane.clientHeight;
    const progress = max > 1 ? Math.min(1, Math.max(0, pane.scrollTop / max)) : 1;
    const readingLine = box.top + pane.clientHeight * 0.36;
    let idx = -1;
    for (const el of pane.querySelectorAll<HTMLElement>("[data-hidx]")) {
      const top = el.getBoundingClientRect().top;
      if (top <= readingLine || (progress > 0.985 && top < box.bottom)) idx = Number(el.dataset.hidx);
    }
    setReading((prev) =>
      prev.idx === idx && Math.abs(prev.progress - progress) < 0.002 ? prev : { idx, progress },
    );
  }, [mode]);

  const scheduleMeasure = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    const pane = mode === "edit" ? srcRef.current : prevRef.current;
    const first = requestAnimationFrame(measure);
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleMeasure);
    if (pane) ro?.observe(pane);
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      ro?.disconnect();
    };
  }, [mode, measure, scheduleMeasure, preview]);

  /* proportional scroll sync; the pane under the pointer leads */
  const follow = useCallback((from: HTMLElement, to: HTMLElement | null) => {
    if (!to) return;
    const max = from.scrollHeight - from.clientHeight;
    to.scrollTop = (max > 0 ? from.scrollTop / max : 0) * (to.scrollHeight - to.clientHeight);
  }, []);

  const onPaneScroll = useCallback(
    (pane: Pane) => {
      const el = pane === "src" ? srcRef.current : prevRef.current;
      if (!el) return;
      const leads = mode !== "split" || activePane.current === pane;
      if (leads) {
        const max = el.scrollHeight - el.clientHeight;
        ratio.current = max > 0 ? el.scrollTop / max : 0;
      }
      if (mode === "split" && activePane.current === pane) {
        follow(el, pane === "src" ? prevRef.current : srcRef.current);
      }
      if ((pane === "prev") === (mode !== "edit")) scheduleMeasure();
    },
    [mode, follow, scheduleMeasure],
  );
  const onSrcScroll = useCallback(() => onPaneScroll("src"), [onPaneScroll]);
  const onPrevScroll = useCallback(() => onPaneScroll("prev"), [onPaneScroll]);
  const activateSrc = useCallback(() => {
    activePane.current = "src";
  }, []);
  const activatePrev = useCallback(() => {
    activePane.current = "prev";
  }, []);

  /* keep the reading position when switching Edit / Split / Preview */
  useLayoutEffect(() => {
    for (const el of [srcRef.current, prevRef.current]) {
      if (el) el.scrollTop = ratio.current * (el.scrollHeight - el.clientHeight);
    }
  }, [mode]);

  const changeMode = useCallback((next: Mode) => {
    setMode(next);
    setSwitched(true);
  }, []);

  const jumpTo = useCallback(
    (idx: number) => {
      const pane = mode === "edit" ? srcRef.current : prevRef.current;
      const target = pane?.querySelector<HTMLElement>(`[data-hidx="${idx}"]`);
      if (!pane || !target) return;
      activePane.current = mode === "edit" ? "src" : "prev";
      const top =
        target.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - pane.clientHeight * 0.06;
      pane.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    },
    [mode, reduce],
  );

  /* one quiet flourish: finish the first line once the screen is in view */
  useEffect(() => {
    const root = rootRef.current;
    if (reduce || !root || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    let started = false;
    let pos = 0;
    let timer: number | undefined;
    let settle: number | undefined;

    const step = () => {
      if (!visible || touched.current) return;
      if (pos >= TYPED_SNIPPET.length) {
        setCaret("blink");
        settle = window.setTimeout(() => setCaret("off"), 2400);
        return;
      }
      const ch = TYPED_SNIPPET[pos];
      pos += 1;
      setCaret("solid");
      setText((t) => {
        const at = t.indexOf("\n");
        const end = at < 0 ? t.length : at;
        return t.slice(0, end) + ch + t.slice(end);
      });
      markDirty();
      timer = window.setTimeout(step, cadence(ch, pos));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.55;
        window.clearTimeout(timer);
        if (!visible || touched.current || pos >= TYPED_SNIPPET.length) return;
        if (!started) {
          started = true;
          setCaret("blink");
          timer = window.setTimeout(step, 1300);
        } else {
          timer = window.setTimeout(step, 450);
        }
      },
      { threshold: [0, 0.55] },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      window.clearTimeout(settle);
    };
  }, [reduce, markDirty]);

  const paneMotion = switched
    ? {
        initial: { opacity: 0, y: reduce ? 0 : 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: reduce ? 0.16 : 0.22, ease: EASE },
      }
    : { initial: false as const };

  const previewScroller = (padded: string, sizeClass: string) => (
    <div
      ref={prevRef}
      onScroll={onPrevScroll}
      onPointerEnter={activatePrev}
      onWheel={activatePrev}
      onTouchStart={activatePrev}
      onFocus={activatePrev}
      data-lenis-prevent=""
      tabIndex={0}
      role="region"
      aria-label="Rendered preview"
      className="relative min-h-0 flex-1 overflow-y-auto outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--tint-2)]"
      style={FADE_STYLE}
    >
      <div className={cx(padded, sizeClass, "pb-28 pt-0.5 font-serif text-(--fg) [font-optical-sizing:auto]")}>{preview}</div>
    </div>
  );

  return (
    <MockScreen w={W} h={H} label="Stone & Chisel, a Markdown notes editor (recreated screen)" className={className}>
      <div ref={rootRef} className="absolute inset-0 flex gap-2 p-2 font-ui text-(--fg)" style={ROOT_STYLE}>
        <Dock libOpen={libOpen} panelId={panelId} onToggleLibrary={() => setLibOpen((o) => !o)} />

        <div
          id={panelId}
          inert={!libOpen}
          aria-hidden={!libOpen}
          className="relative shrink-0 transition-[width,margin] duration-320 ease-(--ease) motion-reduce:transition-none"
          style={{ width: libOpen ? mu(LIB_W) : "0px", marginRight: libOpen ? "0px" : mu(-8) }}
        >
          <div
            className={cx(
              "absolute inset-y-0 left-0 transition-[opacity,translate,scale] duration-320 ease-(--ease) motion-reduce:transition-none",
              libOpen ? "opacity-100" : "-translate-x-3.5 scale-[0.985] opacity-0",
            )}
            style={{ width: mu(LIB_W) }}
          >
            <Library />
          </div>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-(--sheet-line) bg-(--sheet) shadow-(--sheet-shadow)">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-50 mix-blend-multiply" style={GRAIN_STYLE} />
            <DocHeader words={words} minutes={minutes} saving={saving} />
            <Toolbar mode={mode} onMode={changeMode} />
            <AnimatePresence initial={false}>
              {mode !== "preview" && (
                <motion.div
                  key="format"
                  className="shrink-0 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
                >
                  <FormatBar />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div key={mode} className="relative flex min-h-0 flex-1 flex-col" {...paneMotion}>
              {mode === "split" && (
                <div className="grid min-h-0 flex-1 grid-cols-2">
                  <div className="group relative flex min-h-0 flex-col">
                    <div className="pl-6 pr-3.5">
                      <ColumnLabel>Markdown</ColumnLabel>
                    </div>
                    <SourceEditor
                      text={text}
                      size="split"
                      caret={caret}
                      paneRef={srcRef}
                      padClass="pl-6 pr-3.5 pt-0.5 pb-28"
                      onScroll={onSrcScroll}
                      onActivate={activateSrc}
                      onFocus={onSourceFocus}
                      onEdit={onEdit}
                    />
                  </div>
                  <div className="relative flex min-h-0 flex-col">
                    <span
                      aria-hidden
                      className="absolute bottom-6 left-0 top-2 w-px"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent, var(--line-strong) 10%, var(--line-strong) 82%, transparent)",
                      }}
                    />
                    <div className="pl-4.5 pr-6">
                      <ColumnLabel
                        aside={
                          <span className="inline-flex items-center gap-1 text-[length:calc(var(--mu)*10)] text-(--faint)">
                            <LinkSimple weight="bold" className="size-3" />
                            Scroll synced
                          </span>
                        }
                      >
                        Preview
                      </ColumnLabel>
                    </div>
                    {previewScroller("pl-4.5 pr-6", "text-[length:calc(var(--mu)*14)] leading-[1.7]")}
                  </div>
                </div>
              )}

              {mode === "edit" && (
                <div className="group flex min-h-0 flex-1 flex-col pt-1.5">
                  <SourceEditor
                    text={text}
                    size="edit"
                    caret={caret}
                    paneRef={srcRef}
                    padClass="px-6 pt-1 pb-28"
                    innerClass="mx-auto max-w-[calc(var(--mu)*600)]"
                    onScroll={onSrcScroll}
                    onActivate={activateSrc}
                    onFocus={onSourceFocus}
                    onEdit={onEdit}
                  />
                </div>
              )}

              {mode === "preview" && (
                <div className="flex min-h-0 flex-1 flex-col pt-2.5">
                  {previewScroller(
                    "mx-auto max-w-[calc(var(--mu)*560)] px-6",
                    "text-[length:calc(var(--mu)*15.5)] leading-[1.72]",
                  )}
                </div>
              )}
            </motion.div>
          </div>
          <CommandPill />
        </div>

        <Spine
          headings={headings}
          current={reading.idx}
          progress={reading.progress}
          minutes={minutes}
          onJump={jumpTo}
        />
      </div>
    </MockScreen>
  );
}
