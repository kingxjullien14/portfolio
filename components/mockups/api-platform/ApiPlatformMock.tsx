"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowsClockwise,
  BookOpen,
  CaretDown,
  ClockCounterClockwise,
  Copy,
  GearSix,
  Graph,
  Keyboard,
  MagicWand,
  Play,
  Plus,
  X,
} from "@phosphor-icons/react";
import { MockScreen } from "../MockScreen";
import { BOOT_LOGS, HEADERS, QUERY, RESPONSE, VARIABLES, planRun, type Level, type Line, type LogLine, type TokenType } from "./tokens";

// GraphiQL's CodeMirror palette
const TONE: Record<TokenType, string> = {
  kw: "text-[#B11A04]",
  def: "text-[#D2054E]",
  prop: "text-[#1F61A0]",
  attr: "text-[#8B2BB9]",
  str: "text-[#D64292]",
  num: "text-[#2882F9]",
  punc: "text-[#555a64]",
  plain: "",
  key0: "text-[#1F61A0]",
  key: "text-[#1F61A0]",
};

const LEVEL: Record<Level, string> = {
  info: "text-[#4ade80]",
  http: "text-[#60a5fa]",
  debug: "text-[#a1a1aa]",
  warn: "text-[#fbbf24]",
};

function Code({ lines, numbered = true }: { lines: Line[]; numbered?: boolean }) {
  return (
    <div className="font-mono text-[length:calc(var(--mu)*13)] leading-[calc(var(--mu)*21)]">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          {numbered ? (
            <span className="w-8 shrink-0 pr-3 text-right text-[#b3b8c2] select-none">{i + 1}</span>
          ) : null}
          <span className="whitespace-pre">
            {line.map(([t, v], j) => (
              <span key={j} className={TONE[t]}>
                {v}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ApiPlatformMock({ className }: { className?: string }) {
  const [tab, setTab] = useState<"variables" | "headers">("headers");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ms: number } | null>(null);
  const [logs, setLogs] = useState<LogLine[]>(BOOT_LOGS);
  const runs = useRef(0);
  const timers = useRef<number[]>([]);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = logEnd.current?.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  function run() {
    if (running) {
      // GraphiQL's run button stops an in-flight request
      timers.current.forEach(clearTimeout);
      timers.current = [];
      const plan = planRun(runs.current - 1);
      setLogs((l) => [...l, plan.abort].slice(-40));
      setRunning(false);
      return;
    }
    const plan = planRun(runs.current);
    runs.current += 1;
    setRunning(true);
    setResult(null);
    plan.steps.forEach(({ after, line }) => {
      timers.current.push(window.setTimeout(() => setLogs((l) => [...l, line].slice(-40)), after));
    });
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false);
        setResult({ ms: plan.ms });
      }, plan.wait),
    );
  }

  return (
    <MockScreen w={1000} h={620} label="Recreated GraphiQL playground of the API platform, synthetic data" className={className}>
      <div className="flex h-full bg-[#f1f2f5] font-ui text-[#3b4252]">
        {/* GraphiQL icon rail */}
        <aside className="flex w-13 shrink-0 flex-col items-center gap-1 border-r border-[#e3e5ea] bg-[#f7f8fa] py-3">
          <span className="mb-2 grid size-9 place-items-center rounded-xl text-[#E10098]">
            <Graph weight="bold" className="size-6" />
          </span>
          {[BookOpen, ClockCounterClockwise].map((Icon, i) => (
            <span key={i} className={`grid size-9 place-items-center rounded-lg ${i === 0 ? "bg-[#e9ebf0] text-[#3b4252]" : "text-[#8a909c]"}`}>
              <Icon className="size-5" />
            </span>
          ))}
          <span className="mt-auto grid size-9 place-items-center text-[#8a909c]">
            <ArrowsClockwise className="size-5" />
          </span>
          <span className="grid size-9 place-items-center text-[#8a909c]">
            <Keyboard className="size-5" />
          </span>
          <span className="grid size-9 place-items-center text-[#8a909c]">
            <GearSix className="size-5" />
          </span>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* session tabs */}
          <div className="flex h-11 items-center gap-2 px-3">
            <span className="flex h-8 items-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-[#1f2430] shadow-[0_1px_2px_rgba(20,24,40,0.08)]">
              OutletCollections
              <X className="size-3.5 text-[#9aa0ab]" />
            </span>
            <span className="grid size-7 place-items-center rounded-md text-[#8a909c]">
              <Plus className="size-4" />
            </span>
            <span className="ml-auto text-xs text-[#8a909c]">
              GraphQL Yoga <span className="text-[#b3b8c2]">at</span> api.demo/graphql
            </span>
            <span className="mx-1 text-sm font-semibold tracking-tight">
              Graph<span className="italic">i</span>QL
            </span>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 px-2 pb-2">
            {/* query editor */}
            <section className="flex min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(20,24,40,0.06)]">
              <div className="flex min-h-0 flex-1">
                <div className="min-w-0 flex-1 overflow-hidden px-2 pt-3">
                  <Code lines={QUERY} />
                </div>
                <div className="flex flex-col items-center gap-2 px-2 pt-3">
                  <button
                    type="button"
                    onClick={run}
                    aria-label={running ? "Stop request" : "Run query"}
                    className="grid size-9 place-items-center rounded-lg bg-[#E10098] text-white shadow-[0_2px_6px_rgba(225,0,152,0.35)] transition-transform active:scale-95"
                  >
                    {running ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <Play weight="fill" className="size-4" />
                    )}
                  </button>
                  <span className="grid size-8 place-items-center text-[#8a909c]">
                    <MagicWand className="size-4.5" />
                  </span>
                  <span className="grid size-8 place-items-center text-[#8a909c]">
                    <Copy className="size-4.5" />
                  </span>
                </div>
              </div>
              {/* variables and headers */}
              <div className="border-t border-[#eceef2]">
                <div className="flex h-9 items-center gap-1 px-2">
                  {(["variables", "headers"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      aria-pressed={tab === t}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                        tab === t ? "bg-[#f1f2f5] text-[#1f2430]" : "text-[#8a909c]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <CaretDown className="ml-auto mr-1 size-4 text-[#8a909c]" />
                </div>
                <div className="h-26 overflow-hidden px-2 pb-2">
                  <Code lines={tab === "headers" ? HEADERS : VARIABLES} />
                </div>
              </div>
            </section>

            {/* result */}
            <section className="relative flex min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(20,24,40,0.06)]">
              <div className="flex h-9 items-center justify-between border-b border-[#eceef2] px-3 text-xs">
                <span className="font-medium text-[#6b7180]">Response</span>
                {result ? (
                  <span className="flex items-center gap-2 font-mono text-[#15803d]">
                    <span className="size-1.5 rounded-full bg-[#22c55e]" />
                    200 OK · {result.ms} ms
                  </span>
                ) : running ? (
                  <span className="font-mono text-[#8a909c]">fetching</span>
                ) : null}
              </div>
              <div className="min-h-0 flex-1 overflow-hidden px-3 pt-3">
                {result ? (
                  <Code lines={RESPONSE} numbered={false} />
                ) : (
                  <div className="grid h-full place-items-center pb-10 text-center text-sm text-[#9aa0ab]">
                    <p className="max-w-60">
                      {running ? "Waiting for the server..." : "Press the pink play button to fetch the last three collections for outlet SGR-0142."}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* server log */}
          <div className="h-32 shrink-0 bg-[#0f1115] px-4 py-2.5 font-mono text-[length:calc(var(--mu)*11.5)] leading-[calc(var(--mu)*18)] text-[#d4d4d8]">
            <div className="mb-1 flex items-center justify-between text-[#71717a]">
              <span>api-platform · winston</span>
              <span>tail -f</span>
            </div>
            <div className="h-[calc(var(--mu)*90)] overflow-hidden">
              {logs.map((l) => (
                <div key={l.id} className="flex gap-3 whitespace-nowrap">
                  <span className="text-[#71717a]">{l.ts}</span>
                  <span className={`w-10 shrink-0 ${LEVEL[l.level]}`}>{l.level}</span>
                  <span className="w-14 shrink-0 text-[#a78bfa]">{l.label}</span>
                  <span className="truncate">{l.msg}</span>
                </div>
              ))}
              <div ref={logEnd} />
            </div>
          </div>
        </div>
      </div>
    </MockScreen>
  );
}
