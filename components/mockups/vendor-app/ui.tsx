"use client";

import {
  BatteryFull,
  Bell,
  CellSignalFull,
  Clock,
  House,
  User,
  Warning,
  WifiHigh,
  type Icon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { tr, type Lang, type StrKey } from "./i18n";

/** One design pixel, for inline styles (SVG sizes, computed paddings). */
export const mu = (n: number) => `calc(var(--mu) * ${n})`;

export type Tab = "home" | "history" | "report" | "notifications" | "profile";

export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const sync = () => setVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return visible;
}

/** iOS status bar: 54 tall, the centre kept clear for the dynamic island. */
export function StatusBar({ tone }: { tone: "light" | "dark" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 z-40 h-13.5 ${
        tone === "light" ? "text-white" : "text-[#0B0B0C]"
      }`}
    >
      <span className="absolute top-0 left-0 flex h-full w-34 items-center justify-center pt-1.5 text-[length:calc(var(--mu)*17)] leading-none font-semibold tracking-[-0.01em]">
        9:41
      </span>
      <span className="absolute top-0 right-0 flex h-full w-34 items-center justify-center gap-1.5 pt-1.5">
        <CellSignalFull weight="bold" className="size-4.5" />
        <WifiHigh weight="bold" className="size-4.5" />
        <BatteryFull weight="fill" className="size-6.5" />
      </span>
    </div>
  );
}

export function HomeIndicator({ tone }: { tone: "light" | "dark" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute bottom-2 left-1/2 z-40 h-1.25 w-33.5 -translate-x-1/2 rounded-full ${
        tone === "light" ? "bg-white" : "bg-[#0B0B0C]"
      }`}
    />
  );
}

const TABS: { id: Tab; key: StrKey; Icon: Icon }[] = [
  { id: "home", key: "navHome", Icon: House },
  { id: "history", key: "navHistory", Icon: Clock },
  { id: "report", key: "navReport", Icon: Warning },
  { id: "notifications", key: "navNotification", Icon: Bell },
  { id: "profile", key: "navProfile", Icon: User },
];

/** main_shell_page.dart: 60 tall #0D1F2D bar, selected tab in #00C853 on a 15% pill, scaled 1.15. */
export function BottomNav({
  lang,
  current,
  onSelect,
  reduce,
}: {
  lang: Lang;
  current: Tab;
  onSelect: (tab: Tab) => void;
  reduce: boolean;
}) {
  return (
    <nav
      aria-label="Main"
      className="absolute inset-x-0 bottom-0 z-10 h-23.5 bg-[#0D1F2D] shadow-[0_calc(var(--mu)*-5)_calc(var(--mu)*20)_rgba(0,0,0,0.2)]"
    >
      <div className="flex h-15 items-center justify-around px-1">
        {TABS.map(({ id, key, Icon }) => {
          const selected = id === current;
          return (
            <button
              key={id}
              type="button"
              aria-current={selected ? "page" : undefined}
              onClick={() => onSelect(id)}
              className={`group rounded-xl`}
            >
              <motion.span
                initial={false}
                animate={{ scale: selected ? 1.15 : 1 }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 13, mass: 0.8 }
                }
                className={`flex flex-col items-center rounded-xl px-2 py-1 transition-colors duration-200 ${
                  selected ? "bg-[#00C853]/15" : ""
                }`}
              >
                <Icon
                  weight={selected ? "fill" : "regular"}
                  className={`size-5.5 ${selected ? "text-[#00C853]" : "text-white/38"}`}
                />
                <span
                  className={`mt-0.5 text-[length:calc(var(--mu)*10)] leading-[1.2] whitespace-nowrap ${
                    selected ? "font-semibold text-[#00C853]" : "text-white/38"
                  }`}
                >
                  {tr(key, lang)}
                </span>
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
