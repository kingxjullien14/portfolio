"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "@phosphor-icons/react";
import { NETWORK, WEEK_MINUTES, count, countUpTo, formatMinute, kg, type Week } from "./data";
import { createRenderer } from "./map-renderer";
import { INITIAL_PLAYBACK, createPlayback } from "./playback";
import { FOCUS, T11 } from "./tokens";

const SPEEDS = [0.5, 1, 2, 4] as const;

const serverSnapshot = () => INITIAL_PLAYBACK;

/**
 * The week on a map, with its transport.
 *
 * Mirrors the real Weekly Collection card: the map on top, the playback bar
 * under it, the depots legend (a separate card in the app) floated over the
 * empty sea so the whole thing fits one screen.
 */
export function ArcMap({ week, dim }: { week: Week; dim: boolean }) {
  const [playback] = useState(createPlayback);
  const state = useSyncExternalStore(playback.subscribe, playback.get, serverSnapshot);
  const areaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  // The renderer lives as long as the canvas does.
  useEffect(() => {
    const canvas = canvasRef.current;
    const area = areaRef.current;
    if (!canvas || !area) return;
    const renderer = createRenderer(canvas);

    const measure = () => {
      const rect = area.getBoundingClientRect();
      renderer.resize(rect.width, rect.height, Math.min(2, window.devicePixelRatio || 1));
      playback.redraw();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(area);
    measure();

    const io = new IntersectionObserver(([entry]) => playback.setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(area);
    const onVisibility = () => playback.setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    playback.attach(renderer);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      renderer.rebuildBase();
      playback.redraw();
    });

    return () => {
      alive = false;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      playback.detach();
      renderer.dispose();
    };
  }, [playback]);

  useEffect(() => {
    playback.setWeek(week);
  }, [playback, week]);

  useEffect(() => {
    playback.setReduced(reduced === true);
  }, [playback, reduced]);

  return (
    <section
      className={`overflow-hidden rounded-xl border border-[#2a322e] bg-[#151917] transition-opacity duration-200 ${
        dim ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div ref={areaRef} className="relative h-[calc(var(--mu)*312)] w-full overflow-hidden bg-[#0b0e0e]">
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
        <Legend week={week} />
      </div>
      <PlaybackBar
        week={week}
        t={state.t}
        playing={state.playing}
        speed={state.speed}
        onTogglePlay={playback.togglePlay}
        onSpeed={playback.setSpeed}
        onScrub={playback.scrub}
      />
    </section>
  );
}

function Legend({ week }: { week: Week }) {
  const { depots } = NETWORK;
  return (
    <div className="pointer-events-none absolute right-3 top-3 w-[calc(var(--mu)*300)] rounded-lg border border-white/[0.07] bg-[#0f1312]/80 px-3 pb-2.5 pt-2.5 backdrop-blur-sm">
      <div className="flex items-baseline justify-between">
        <p className="text-2xs font-semibold uppercase tracking-wider text-[#949e97]">Depots this week</p>
        <p className="text-3xs text-[#949e97]/60">kg · collections</p>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-[calc(var(--mu)*3)]">
        {depots.map((d, i) => (
          <li key={d.code} className={`flex items-center gap-2 ${T11} leading-[calc(var(--mu)*15)]`}>
            <span className="size-2 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="font-medium text-[#f2f3f2]">{d.code}</span>
            <span className="ml-auto tabular-nums text-[#949e97]">{kg(week.depotWeek[i].kg)}</span>
            <span className="w-[calc(var(--mu)*20)] text-right tabular-nums text-[#949e97]/60">
              {week.depotWeek[i].arcs}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlaybackBar({
  week,
  t,
  playing,
  speed,
  onTogglePlay,
  onSpeed,
  onScrub,
}: {
  week: Week;
  t: number;
  playing: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSpeed: (s: number) => void;
  onScrub: (t: number) => void;
}) {
  const shown = countUpTo(week, t);
  const shownKg = week.cumKg[shown];
  const label = formatMinute(week.offset, t * WEEK_MINUTES);

  const scrubAt = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onScrub((e.clientX - rect.left) / rect.width);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const hour = 60 / WEEK_MINUTES;
    const steps: Record<string, number> = {
      ArrowRight: hour,
      ArrowUp: hour,
      ArrowLeft: -hour,
      ArrowDown: -hour,
      PageUp: 24 * hour,
      PageDown: -24 * hour,
    };
    if (e.key in steps) onScrub(t + steps[e.key]);
    else if (e.key === "Home") onScrub(0);
    else if (e.key === "End") onScrub(1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-x-4 border-t border-[#2a322e] px-4 py-3">
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className={`flex size-8 shrink-0 items-center justify-center rounded-full! border border-[#2a322e] text-[#f2f3f2] transition-colors hover:bg-[#232926] ${FOCUS}`}
      >
        {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 translate-x-px" />}
      </button>

      <p className="w-[calc(var(--mu)*118)] shrink-0 text-xs font-medium tabular-nums text-[#f2f3f2]">{label}</p>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Position in the week"
        aria-valuemin={0}
        aria-valuemax={WEEK_MINUTES}
        aria-valuenow={Math.round(t * WEEK_MINUTES)}
        aria-valuetext={label}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          scrubAt(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) scrubAt(e);
        }}
        onKeyDown={onKey}
        className={`group relative h-5 min-w-0 flex-1 cursor-pointer touch-none rounded-full! ${FOCUS}`}
      >
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#282f2b]" />
        <span
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3987e5] shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition-transform group-active:scale-110"
          style={{ left: `${t * 100}%` }}
        />
      </div>

      <div
        role="group"
        aria-label="Playback speed"
        className="inline-flex h-7 shrink-0 items-center gap-0.5 rounded-md border border-[#2a322e] bg-[#1b1f1d] p-0.5"
      >
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={s === speed}
            onClick={() => onSpeed(s)}
            className={`h-6 rounded-sm! px-2 ${T11} tabular-nums transition-colors ${FOCUS} ${
              s === speed
                ? "bg-[#101412] font-medium text-[#f2f3f2] shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                : "text-[#949e97] hover:text-[#f2f3f2]"
            }`}
          >
            {s}&times;
          </button>
        ))}
      </div>

      <p className={`shrink-0 text-right ${T11} text-[#949e97]`}>
        <span className="tabular-nums text-[#f2f3f2]">{count(shown)}</span>
        {" of "}
        <span className="tabular-nums">{count(week.collections.length)}</span>
        {" collections · "}
        <span className="tabular-nums text-[#f2f3f2]">{kg(shownKg)}</span> kg
      </p>
    </div>
  );
}
