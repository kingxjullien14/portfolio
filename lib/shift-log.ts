"use client";

import { useSyncExternalStore } from "react";
import type { UnitId } from "@/lib/data";

/**
 * The visitor's shift log: every unit they inspect is stamped once, with the
 * time, and stays on the board across visits (localStorage). Nothing leaves
 * the browser.
 */
export type LogEntry = { id: UnitId; at: number };

const KEY = "shift-log";
const EMPTY: LogEntry[] = [];
let entries: LogEntry[] | null = null;
const listeners = new Set<() => void>();

function load(): LogEntry[] {
  if (entries) return entries;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as LogEntry[]) : [];
    entries = Array.isArray(parsed) ? parsed.filter((e) => e && typeof e.id === "string" && typeof e.at === "number") : [];
  } catch {
    entries = [];
  }
  return entries;
}

function emit() {
  listeners.forEach((l) => l());
}

export function stampUnit(id: UnitId) {
  const current = load();
  if (current.some((e) => e.id === id)) return;
  entries = [...current, { id, at: Date.now() }];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* private mode: keep it in memory */
  }
  emit();
}

export function clearShiftLog() {
  entries = [];
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      entries = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useShiftLog(): LogEntry[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

export function clock(at: number) {
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
