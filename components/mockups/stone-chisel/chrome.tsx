"use client";

import { useId, type ReactNode } from "react";
import {
  BracketsCurly,
  CalendarBlank,
  CalendarDots,
  CaretDown,
  CaretRight,
  ClockCounterClockwise,
  CloudCheck,
  CodeBlock,
  Code,
  Command,
  DotsThree,
  Eye,
  FileText,
  FlowArrow,
  Graph,
  Hash,
  Info,
  LinkSimple,
  ListBullets,
  ListChecks,
  ListNumbers,
  MagnifyingGlass,
  Moon,
  PencilSimple,
  Plus,
  PushPinSimple,
  Quotes,
  ShareNetwork,
  SidebarSimple,
  Sigma,
  SortAscending,
  SquareSplitHorizontal,
  Table,
  TextAa,
  TextB,
  TextH,
  TextItalic,
  type Icon,
} from "@phosphor-icons/react";
import type { Heading } from "./markdown";
import { LIB_FOLDERS, LIB_PINNED, LIB_TAGS, type LibNote } from "./sample";

export type Mode = "edit" | "split" | "preview";

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/** Vellum glass: translucent popover tint, 22px blur, white rim. */
export const GLASS =
  "border border-(--glass-rim) bg-(--glass-bg) backdrop-blur-[calc(var(--mu)*22)] backdrop-saturate-[1.3] shadow-(--glow)";
const PILL =
  "border border-(--glass-rim) bg-(--glass-2) backdrop-blur-[calc(var(--mu)*18)] backdrop-saturate-[1.2] shadow-(--pop-shadow)";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)";

/* ------------------------------------------------------------------ dock */

function Tip({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-[calc(100%+var(--mu)*12)] top-1/2 z-40 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-[calc(var(--mu)*9)] border border-(--glass-rim) bg-(--glass-2) px-2.5 py-1.5 text-[length:calc(var(--mu)*11.5)] font-medium text-(--fg) opacity-0 shadow-(--pop-shadow) backdrop-blur-[calc(var(--mu)*14)] transition-[opacity,translate] duration-160 group-hover:translate-x-0 group-hover:opacity-100">
      {children}
    </span>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <span className="ml-1.5 inline-flex items-center gap-px rounded-[calc(var(--mu)*5)] bg-(--ink-8) px-1 py-px align-[0.08em] text-3xs font-semibold text-(--muted-fg)">
      <Command weight="bold" className="size-2.5" />
      {children}
    </span>
  );
}

function DockIcon({ icon: IconCmp, tip }: { icon: Icon; tip: ReactNode }) {
  return (
    <span className="group relative grid size-11 place-items-center rounded-xl text-(--muted-fg) transition-[background-color,color,translate] duration-160 hover:-translate-y-px hover:bg-(--ink-6) hover:text-(--fg)">
      <IconCmp className="size-5" />
      <Tip>{tip}</Tip>
    </span>
  );
}

/** The Stone & Chisel mark: violet squircle, white chisel glyph. */
export function BrandMark({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 512 512" aria-hidden className={className}>
      <defs>
        <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#a17dff" />
        </linearGradient>
        <radialGradient id={`${uid}-shine`} cx="0.3" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill={`url(#${uid}-fill)`} />
      <rect width="512" height="512" rx="112" fill={`url(#${uid}-shine)`} />
      <g fill="#fff">
        <path d="M192 90h128l24 86H168z" opacity="0.95" />
        <path d="M168 188h176v144l-88 122-88-122z" opacity="0.7" />
        <path d="M256 320v134" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  );
}

export function Dock({
  libOpen,
  panelId,
  onToggleLibrary,
}: {
  libOpen: boolean;
  panelId: string;
  onToggleLibrary: () => void;
}) {
  return (
    <div className={cx(GLASS, "relative z-20 flex w-16 shrink-0 select-none flex-col items-center gap-1.5 rounded-2xl pb-3 pt-3.5")}>
      <BrandMark className="mb-1 size-7 drop-shadow-[0_calc(var(--mu)*4)_calc(var(--mu)*8)_rgba(124,92,255,0.35)]" />
      <span aria-hidden className="mb-1 h-px w-6 bg-(--line-strong)" />
      <span className="group relative grid size-11 place-items-center rounded-2xl bg-linear-135 from-(--violet-a) to-(--violet-b) text-white shadow-(--new-shadow) transition-[translate,filter] duration-160 hover:-translate-y-px hover:brightness-105">
        <Plus weight="bold" className="size-5" />
        <Tip>
          New note
          <Kbd>N</Kbd>
        </Tip>
      </span>
      <button
        type="button"
        onClick={onToggleLibrary}
        aria-expanded={libOpen}
        aria-controls={panelId}
        aria-label="Library"
        className={cx(
          "group relative grid size-11 cursor-pointer place-items-center rounded-xl transition-[background-color,color,translate] duration-160 hover:-translate-y-px",
          libOpen ? "bg-(--tint) text-(--primary-ink)" : "text-(--muted-fg) hover:bg-(--ink-6) hover:text-(--fg)",
          FOCUS,
        )}
      >
        <SidebarSimple weight={libOpen ? "fill" : "regular"} className="size-5" />
        <Tip>
          {libOpen ? "Hide library" : "Show library"}
          <Kbd>B</Kbd>
        </Tip>
      </button>
      <DockIcon
        icon={MagnifyingGlass}
        tip={
          <>
            Search
            <Kbd>K</Kbd>
          </>
        }
      />
      <DockIcon icon={CalendarDots} tip="Journal" />
      <DockIcon icon={Graph} tip="Note graph" />
      <div className="flex-1" />
      <DockIcon icon={Moon} tip="Candlelight" />
      <span className="mt-1 grid size-9 place-items-center rounded-xl bg-linear-150 from-[#6E7A5A] to-[#8C9A73] text-2xs font-semibold tracking-[0.04em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        JN
      </span>
    </div>
  );
}

/* --------------------------------------------------------------- library */

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("px-2.5 pb-1 text-3xs font-semibold uppercase tracking-[0.16em] text-(--faint)", className)}>
      {children}
    </div>
  );
}

function Badge({ kind }: { kind: LibNote["kind"] }) {
  if (kind === "journal") return null;
  return (
    <span
      className={cx(
        "shrink-0 rounded-[calc(var(--mu)*4)] px-1 py-px font-mono text-[length:calc(var(--mu)*8.5)] font-medium tracking-[0.04em]",
        kind === "mdx" ? "bg-(--indigo-tint) text-(--indigo)" : "bg-(--ink-5) text-(--faint)",
      )}
    >
      {kind.toUpperCase()}
    </span>
  );
}

function Leaf({ note }: { note: LibNote }) {
  const LeafIcon = note.kind === "journal" ? CalendarBlank : note.kind === "mdx" ? BracketsCurly : FileText;
  return (
    <div
      aria-current={note.selected ? "page" : undefined}
      className={cx(
        "relative flex items-center gap-2 rounded-[calc(var(--mu)*10)] py-[calc(var(--mu)*6)] pl-2.5 pr-2 font-serif text-[length:calc(var(--mu)*13.5)] transition-colors duration-160",
        note.selected ? "bg-(--tint-2) text-(--fg)" : "text-(--fg)/80 hover:bg-(--ink-5) hover:text-(--fg)",
      )}
    >
      {note.selected && (
        <span
          aria-hidden
          className="absolute bottom-1.5 left-0 top-1.5 w-[calc(var(--mu)*3)] rounded-r-[calc(var(--mu)*3)] bg-(--primary) shadow-[0_0_calc(var(--mu)*6)_color-mix(in_oklab,var(--primary)_60%,transparent)]"
        />
      )}
      <LeafIcon
        weight={note.selected ? "bold" : "regular"}
        className={cx("size-3.5 shrink-0", note.selected ? "text-(--primary)" : "text-(--faint)")}
      />
      <span className={cx("min-w-0 flex-1 truncate", note.selected && "font-medium tracking-[-0.005em]")}>{note.title}</span>
      {note.meta ? (
        <span className={cx("shrink-0 font-mono text-[length:calc(var(--mu)*9)]", note.meta === "today" ? "text-(--primary-ink)" : "text-(--faint)")}>
          {note.meta}
        </span>
      ) : (
        <Badge kind={note.kind} />
      )}
    </div>
  );
}

export function Library() {
  return (
    <div className={cx(GLASS, "relative flex h-full w-full select-none flex-col overflow-hidden rounded-2xl")}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(90% 40% at 0% 0%, var(--tint), transparent 72%)" }}
      />
      <div className="relative flex items-center justify-between pb-2.5 pl-4 pr-3 pt-3.5">
        <span className="font-serif text-[length:calc(var(--mu)*18)] font-semibold tracking-[-0.01em] text-(--fg)">Library</span>
        <span className="flex items-center gap-0.5 text-(--muted-fg)">
          <span className="grid size-7 place-items-center rounded-lg transition-colors duration-160 hover:bg-(--ink-6) hover:text-(--fg)">
            <SortAscending className="size-4" />
          </span>
          <span className="grid size-7 place-items-center rounded-lg transition-colors duration-160 hover:bg-(--ink-6) hover:text-(--fg)">
            <ListChecks className="size-4" />
          </span>
        </span>
      </div>

      <div className="relative mx-3 flex items-center gap-2 rounded-xl border border-(--line) bg-(--ink-3) px-3 py-[calc(var(--mu)*7)]">
        <MagnifyingGlass className="size-3.5 text-(--faint)" />
        <span className="flex-1 text-[length:calc(var(--mu)*12.5)] text-(--faint)">Search or create</span>
        <span className="inline-flex items-center gap-px rounded-[calc(var(--mu)*5)] bg-(--ink-6) px-1.5 py-0.5 text-3xs font-semibold text-(--muted-fg)">
          <Command weight="bold" className="size-2.5" />K
        </span>
      </div>

      <div className="relative mx-3 mt-2 grid grid-cols-3 border-b border-(--line)">
        {[
          { label: "Folders", count: 5, active: true },
          { label: "Spaces", count: 2 },
          { label: "All", count: 38 },
        ].map((tab) => (
          <span
            key={tab.label}
            className={cx(
              "relative flex items-center justify-center gap-1.5 py-2 text-[length:calc(var(--mu)*12.5)] font-medium",
              tab.active ? "text-(--fg)" : "text-(--muted-fg)",
            )}
          >
            {tab.label}
            <span className={cx("font-mono text-3xs", tab.active ? "text-(--primary-ink)" : "text-(--faint)")}>{tab.count}</span>
            {tab.active && <span className="absolute inset-x-1.5 -bottom-px h-0.5 rounded-full bg-(--primary)" />}
          </span>
        ))}
      </div>

      <div className="relative flex items-center gap-1.5 overflow-hidden whitespace-nowrap px-3 pt-2.5">
        {LIB_TAGS.map((tag) => (
          <span
            key={tag.name}
            className="inline-flex items-center gap-1.5 rounded-full border border-(--line) bg-(--ink-3) px-2 py-[calc(var(--mu)*3)] text-2xs text-(--muted-fg) transition-colors duration-160 hover:text-(--fg)"
          >
            <span className="size-1.5 rounded-full" style={{ background: tag.color }} />
            {tag.name}
          </span>
        ))}
        <span className="rounded-full px-1 py-[calc(var(--mu)*3)] font-mono text-[length:calc(var(--mu)*9.5)] text-(--faint)">+4</span>
      </div>

      <div className="relative mt-3 flex min-h-0 flex-1 flex-col overflow-hidden px-2">
        <Eyebrow>Pinned</Eyebrow>
        {LIB_PINNED.map((note) => (
          <div key={note.title} className="relative flex items-center gap-2 rounded-[calc(var(--mu)*10)] py-[calc(var(--mu)*6)] pl-2.5 pr-2 font-serif text-[length:calc(var(--mu)*13.5)] text-(--fg)/80">
            <PushPinSimple weight="fill" className="size-3.5 shrink-0 text-(--amber)" />
            <span className="min-w-0 flex-1 truncate">{note.title}</span>
            <Badge kind={note.kind} />
          </div>
        ))}

        <Eyebrow className="mt-3">Folders</Eyebrow>
        {LIB_FOLDERS.map((folder) => {
          const open = !!folder.notes;
          return (
            <div key={folder.name}>
              <div
                className={cx(
                  "relative flex h-8 items-center gap-1.5 rounded-[calc(var(--mu)*11)] pr-2.5 transition-colors duration-160",
                  open ? "bg-(--ink-4)" : "hover:bg-(--ink-5)",
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "absolute left-0 w-[calc(var(--mu)*3)] rounded-r-[calc(var(--mu)*3)]",
                    open ? "bottom-1.5 top-1.5 opacity-90" : "bottom-2.5 top-2.5 opacity-45",
                  )}
                  style={{ background: folder.color }}
                />
                <CaretRight weight="bold" className={cx("ml-2 size-3 text-(--faint)", open && "rotate-90")} />
                <span className="size-[calc(var(--mu)*9)] shrink-0 rounded-[calc(var(--mu)*3)]" style={{ background: folder.color }} />
                <span
                  className={cx(
                    "min-w-0 flex-1 truncate text-[length:calc(var(--mu)*13)]",
                    open ? "font-semibold tracking-[-0.005em] text-(--fg)" : "font-medium text-(--fg)/85",
                  )}
                >
                  {folder.name}
                </span>
                <span className={cx("font-mono text-2xs", open ? "text-(--primary-ink)" : "text-(--faint)")}>{folder.count}</span>
              </div>
              {folder.notes && (
                <div className="mb-1 mt-0.5 flex flex-col gap-px pl-4.5">
                  {folder.notes.map((note) => (
                    <Leaf key={note.title} note={note} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative flex items-center justify-between border-t border-(--line) px-4 py-2.5 font-mono text-[length:calc(var(--mu)*9.5)] text-(--faint)">
        <span>38 notes · 5 folders</span>
        <span className="inline-flex items-center gap-1">
          <CloudCheck weight="bold" className="size-3.5 text-(--sage)" />
          synced
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- toolbar */

const MODES: { id: Mode; label: string; icon: Icon }[] = [
  { id: "edit", label: "Edit", icon: PencilSimple },
  { id: "split", label: "Split", icon: SquareSplitHorizontal },
  { id: "preview", label: "Preview", icon: Eye },
];

function ToolChip({ icon: IconCmp, label }: { icon: Icon; label?: string }) {
  return (
    <span
      className={cx(
        "flex h-7 items-center gap-1.5 rounded-full text-xs font-medium text-(--muted-fg) transition-colors duration-160 hover:bg-(--ink-6) hover:text-(--fg)",
        label ? "px-2.5" : "w-7 justify-center",
      )}
    >
      <IconCmp className="size-4" />
      {label}
    </span>
  );
}

export function Toolbar({ mode, onMode }: { mode: Mode; onMode: (m: Mode) => void }) {
  const idx = MODES.findIndex((m) => m.id === mode);
  return (
    <div className="relative z-10 flex shrink-0 justify-center px-4 pt-3">
      <div
        className={cx(
          PILL,
          "flex select-none items-center gap-1 rounded-full p-1.5 opacity-65 transition-opacity duration-220 ease-(--ease) focus-within:opacity-100 hover:opacity-100",
        )}
      >
        <div role="group" aria-label="View mode" className="relative flex rounded-full bg-(--ink-6) p-0.5">
          <span
            aria-hidden
            className="absolute left-0.5 top-0.5 h-7 w-[calc(var(--mu)*76)] rounded-full bg-(--sheet) shadow-[0_calc(var(--mu)*1)_calc(var(--mu)*4)_color-mix(in_oklab,var(--fg)_16%,transparent)] transition-transform duration-220 ease-(--ease) motion-reduce:transition-none"
            style={{ transform: `translateX(calc(var(--mu) * ${76 * idx}))` }}
          />
          {MODES.map((m) => {
            const on = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => onMode(m.id)}
                className={cx(
                  "relative flex h-7 w-[calc(var(--mu)*76)] cursor-pointer items-center justify-center gap-1.5 rounded-full text-xs font-medium tracking-[0.01em] transition-colors duration-160",
                  on ? "text-(--primary-ink)" : "text-(--muted-fg) hover:text-(--fg)",
                  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--primary)",
                )}
              >
                <m.icon weight={on ? "bold" : "regular"} className="size-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>
        <span aria-hidden className="mx-1 h-5 w-px bg-(--line-strong)" />
        <ToolChip icon={TextAa} />
        <ToolChip icon={ShareNetwork} label="Share" />
        <ToolChip icon={ClockCounterClockwise} label="History" />
        <ToolChip icon={Info} />
        <ToolChip icon={DotsThree} />
      </div>
    </div>
  );
}

const FORMAT_GROUPS: Icon[][] = [
  [TextB, TextItalic, LinkSimple, Code],
  [TextH],
  [ListBullets, ListNumbers, ListChecks],
  [Quotes, CodeBlock],
  [Table, Sigma, FlowArrow],
];

export function FormatBar() {
  return (
    <div aria-hidden className="flex justify-center px-4 pb-2.5 pt-2">
      <div
        className={cx(
          GLASS,
          "flex select-none items-center gap-0.5 rounded-full px-1.5 py-1 opacity-65 transition-opacity duration-220 ease-(--ease) hover:opacity-100",
        )}
      >
        {FORMAT_GROUPS.map((group, gi) => (
          <span key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="mx-1 h-4 w-px bg-(--line-strong)" />}
            {group.map((IconCmp, ii) => (
              <span
                key={ii}
                className={cx(
                  "flex h-7 items-center justify-center gap-0.5 rounded-[calc(var(--mu)*9)] text-(--muted-fg) transition-[background-color,color,translate] duration-160 hover:-translate-y-px hover:bg-(--ink-8) hover:text-(--fg)",
                  IconCmp === TextH ? "px-1.5" : "w-7",
                )}
              >
                <IconCmp weight={IconCmp === TextB ? "bold" : "regular"} className="size-[calc(var(--mu)*15)]" />
                {IconCmp === TextH && <CaretDown weight="bold" className="size-2" />}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- spine */

const ROW = 30; // design px per outline row; the marker glides by this pitch

export function Spine({
  headings,
  current,
  progress,
  minutes,
  onJump,
}: {
  headings: Heading[];
  current: number;
  progress: number;
  minutes: number;
  onJump: (idx: number) => void;
}) {
  const pos = headings.findIndex((h) => h.idx === current);
  const minLevel = headings.reduce((m, h) => Math.min(m, h.level), 6);
  const pct = Math.round(progress * 100);
  const left = Math.max(0, Math.ceil(minutes * (1 - progress)));
  return (
    <div className={cx(GLASS, "flex w-[calc(var(--mu)*208)] shrink-0 select-none flex-col rounded-2xl px-2.5 pb-3 pt-3.5")}>
      <div className="flex items-center gap-2 px-1">
        <span className="grid size-5 place-items-center rounded-md bg-(--tint) text-(--primary)">
          <Hash weight="bold" className="size-3" />
        </span>
        <span className="flex-1 text-3xs font-semibold uppercase tracking-[0.16em] text-(--faint)">Now reading</span>
        <span className="rounded-full bg-(--ink-6) px-1.5 py-0.5 font-mono text-[length:calc(var(--mu)*9)] tabular-nums text-(--muted-fg)">
          {Math.max(0, pos + 1)} / {headings.length}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-0.5 rounded-lg bg-(--ink-5) p-0.5 text-[length:calc(var(--mu)*11)] font-medium">
        <span className="rounded-md bg-(--sheet) py-1.5 text-center text-(--primary-ink) shadow-[0_calc(var(--mu)*1)_calc(var(--mu)*3)_color-mix(in_oklab,var(--fg)_12%,transparent)]">
          Outline
        </span>
        <span className="py-1.5 text-center text-(--muted-fg)">Links</span>
      </div>

      <div className="relative mt-2.5">
        <span
          aria-hidden
          className={cx(
            "absolute inset-x-0 top-0 h-[calc(var(--mu)*30)] rounded-lg bg-(--tint) transition-[transform,opacity] duration-220 ease-(--ease) motion-reduce:transition-none",
            pos < 0 && "opacity-0",
          )}
          style={{ transform: `translateY(calc(var(--mu) * ${ROW * Math.max(0, pos)}))` }}
        >
          <span className="absolute left-0 top-1/2 h-[58%] w-[calc(var(--mu)*3)] -translate-y-1/2 rounded-r-[calc(var(--mu)*3)] bg-(--primary) shadow-[0_0_calc(var(--mu)*10)_color-mix(in_oklab,var(--primary)_70%,transparent)]" />
        </span>
        <ul className="relative flex flex-col">
          {headings.map((h, i) => {
            const on = i === pos;
            const depth = Math.min(2, h.level - minLevel);
            return (
              <li key={`${h.idx}-${h.text}`}>
                <button
                  type="button"
                  onClick={() => onJump(h.idx)}
                  aria-current={on ? "location" : undefined}
                  title={h.text}
                  style={{ paddingLeft: `calc(var(--mu) * ${8 + depth * 12})` }}
                  className={cx(
                    "flex h-[calc(var(--mu)*30)] w-full cursor-pointer items-center gap-2 rounded-lg pr-1.5 text-left transition-colors duration-160",
                    on ? "text-(--primary-ink)" : "text-(--muted-fg) hover:bg-(--ink-4) hover:text-(--fg)",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--primary)",
                  )}
                >
                  <span
                    aria-hidden
                    className={cx(
                      "grid h-[calc(var(--mu)*15)] w-[calc(var(--mu)*19)] shrink-0 place-items-center rounded-[calc(var(--mu)*5)] font-mono text-[length:calc(var(--mu)*8)] font-semibold tabular-nums transition-colors duration-160",
                      on ? "bg-(--tint-2) text-(--primary-ink)" : "bg-(--ink-6) text-(--faint)",
                    )}
                  >
                    H{h.level}
                  </span>
                  <span className={cx("min-w-0 flex-1 truncate text-xs", on && "font-medium")}>{h.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {headings.length === 0 && (
          <p className="px-2 py-6 text-center text-2xs leading-relaxed text-(--muted-fg)">
            No headings yet. Start a line with <span className="font-mono">#</span>.
          </p>
        )}
      </div>

      <div className="mt-auto border-t border-(--line) px-1 pt-2.5">
        <div className="h-1 overflow-hidden rounded-full bg-(--ink-8)">
          <div
            className="h-full rounded-full bg-linear-90 from-(--primary) to-(--amber) transition-[width] duration-220 ease-(--ease) motion-reduce:transition-none"
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between font-mono text-[length:calc(var(--mu)*9.5)] tabular-nums text-(--faint)">
          <span>{pct}% read</span>
          <span>{left > 0 ? `${left} min left` : "the end"}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ command pill */

export function CommandPill() {
  return (
    <div
      aria-hidden
      className={cx(
        PILL,
        "pointer-events-none absolute bottom-3.5 left-1/2 z-20 flex -translate-x-1/2 select-none items-center gap-2 rounded-full py-2 pl-3.5 pr-2 text-[length:calc(var(--mu)*12.5)] font-medium text-(--muted-fg)",
      )}
    >
      <MagnifyingGlass className="size-4" />
      Search or create
      <span className="ml-1 inline-flex items-center gap-px rounded-[calc(var(--mu)*7)] bg-(--ink-8) px-1.5 py-0.5 text-2xs font-semibold text-(--primary-ink)">
        <Command weight="bold" className="size-2.5" />K
      </span>
    </div>
  );
}
