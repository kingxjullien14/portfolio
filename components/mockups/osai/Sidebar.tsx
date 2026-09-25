"use client";

import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsClockwise,
  Bell,
  CaretDown,
  FolderPlus,
  Gauge,
  GearSix,
  MagnifyingGlass,
  Microphone,
  Play,
  Plus,
  Stack,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode, Ref } from "react";
import { TOOLS } from "./data";
import { cx, f, Ico } from "./ui";

function TrafficLights() {
  return (
    <div className="absolute top-2.5 left-4 z-10 flex gap-2" aria-hidden>
      <span className="size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.28)]" />
      <span className="size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.28)]" />
      <span className="size-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.28)]" />
    </div>
  );
}

/** The OSAI mark: a violet-to-cyan diamond on a dark squircle (public/osai.svg). */
function BrandMark({ uid }: { uid: string }) {
  return (
    <span className="relative grid size-8 shrink-0 place-items-center rounded-lg shadow-[0_0_calc(var(--mu)*16)_calc(var(--mu)*-5)_rgba(177,138,255,0.55)]">
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden focusable="false">
        <defs>
          <linearGradient id={`${uid}-d`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b18aff" />
            <stop offset="1" stopColor="#3de8ff" />
          </linearGradient>
          <linearGradient id={`${uid}-b`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#16131f" />
            <stop offset="1" stopColor="#0a0b10" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="15" fill={`url(#${uid}-b)`} />
        <rect x="1.5" y="1.5" width="61" height="61" rx="13.5" fill="none" stroke="#a78bfa" strokeOpacity="0.34" />
        <g transform="rotate(45 32 32)">
          <rect x="20" y="20" width="24" height="24" rx="5.5" fill={`url(#${uid}-d)`} opacity="0.3" />
          <rect x="22.5" y="22.5" width="19" height="19" rx="4.5" fill={`url(#${uid}-d)`} />
        </g>
      </svg>
    </span>
  );
}

function SpaceHeader({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between pr-1 pl-1.5">
      <span className={cx("flex items-center gap-1.5 py-1 font-mono tracking-[0.18em] text-(--o-faint) uppercase", f.s10)}>
        <Ico icon={CaretDown} className="size-2.75" />
        {label}
      </span>
      {right}
    </div>
  );
}

/** One rail row: icon chip + label. The real rows spawn tools; here they only answer hover. */
function Row({
  icon,
  label,
  sub,
  quiet,
  accentIcon,
}: {
  icon: Icon;
  label: string;
  sub?: string;
  quiet?: boolean;
  accentIcon?: boolean;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-lg py-1 pr-1 pl-1.5 transition-[background-color,translate] duration-150 ease-(--o-ease) hover:translate-x-0.5 hover:bg-(--o-panel-2)/80">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--o-panel-2)/70 transition-colors duration-150 group-hover:bg-(--o-accent-soft)">
        <Ico
          icon={icon}
          className={cx(
            "size-4.5 transition-colors duration-150",
            accentIcon ? "text-(--o-accent)" : "text-(--o-muted) group-hover:text-(--o-accent)",
          )}
        />
      </span>
      {sub ? (
        <span className="min-w-0 leading-tight">
          <span className={cx("block truncate text-(--o-text-2) group-hover:text-(--o-text)", f.s125)}>{label}</span>
          <span className={cx("block truncate text-(--o-faint)", f.s10)}>{sub}</span>
        </span>
      ) : (
        <span
          className={cx(
            "truncate transition-colors duration-150 group-hover:text-(--o-text)",
            f.s13,
            quiet ? "text-(--o-faint)" : "text-(--o-text-2)",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function PillIcon({ icon, children }: { icon: Icon; children?: ReactNode }) {
  return (
    <span className="relative grid size-7 place-items-center rounded-md text-(--o-muted) transition-colors hover:bg-(--o-panel-2) hover:text-(--o-text)">
      <Ico icon={icon} className="size-3.75" />
      {children}
    </span>
  );
}

export function Sidebar({
  uid,
  paletteOpen,
  onOpenPalette,
  triggerRef,
}: {
  uid: string;
  paletteOpen: boolean;
  onOpenPalette: () => void;
  triggerRef: Ref<HTMLButtonElement>;
}) {
  return (
    <aside aria-label="Sidebar" className="absolute inset-y-0 left-0 flex w-60 flex-col">
      <TrafficLights />
      {/* the brand diamond is the way home */}
      <div className="flex shrink-0 items-center pt-7 pr-1.5 pb-2 pl-2.5">
        <div className="flex items-center gap-2 rounded-md px-1.5 py-1">
          <BrandMark uid={uid} />
          <span className={cx("font-mono tracking-[0.16em] text-(--o-text-2)", f.s11)}>osai</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-2">
        <div className="flex flex-col gap-0.5">
          <SpaceHeader label="tools" />
          {TOOLS.map((t) => (
            <Row key={t.label} icon={t.icon} label={t.label} />
          ))}
        </div>
        <div className="flex flex-col gap-0.5 border-t border-(--o-border) pt-1.5">
          <SpaceHeader label="pinned" />
          <Row icon={Plus} label="pin a site" />
        </div>
        <div className="mt-1">
          <Row icon={FolderPlus} label="new space" quiet />
        </div>
        <div className="flex flex-col gap-2">
          <SpaceHeader
            label="agents"
            right={
              <span className="flex items-center gap-0.5 text-(--o-muted)" aria-hidden>
                <span className="grid size-5 place-items-center rounded-sm">
                  <Ico icon={Plus} className="size-3" />
                </span>
                <span className="grid size-5 place-items-center rounded-sm">
                  <Ico icon={ArrowsClockwise} className="size-3" />
                </span>
              </span>
            }
          />
          <Row icon={Play} label="spawn an oracle" sub="jul · offline" accentIcon />
        </div>
      </div>

      <div className="flex flex-col gap-1 p-2">
        <div className="mx-1 mb-1 h-px bg-linear-to-r from-transparent via-(--o-border-strong) to-transparent" />
        <Row icon={Gauge} label="usage" />
        <div className="flex justify-center px-1.5 pb-1">
          <div className="flex items-center gap-0.5 rounded-2xl border border-(--o-border) bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[calc(var(--mu)*12)]">
            <button
              ref={triggerRef}
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              aria-keyshortcuts="Meta+K Control+K"
              aria-haspopup="dialog"
              aria-expanded={paletteOpen}
              className="flex h-7 items-center gap-1.5 rounded-md pr-1 pl-1.5 text-(--o-muted) transition-colors hover:bg-(--o-panel-2) hover:text-(--o-text)"
            >
              <Ico icon={MagnifyingGlass} className="size-3.75" />
              <kbd
                className={cx(
                  "rounded-[calc(var(--mu)*4)] border border-(--o-border-strong) bg-white/[0.04] px-1 py-0.5 font-mono leading-none text-(--o-text-2)",
                  f.s95,
                )}
              >
                ⌘K
              </kbd>
            </button>
            <PillIcon icon={Stack} />
            <PillIcon icon={Microphone} />
            <PillIcon icon={Bell}>
              <span
                className={cx(
                  "absolute -top-0.5 -right-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-(--o-danger) px-0.75 leading-none font-bold text-(--o-bg)",
                  "text-[length:calc(var(--mu)*8)]",
                )}
              >
                2
              </span>
            </PillIcon>
          </div>
        </div>
        {/* account card: monogram, name, plan */}
        <div className="flex w-full items-center gap-2 rounded-lg border border-(--o-border) bg-(--o-panel-2)/40 px-2 py-1.5 backdrop-blur-[calc(var(--mu)*12)]">
          <span className={cx("grid size-7 shrink-0 place-items-center rounded-full bg-(--o-accent) font-bold text-(--o-bg)", f.s11)}>
            J
          </span>
          <span className="min-w-0 flex-1 text-center leading-tight">
            <span className={cx("block truncate text-(--o-text)", f.s12)}>jul</span>
            <span className={cx("block truncate text-(--o-muted)", f.s10)}>pro plan</span>
          </span>
          <Ico icon={GearSix} className="size-3.25 text-(--o-muted)" />
        </div>
      </div>

      {/* fold handle: a quiet pip on the sidebar's own edge */}
      <span className="absolute top-1/2 -right-0.5 h-10 w-0.75 -translate-y-1/2 rounded-full bg-(--o-border-strong) opacity-60" aria-hidden />
    </aside>
  );
}
