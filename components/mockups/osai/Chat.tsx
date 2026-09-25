"use client";

import {
  ArrowDown,
  ArrowUp,
  CaretDown,
  ChatCenteredText,
  Check,
  CheckCircle,
  CircleNotch,
  ClockCounterClockwise,
  Copy,
  Folder,
  House,
  ImageSquare,
  ListChecks,
  Microphone,
  ShieldCheck,
  Square,
  Target,
  Terminal,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useReducedMotion } from "framer-motion";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import s from "./osai.module.css";
import { CODE, REPLY_WORDS, STEPS, TOK_COLOR, type Tone } from "./data";
import { clock, cx, f, Ico } from "./ui";

export type ChatApi = { focusComposer: () => void; jumpToLatest: () => void };

type Exchange = {
  id: number;
  text: string;
  time: string;
  shown: number;
  tool: "pending" | "running" | "done";
  done: boolean;
  stopped: boolean;
};

type Tick = { frac: number; kind: string };

/* the simulated run: words stream in, then one tool call runs and settles */
const WORD_START = 520;
const WORD_MS = 72;
const TOOL_MS = 1500;
const TEXT_END = WORD_START + REPLY_WORDS.length * WORD_MS;
const RUN_END = TEXT_END + TOOL_MS;
const MAX_EXCHANGES = 3;
const CODE_TEXT = CODE.map((line) => line.map(([t]) => t).join("")).join("\n");

const toneClass: Record<Tone, string> = {
  add: "text-(--o-success)/80",
  del: "text-(--o-danger)/80",
  ok: "text-(--o-success)",
  fail: "text-(--o-danger)",
  dim: "text-(--o-faint)",
};

const tickClass: Record<string, string> = {
  user: "w-2.25 bg-(--o-accent)",
  change: "w-2.25 bg-(--o-success)",
  assistant: "w-1.5 bg-(--o-text-2)/60",
  activity: "w-1.5 bg-(--o-border-strong)",
};

/* ------------------------------------------------------------------ */

function TabStrip({ busy }: { busy: boolean }) {
  return (
    <div
      className={cx(s.glassPill, "absolute top-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-0.5 rounded-full px-1.5 py-1")}
      aria-label="Open conversations"
      role="group"
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full text-(--o-muted)">
        <Ico icon={House} className="size-3.25" />
      </span>
      <span className={cx("rounded-full px-2 py-0.5 font-mono text-(--o-muted)", f.s11)}>ledger-export</span>
      <span className={cx("rounded-full px-2 py-0.5 font-mono text-(--o-muted)", f.s11)}>chat</span>
      <span
        className={cx("flex items-center gap-1.5 rounded-full bg-(--o-accent-soft) py-0.5 pr-1 pl-2 font-mono text-(--o-accent)", f.s11)}
        aria-current="true"
      >
        {busy ? <span className={cx(s.busyDot, "size-1.5 shrink-0 rounded-full bg-(--o-accent)")} aria-hidden /> : null}
        payout-retry
        <span className="grid size-4 place-items-center rounded-full opacity-70" aria-hidden>
          <Ico icon={X} className="size-2.75" />
        </span>
      </span>
      <span className="grid size-6 shrink-0 place-items-center rounded-full text-(--o-muted)">
        <Ico icon={ChatCenteredText} className="size-3.25" />
      </span>
    </div>
  );
}

function YouCard({ time, text, entering }: { time: string; text: string; entering?: boolean }) {
  return (
    <div data-tick="user" className={cx("flex flex-col items-end", entering && s.rise)}>
      <div className={cx(s.you, "w-fit max-w-[82%] overflow-hidden rounded-2xl")}>
        <div className={cx("flex items-center gap-2 border-b border-(--o-accent)/18 px-3.5 py-1.5 font-mono", f.s105)}>
          <span className="size-1.75 shrink-0 rounded-full bg-(--o-accent) shadow-(--o-glow-soft)" aria-hidden />
          <span className="tracking-[0.05em] text-(--o-text-2)">YOU</span>
          <span className="ml-auto pl-6 text-(--o-faint) tabular-nums">{time}</span>
        </div>
        <p className={cx("px-3.5 py-2.5 leading-[1.625] break-words whitespace-pre-wrap text-(--o-text)", f.s135)}>{text}</p>
      </div>
    </div>
  );
}

function Frame({
  live,
  meta,
  entering,
  children,
}: {
  live?: boolean;
  meta: ReactNode;
  entering?: boolean;
  children: ReactNode;
}) {
  return (
    <div data-tick="assistant" className={cx(s.frame, "overflow-hidden rounded-2xl", entering && s.rise)}>
      <div className={cx("flex items-center gap-2 border-b border-(--o-border)/70 px-3.5 py-2 font-mono", f.s105)}>
        <span
          aria-hidden
          className={cx(
            "size-1.75 shrink-0 rounded-full",
            live
              ? "bg-(--o-accent) shadow-(--o-glow-soft)"
              : "bg-(--o-success) shadow-[0_0_calc(var(--mu)*7)_rgba(74,222,128,0.6)]",
          )}
        />
        <span className="tracking-[0.06em] text-(--o-text-2)">
          OSAI · <span className="uppercase">opus 4.8</span>
        </span>
        <span className="ml-auto text-(--o-faint) tabular-nums">{live ? <span className={s.breathe}>streaming</span> : meta}</span>
      </div>
      <div className="flex flex-col gap-3 p-3.5">{children}</div>
    </div>
  );
}

function StaticSteps({ count }: { count: number }) {
  return (
    <div data-tick="activity" className={cx(s.tool, "flex items-center gap-2 rounded-xl px-3 py-1.5 text-(--o-muted)", f.s125)}>
      <Ico icon={Terminal} className="size-3 text-(--o-faint)" />
      <span>{count} steps</span>
      <Ico icon={CaretDown} className="ml-auto size-3 -rotate-90 text-(--o-faint)" />
    </div>
  );
}

function StepsCard({
  open,
  onToggle,
  buttonRef,
}: {
  open: boolean;
  onToggle: () => void;
  buttonRef: Ref<HTMLButtonElement>;
}) {
  const listId = useId();
  return (
    <div data-tick="change" className={cx(s.tool, "flex flex-col overflow-hidden rounded-xl")}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
        className={cx(
          "group flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left text-(--o-muted) transition-colors duration-150 hover:text-(--o-text-2)",
          f.s125,
        )}
      >
        <Ico icon={Terminal} className="size-3 text-(--o-faint) transition-colors group-hover:text-(--o-muted)" />
        <span>14 steps</span>
        <span className={cx("ml-auto flex gap-1.5 font-mono tabular-nums", f.s10)} aria-label="213 lines added, 13 removed">
          <span className="text-(--o-success)/70">+213</span>
          <span className="text-(--o-danger)/70">-13</span>
        </span>
        <Ico
          icon={CaretDown}
          className={cx("size-3 text-(--o-faint) transition-transform duration-200 ease-(--o-ease)", open ? "" : "-rotate-90")}
        />
      </button>
      {open ? (
        <ol id={listId} className="flex flex-col border-t border-(--o-border) px-3 py-1.5">
          {STEPS.map((st, i) => (
            <li
              key={i}
              className={cx("flex items-center gap-2 py-px font-mono leading-[1.5]", f.s11, s.rise)}
              style={{ animationDelay: `${Math.min(i, 9) * 22}ms` } as CSSProperties}
            >
              <Ico icon={st.icon} className="size-3 shrink-0 text-(--o-faint)" />
              <span className="w-[5.5ch] shrink-0 text-(--o-text-2)">{st.verb}</span>
              <span className="min-w-0 truncate text-(--o-muted)">{st.target}</span>
              <span className="ml-auto flex shrink-0 gap-1.5 pl-2 tabular-nums">
                {st.meta.map((m) => (
                  <span key={m.text} className={toneClass[m.tone]}>
                    {m.text}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-(--o-panel) px-1 py-0.5 font-mono text-[0.85em] text-(--o-text)">{children}</code>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const t = timer;
    return () => window.clearTimeout(t.current);
  }, []);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 1400);
          })
          .catch(() => {});
      }}
      className="grid size-5 place-items-center rounded-sm text-(--o-faint) transition-colors hover:bg-(--o-panel-2) hover:text-(--o-text)"
    >
      <Ico icon={copied ? Check : Copy} className={cx("size-3", copied && "text-(--o-success)")} />
    </button>
  );
}

function CodeBlock() {
  return (
    <div className={cx(s.code, "overflow-hidden rounded-xl")}>
      <div className="flex items-center justify-between border-b border-(--o-border) py-1 pr-2 pl-3">
        <span className={cx("font-mono text-(--o-faint)", f.s105)}>ts</span>
        <CopyButton text={CODE_TEXT} />
      </div>
      <pre className={cx("overflow-x-auto px-3 py-2.5 font-mono leading-[1.625]", f.s12)}>
        <code>
          {CODE.map((line, li) => (
            <Fragment key={li}>
              {line.map(([t, k], ti) => (
                <span key={ti} style={{ color: TOK_COLOR[k] }} className={k === "com" ? "italic" : undefined}>
                  {t}
                </span>
              ))}
              {li < CODE.length - 1 ? "\n" : null}
            </Fragment>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** The seam OSAI draws where the session's context was compacted. */
function CompactionRule() {
  return (
    <div className={cx("my-1 flex items-center gap-2.5 text-(--o-faint)", f.s11)}>
      <span className="h-px flex-1 bg-(--o-border)" aria-hidden />
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <Ico icon={ClockCounterClockwise} className="size-2.75 text-(--o-accent)" />
        compacted · 118.4k to 12.1k tokens · saved 90% · auto
      </span>
      <span className="h-px flex-1 bg-(--o-border)" aria-hidden />
    </div>
  );
}

const LOG: readonly (readonly [string, string, string, string, Tone])[] = [
  ["14:02:11", "payout.created", "evt_8f2a", "bank timeout after 12s", "dim"],
  ["14:02:23", "payout.created", "evt_8f2a", "redelivered by provider", "dim"],
  ["14:02:24", "transfer.sent ", "tr_91c4 ", "second transfer, same event", "fail"],
];

function DeliveryLog() {
  return (
    <div className={cx(s.code, "overflow-hidden rounded-xl")}>
      <div className="flex items-center border-b border-(--o-border) py-1.5 pl-3">
        <span className={cx("font-mono text-(--o-faint)", f.s105)}>log · staging deliveries</span>
      </div>
      <pre className={cx("overflow-x-auto px-3 py-2.5 font-mono leading-[1.625]", f.s11)}>
        <code>
          {LOG.map(([t, ev, id, note, tone], i) => (
            <Fragment key={i}>
              <span className="text-(--o-faint)">{t}</span>
              {"  "}
              <span className="text-(--o-text-2)">{ev}</span>
              {"  "}
              <span className="text-(--o-cyan)/80">{id}</span>
              {"  "}
              <span className={tone === "fail" ? "text-(--o-danger)" : "text-(--o-warning)/80"}>{note}</span>
              {i < LOG.length - 1 ? "\n" : null}
            </Fragment>
          ))}
        </code>
      </pre>
    </div>
  );
}

function ResultFooter({ children }: { children: ReactNode }) {
  return <div className={cx("text-center font-mono text-(--o-faint) tabular-nums", f.s105)}>{children}</div>;
}

function ToolChip({ state }: { state: "running" | "done" }) {
  const running = state === "running";
  return (
    <div
      className={cx(
        "flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono transition-colors duration-300",
        f.s11,
        running ? "border-(--o-accent)/30 bg-(--o-accent-soft)" : "border-(--o-border) bg-(--o-panel)/40",
      )}
    >
      {running ? (
        <Ico icon={CircleNotch} weight="bold" className={cx(s.spin, "size-3 text-(--o-accent)")} />
      ) : (
        <Ico icon={CheckCircle} weight="fill" className="size-3 text-(--o-success)/85" />
      )}
      <span className="text-(--o-text-2)">read</span>
      <span className="text-(--o-muted)">src/webhooks/payout.ts</span>
      <span className="text-(--o-faint)">{running ? "running" : "212 lines"}</span>
    </div>
  );
}

function LiveTurn({ ex, elapsed }: { ex: Exchange; elapsed: number }) {
  const text = REPLY_WORDS.slice(0, ex.shown).join(" ");
  const typing = !ex.done && ex.shown < REPLY_WORDS.length;
  return (
    <Frame live={!ex.done} entering meta={ex.stopped ? "stopped" : "worked 3s · 1 step"}>
      {ex.shown === 0 && !ex.done ? (
        <div className={cx("flex items-center gap-1.5 text-(--o-muted)", f.s125)}>
          <Ico icon={CircleNotch} weight="bold" className={cx(s.spin, "size-3.25 text-(--o-accent)")} />
          <span>Working… {clock(elapsed)}</span>
        </div>
      ) : (
        <p className={cx("leading-[1.625] text-(--o-text-2)", f.s145)}>
          {text}
          {typing ? <span className={s.caret} aria-hidden /> : null}
        </p>
      )}
      {ex.tool !== "pending" ? <ToolChip state={ex.tool} /> : null}
    </Frame>
  );
}

function EffortTicks({ filled }: { filled: number }) {
  const heights = ["h-1", "h-[calc(var(--mu)*5.5)]", "h-1.75", "h-[calc(var(--mu)*8.5)]", "h-2.5"];
  return (
    <span className="flex h-2.5 items-end gap-0.5" aria-hidden>
      {heights.map((h, i) => (
        <span key={h} className={cx("w-0.75 rounded-[calc(var(--mu)*1)]", h, i < filled ? "bg-(--o-accent)" : "bg-white/14")} />
      ))}
    </span>
  );
}

function RailIcon({ icon, className }: { icon: typeof Folder; className?: string }) {
  return (
    <span className={cx("grid size-7 shrink-0 place-items-center rounded-full text-(--o-muted)", className)} aria-hidden>
      <Ico icon={icon} className="size-3.25" />
    </span>
  );
}

/* ------------------------------------------------------------------ */

export function ChatPane({
  ref,
  onRevealFile,
}: {
  ref?: Ref<ChatApi>;
  onRevealFile: (path: string) => void;
}) {
  const reduced = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stepsBtnRef = useRef<HTMLButtonElement>(null);
  const anchorTop = useRef<number | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const nextId = useRef(1);

  const [stepsOpen, setStepsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<Exchange[]>([]);
  const [sentCount, setSentCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [showJump, setShowJump] = useState(false);

  const streaming = sent.some((e) => !e.done);

  /* --- scroll rail: thumb follows the real scroll, ticks map the real blocks --- */
  const syncThumb = useCallback(() => {
    const sc = scrollerRef.current;
    const thumb = thumbRef.current;
    if (!sc || !thumb) return;
    const H = sc.scrollHeight;
    const h = sc.clientHeight;
    const max = Math.max(0, H - h);
    const st = sc.scrollTop;
    // column-reverse scrollers count from the bottom: 0 at rest, negative going up
    const fromTop = st <= 0 ? max + st : st;
    const size = H > 0 ? h / H : 1;
    thumb.style.top = `${(H > 0 ? fromTop / H : 0) * 100}%`;
    thumb.style.height = `${Math.max(size * 100, 6)}%`;
    thumb.style.opacity = size >= 0.995 ? "0" : "1";
    // scale-free threshold: more than a sliver of the view away from the bottom
    setShowJump(max - fromTop > h * 0.14);
  }, []);

  const measureTicks = useCallback(() => {
    const sc = scrollerRef.current;
    const content = contentRef.current;
    if (!sc || !content) return;
    const H = sc.scrollHeight || 1;
    const base = Math.max(0, H - content.offsetHeight);
    const next: Tick[] = [];
    content.querySelectorAll<HTMLElement>("[data-tick]").forEach((el) => {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node && node !== content) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      next.push({ frac: Math.min(0.995, (base + top) / H), kind: el.dataset.tick ?? "assistant" });
    });
    setTicks((prev) =>
      prev.length === next.length && prev.every((p, i) => Math.abs(p.frac - next[i].frac) < 0.002 && p.kind === next[i].kind)
        ? prev
        : next,
    );
  }, []);

  useEffect(() => {
    const sc = scrollerRef.current;
    const content = contentRef.current;
    if (!sc || !content) return;
    const ro = new ResizeObserver(() => {
      syncThumb();
      measureTicks();
    });
    ro.observe(sc);
    ro.observe(content);
    return () => ro.disconnect();
  }, [syncThumb, measureTicks]);

  /* keep the steps toggle under the pointer when the list opens or closes */
  useLayoutEffect(() => {
    const sc = scrollerRef.current;
    const btn = stepsBtnRef.current;
    if (anchorTop.current == null || !sc || !btn) return;
    sc.scrollTop += btn.getBoundingClientRect().top - anchorTop.current;
    anchorTop.current = null;
  }, [stepsOpen]);

  const toggleSteps = () => {
    anchorTop.current = stepsBtnRef.current?.getBoundingClientRect().top ?? null;
    setStepsOpen((o) => !o);
  };

  const jumpToLatest = useCallback(() => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  useImperativeHandle(
    ref,
    () => ({
      focusComposer: () => inputRef.current?.focus({ preventScroll: true }),
      jumpToLatest,
    }),
    [jumpToLatest],
  );

  useEffect(() => {
    const t = timerRef;
    return () => window.clearInterval(t.current);
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text || streaming) return;
    const d = new Date();
    const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const id = nextId.current++;
    const instant = reduced === true;
    setSent((prev) =>
      [
        ...prev,
        {
          id,
          text,
          time,
          shown: instant ? REPLY_WORDS.length : 0,
          tool: instant ? "done" : "pending",
          done: instant,
          stopped: false,
        } satisfies Exchange,
      ].slice(-MAX_EXCHANGES),
    );
    setSentCount((c) => c + 1);
    setDraft("");
    setElapsed(0);
    window.requestAnimationFrame(() => {
      scrollerRef.current?.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
    });
    if (instant) return;
    const t0 = performance.now();
    window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      const el = performance.now() - t0;
      const shown = Math.max(0, Math.min(REPLY_WORDS.length, Math.floor((el - WORD_START) / WORD_MS) + 1));
      const tool: Exchange["tool"] = el < TEXT_END ? "pending" : el < RUN_END ? "running" : "done";
      const done = el >= RUN_END;
      setElapsed(el);
      setSent((prev) => prev.map((ex) => (ex.id === id && !ex.done ? { ...ex, shown, tool, done } : ex)));
      if (done) window.clearInterval(timerRef.current);
    }, 60);
  };

  const stop = () => {
    window.clearInterval(timerRef.current);
    setSent((prev) =>
      prev.map((ex) => (ex.done ? ex : { ...ex, done: true, stopped: true, tool: ex.tool === "running" ? "done" : ex.tool })),
    );
    inputRef.current?.focus({ preventScroll: true });
  };

  const estTok = 120 + Math.ceil(draft.length / 4);
  const msgs = 5 + sentCount * 2;
  const ready = draft.trim().length > 0;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div
        ref={scrollerRef}
        onScroll={syncThumb}
        className={cx(s.fadeTop, "flex min-h-0 flex-1 flex-col-reverse overflow-y-auto")}
        aria-label="Conversation"
        role="region"
      >
        <div ref={contentRef} className="relative pt-14 pb-5 pl-10">
          <div className="flex w-132.5 flex-col gap-4">
            <CompactionRule />
            <YouCard time="14:21" text="payouts double-send when the bank times out. can you find out why?" />
            <Frame meta="worked 38s">
              <StaticSteps count={6} />
              <p className={cx("leading-[1.625] text-(--o-text-2)", f.s145)}>
                Found it. A bank timeout is treated as a hard failure, so the provider redelivers the webhook and we
                transfer again. The idempotency check only runs after the transfer succeeds.
              </p>
              <DeliveryLog />
              <ResultFooter>38s · 9.1k tok</ResultFooter>
            </Frame>

            <YouCard time="14:32" text="add retry with exponential backoff to the payout webhook handler, keep it idempotent" />
            <Frame meta="worked 1m 12s">
              <StepsCard open={stepsOpen} onToggle={toggleSteps} buttonRef={stepsBtnRef} />
              <div className={cx("flex flex-col gap-2.5 leading-[1.625] text-(--o-text-2)", f.s145)}>
                <p>
                  Done. Payouts now retry transient failures with exponential backoff and full jitter: 5 attempts, 200 ms
                  base, capped at 8 s.
                </p>
                <p>
                  Each attempt reuses the key from <InlineCode>event.id</InlineCode>, so a retry can never pay out twice.
                  The wrapper lives in{" "}
                  <button
                    type="button"
                    onClick={() => onRevealFile("src/lib/retry.ts")}
                    className="rounded-sm bg-(--o-panel) px-1 py-0.5 font-mono text-[0.85em] text-(--o-accent) underline decoration-(--o-accent)/35 underline-offset-2 transition-colors hover:decoration-(--o-accent)"
                    aria-label="src/lib/retry.ts, reveal in files"
                  >
                    src/lib/retry.ts
                  </button>
                  .
                </p>
              </div>
              <CodeBlock />
              <ResultFooter>1m 12s · 18.4k tok</ResultFooter>
            </Frame>

            {sent.map((ex) => (
              <Fragment key={ex.id}>
                <YouCard time={ex.time} text={ex.text} entering />
                <LiveTurn ex={ex} elapsed={elapsed} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* footer: session readout + the composer deck */}
      <div className="relative shrink-0 border-t border-(--o-border)/50 bg-linear-to-t from-(--o-bg) via-(--o-bg)/95 to-(--o-bg)/70 pt-2 pb-3.5">
        <div className="ml-10 w-132.5">
          <div className={cx("mb-1.5 flex items-center px-1 font-mono text-(--o-faint) tabular-nums", f.s105)}>
            <span>{estTok} est tok</span>
            <span className="ml-auto text-(--o-muted)">{msgs} msgs · 2d 6h</span>
          </div>

          <div className={cx(s.deck, streaming && s.deckLive, "rounded-2xl")}>
            <div className="pointer-events-none absolute inset-x-4 top-[calc(var(--mu)*3)] z-10" aria-hidden>
              <div className="h-0.5 overflow-hidden rounded-full bg-white/5">
                <div className={s.filFill} style={{ width: streaming ? "37%" : "34%" }}>
                  {streaming ? <span className={s.filSheen} /> : null}
                </div>
              </div>
            </div>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              aria-label="Message the agent"
              placeholder={streaming ? "steer the model…" : "ask, or describe a task: / for commands, @ for files"}
              spellCheck={false}
              autoComplete="off"
              className={cx(
                "block w-full bg-transparent px-4 pt-3 pb-1.5 leading-[1.625] text-(--o-text) outline-none placeholder:text-(--o-faint)",
                f.s135,
              )}
            />
            <div className="mx-3 h-px bg-linear-to-r from-transparent via-(--o-accent)/28 to-transparent" aria-hidden />
            <div className="flex items-center gap-1 px-2.5 pt-1.5 pb-2">
              <div className="flex min-w-0 items-center gap-1" aria-hidden>
                <span className={cx("flex items-center gap-1 rounded-full bg-(--o-panel-2)/45 px-2 py-0.75 text-(--o-muted)", f.s11)}>
                  <Ico icon={Folder} className="size-3" />
                  kingx
                  <Ico icon={CaretDown} className="size-2.75 text-(--o-faint)" />
                </span>
                <span className="grid size-7 place-items-center rounded-full">
                  <Ico icon={ShieldCheck} className="size-3.5 text-(--o-accent)" />
                </span>
                <RailIcon icon={ListChecks} />
                <RailIcon icon={Target} />
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-1">
                {streaming ? (
                  <span
                    className={cx("flex h-7 items-center gap-1.5 rounded-full bg-(--o-panel-2)/45 px-2.5 font-mono text-(--o-muted) tabular-nums", f.s95)}
                  >
                    <span className="size-1.5 rounded-full bg-(--o-accent) shadow-(--o-glow-soft)" aria-hidden />
                    working · {clock(elapsed)}
                  </span>
                ) : (
                  <>
                    <RailIcon icon={ImageSquare} />
                    <RailIcon icon={Microphone} />
                  </>
                )}
                <span
                  aria-hidden
                  className={cx(
                    "flex items-center gap-1.5 rounded-full border border-(--o-accent)/38 bg-(--o-accent)/12 px-2.5 py-1 text-(--o-text)",
                    f.s115,
                  )}
                >
                  <span className="size-1.5 rounded-full bg-(--o-accent) shadow-[0_0_calc(var(--mu)*6)_rgba(242,101,34,0.7)]" />
                  <span className="font-medium">opus 4.8</span>
                  <EffortTicks filled={4} />
                  <Ico icon={CaretDown} className="size-2.75 text-(--o-faint)" />
                </span>
                <RailIcon icon={CaretDown} />
                {streaming ? (
                  <button
                    type="button"
                    onClick={stop}
                    aria-label="Stop the run"
                    className={cx(s.orbStop, "grid size-8 shrink-0 place-items-center rounded-full")}
                  >
                    <Ico icon={Square} weight="fill" className="size-2.75" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={send}
                    disabled={!ready}
                    aria-label="Send message"
                    className={cx(
                      "grid size-8 shrink-0 place-items-center rounded-full transition-[background-color,box-shadow,color,transform] duration-150 active:scale-95",
                      ready ? s.orbReady : "border border-(--o-border-strong) bg-(--o-panel-2)/70 text-(--o-faint)",
                    )}
                  >
                    <Ico icon={ArrowUp} weight="bold" className="size-3.75" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll rail: position thumb + a tick per block (accent = your prompts) */}
      <div className="pointer-events-none absolute top-3 right-0.75 bottom-24 z-20 w-2.5" aria-hidden>
        <div ref={thumbRef} className={cx(s.thumb, "absolute right-0.5 w-1.5 rounded-full opacity-0")} />
        {ticks.map((t, i) => (
          <span key={i} className={cx("absolute right-0 h-0.5 rounded-full", tickClass[t.kind] ?? tickClass.assistant)} style={{ top: `${t.frac * 100}%` }} />
        ))}
      </div>

      {showJump ? (
        <button
          type="button"
          onClick={jumpToLatest}
          aria-label="Scroll to latest"
          className={cx(
            s.glassPill,
            "absolute bottom-37 left-146 z-20 grid size-9 place-items-center rounded-full text-(--o-text-2) transition-colors hover:text-(--o-accent)",
          )}
        >
          <Ico icon={ArrowDown} className="size-3.75" />
        </button>
      ) : null}

      <TabStrip busy={streaming} />
      <span className="sr-only" aria-live="polite">
        {sent.length > 0 && sent[sent.length - 1].done ? "Reply finished" : ""}
      </span>
    </div>
  );
}
