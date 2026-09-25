"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MockScreen } from "../MockScreen";
import { ChatPane, type ChatApi } from "./Chat";
import type { Command } from "./data";
import { FilesWindow, type FilesApi } from "./FilesWindow";
import s from "./osai.module.css";
import { Palette } from "./Palette";
import { Pet } from "./Pet";
import { Sidebar } from "./Sidebar";
import { cx, f } from "./ui";

/* the palette's resting box in design px (Palette: left-72.5 top-20) */
const PAL_LEFT = 290;
const PAL_TOP = 80;
const DESIGN_W = 1200;

const TOAST: Record<string, string> = {
  terminal: "terminal · zsh ready",
  notes: "notes · opened",
  browser: "browser · opened",
  settings: "settings · opened",
  updates: "up to date · v2.10",
};

function TrayPill({ dot, children }: { dot: string; children: ReactNode }) {
  return (
    <span className={cx(s.glassPill, "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-(--o-muted)", f.s11)}>
      <span className={cx("size-2 shrink-0 rounded-full", dot)} aria-hidden />
      {children}
    </span>
  );
}

/**
 * OSAI, the open-source superapp for driving AI coding agents, recreated at its
 * default 1200 x 780 window: sidebar, agent chat with a live composer, a
 * floating files window, the glass spirit, and the command palette (⌘K).
 */
export function OsaiMock({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chatRef = useRef<ChatApi>(null);
  const filesRef = useRef<FilesApi>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const petTimer = useRef<number | undefined>(undefined);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [origin, setOrigin] = useState("50% 0%");
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null);
  const [happy, setHappy] = useState(false);
  const [hop, setHop] = useState(0);

  // every loop pauses while the screen is offscreen or the tab is hidden
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let inView = true;
    let shown = document.visibilityState !== "hidden";
    const apply = () => {
      el.dataset.paused = inView && shown ? "false" : "true";
    };
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((en) => en.isIntersecting);
        apply();
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    const onVis = () => {
      shown = document.visibilityState !== "hidden";
      apply();
    };
    document.addEventListener("visibilitychange", onVis);
    apply();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const tt = toastTimer;
    const pt = petTimer;
    return () => {
      window.clearTimeout(tt.current);
      window.clearTimeout(pt.current);
    };
  }, []);

  const openPalette = (fromTrigger: boolean) => {
    const root = rootRef.current;
    const active = document.activeElement;
    returnFocus.current = active instanceof HTMLElement && root?.contains(active) ? active : triggerRef.current;
    const src = fromTrigger ? triggerRef.current?.getBoundingClientRect() : null;
    if (root && src) {
      // grow out of the ⌘K keycap: origin in the panel's own pixel space
      const r = root.getBoundingClientRect();
      const mu = r.width / DESIGN_W;
      setOrigin(`${src.left + src.width / 2 - (r.left + PAL_LEFT * mu)}px ${src.top + src.height / 2 - (r.top + PAL_TOP * mu)}px`);
    } else {
      setOrigin("50% 0%");
    }
    setPaletteOpen(true);
  };

  const closePalette = useCallback((restore: boolean = true) => {
    setPaletteOpen(false);
    const el = returnFocus.current;
    returnFocus.current = null;
    if (restore && el) window.requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);

  const onPaletteClose = useCallback(() => closePalette(true), [closePalette]);

  const showToast = (text: string) => {
    setToast((prev) => ({ text, key: (prev?.key ?? 0) + 1 }));
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1900);
  };

  const runCommand = (c: Command) => {
    closePalette(c.action === "toast");
    window.requestAnimationFrame(() => {
      if (c.action === "composer") chatRef.current?.focusComposer();
      else if (c.action === "resume") {
        chatRef.current?.jumpToLatest();
        chatRef.current?.focusComposer();
      } else if (c.action === "files") filesRef.current?.focusFilter();
      else showToast(TOAST[c.id] ?? c.title);
    });
  };

  const poke = () => {
    setHop((h) => h + 1);
    setHappy(true);
    window.clearTimeout(petTimer.current);
    petTimer.current = window.setTimeout(() => setHappy(false), 1300);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (paletteOpen) closePalette(true);
      else openPalette(false);
    }
  };

  return (
    <MockScreen
      w={DESIGN_W}
      h={780}
      label="OSAI desktop app, recreated: agent chat, a files window and a command palette"
      className={className}
    >
      <div ref={rootRef} className={cx(s.root, "font-ui")} onKeyDown={onKeyDown}>
        <div className="absolute inset-0" inert={paletteOpen}>
          <div className={s.stage} aria-hidden />
          <Sidebar uid={uid} paletteOpen={paletteOpen} onOpenPalette={() => openPalette(true)} triggerRef={triggerRef} />

          {/* the workspace floats as an inset card beside the sidebar */}
          <div className={cx(s.main, "absolute top-2 right-2 bottom-2 left-60 overflow-hidden rounded-xl")}>
            <div className={s.canvasGlow} aria-hidden />
            <ChatPane ref={chatRef} onRevealFile={(p) => filesRef.current?.reveal(p)} />
            <FilesWindow ref={filesRef} />

            <div role="group" aria-label="Minimized windows" className="absolute right-2 bottom-2 z-30 flex flex-col items-end gap-1">
              <TrayPill dot={s.dotActive}>pulse</TrayPill>
              <TrayPill dot="bg-(--o-warning)">terminal</TrayPill>
            </div>

            <Pet uid={uid} happy={happy} hop={hop} onPoke={poke} className="absolute right-27 bottom-3 z-40" />

            {toast ? (
              <div className="pointer-events-none absolute bottom-38 left-10 z-40 flex w-132.5 justify-center" role="status">
                <span
                  key={toast.key}
                  className={cx(s.glassPill, s.rise, "flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-(--o-text-2)", f.s11)}
                >
                  <span className="size-1.5 rounded-full bg-(--o-accent) shadow-(--o-glow-soft)" aria-hidden />
                  {toast.text}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <Palette open={paletteOpen} origin={origin} onClose={onPaletteClose} onRun={runCommand} />
        <div className={s.edge} aria-hidden />
      </div>
    </MockScreen>
  );
}
