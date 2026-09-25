/**
 * The week's playhead, kept outside React.
 *
 * The map repaints every frame, but only the transport bar needs to know the
 * playhead, so the loop lives in this small store: the canvas is drawn
 * straight from the frame callback, and React subscribers (the bar) re-render
 * through useSyncExternalStore. The loop only runs while it has somewhere to
 * draw, the map is on screen, the tab is visible and the week is playing.
 */

import type { Week } from "./data";
import type { Renderer } from "./map-renderer";

/** A full week plays in this long at 1x (the real app's pace). */
const PLAY_MS = 22_000;
/** The settled week holds this long before the loop starts over. */
const HOLD_MS = 1600;

export interface PlaybackState {
  t: number;
  playing: boolean;
  speed: number;
}

export const INITIAL_PLAYBACK: PlaybackState = { t: 0, playing: true, speed: 1 };

export interface Playback {
  subscribe(listener: () => void): () => void;
  get(): PlaybackState;
  attach(renderer: Renderer): void;
  detach(): void;
  redraw(): void;
  setInView(v: boolean): void;
  setPageVisible(v: boolean): void;
  setReduced(v: boolean): void;
  setWeek(week: Week): void;
  togglePlay(): void;
  setSpeed(speed: number): void;
  scrub(t: number): void;
}

export function createPlayback(): Playback {
  let state = INITIAL_PLAYBACK;
  const listeners = new Set<() => void>();
  let renderer: Renderer | null = null;
  let week: Week | null = null;
  let inView = false;
  let pageVisible = true;
  let reduced = false;
  let raf = 0;
  let last = 0;
  let hold = 0;

  const emit = () => {
    for (const l of listeners) l();
  };
  const set = (patch: Partial<PlaybackState>) => {
    state = { ...state, ...patch };
    emit();
  };
  const shouldRun = () => state.playing && inView && pageVisible && renderer !== null;

  const tick = (now: number) => {
    raf = 0;
    if (!shouldRun() || !renderer) return;
    const dt = Math.min(64, now - last);
    last = now;
    let t = state.t;
    if (hold > 0) {
      hold -= dt;
      if (hold <= 0) {
        hold = 0;
        t = 0;
      }
    } else {
      t += (dt / PLAY_MS) * state.speed;
      if (t >= 1) {
        t = 1;
        // Reduced motion never loops: the week plays once, on request.
        if (reduced) {
          renderer.draw(1);
          set({ t: 1, playing: false });
          return;
        }
        hold = HOLD_MS;
      }
    }
    renderer.draw(t);
    set({ t });
    raf = requestAnimationFrame(tick);
  };

  const sync = () => {
    if (shouldRun()) {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get: () => state,
    attach(r) {
      renderer = r;
      if (week) r.setWeek(week);
      r.draw(state.t);
      sync();
    },
    detach() {
      renderer = null;
      sync();
    },
    redraw() {
      renderer?.draw(state.t);
    },
    setInView(v) {
      inView = v;
      sync();
    },
    setPageVisible(v) {
      pageVisible = v;
      sync();
    },
    setReduced(v) {
      reduced = v;
      hold = 0;
      // The settled week: every trail, nothing moving.
      if (v) set({ t: 1, playing: false });
      renderer?.draw(state.t);
      sync();
    },
    setWeek(next) {
      if (next === week) return;
      week = next;
      hold = 0;
      // A new week starts over, the way the real map remounts per week.
      set(reduced ? { t: 1, playing: false } : { t: 0, playing: true });
      if (renderer) {
        renderer.setWeek(next);
        renderer.draw(state.t);
      }
      sync();
    },
    togglePlay() {
      hold = 0;
      if (!state.playing && state.t >= 1) set({ t: 0, playing: true });
      else set({ playing: !state.playing });
      renderer?.draw(state.t);
      sync();
    },
    setSpeed(speed) {
      set({ speed });
    },
    scrub(t) {
      hold = 0;
      // Scrubbing pauses, or the thumb fights the animation for the frame.
      set({ t: Math.min(1, Math.max(0, t)), playing: false });
      renderer?.draw(state.t);
      sync();
    },
  };
}
