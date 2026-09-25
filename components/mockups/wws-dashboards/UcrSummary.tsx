"use client";

import type { CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowUp, CheckCircle } from "@phosphor-icons/react";
import { SERIES, fixed } from "./data";
import { LABEL, T10_5, T11, T13, T54 } from "./tokens";

/* Invented month-to-date figures, internally consistent (MT). */
const TOTAL = 1284.62;
const PREV = 1198.21;
const TARGET = 1650;
const WORKING_DAY = 19;
const WORKING_DAYS = 25;
const DAILY = TARGET / WORKING_DAYS;
const EXPECTED = DAILY * WORKING_DAY;

const PAYMENTS = [
  { label: "Cash", mt: 512.4, prev: 498.12 },
  { label: "Credit", mt: 398.75, prev: 377.9 },
  { label: "Digital", mt: 214.18, prev: 171.44 },
  { label: "RRP Pick Up", mt: 102.66, prev: 97.3 },
  { label: "RRP Drop Off", mt: 56.63, prev: 53.45 },
];

const COLLECTOR_TYPES = [
  { label: "Own fleet", mt: 611.24 },
  { label: "Transporter", mt: 355.87 },
  { label: "Dependent Collector", mt: 158.22 },
  { label: "RRP", mt: 159.29 },
];

const TAGS = [
  { label: "Drum", mt: 442.25 },
  { label: "iTank", mt: 842.37 },
];

const KPIS = [
  { label: "iTank collection", value: "842.37", unit: "MT", delta: 0.062, riseIsGood: true },
  { label: "Drum collection", value: "442.25", unit: "MT", delta: 0.098, riseIsGood: true },
  { label: "No. of collections", value: "3,412", delta: 0.041, riseIsGood: true },
  { label: "Zero collections", value: "118", delta: 0.124, riseIsGood: false },
];

const GOOD = "#0ca30c";
const CRITICAL = "#d03b3b";
const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
};

/** The app's `viz-grow`: bars scale in from the left once, on arrival. */
function Grow({ className, style, delay = 0 }: { className: string; style: CSSProperties; delay?: number }) {
  return (
    <motion.span
      className={className}
      style={{ ...style, originX: 0 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    />
  );
}

function Delta({ delta, riseIsGood }: { delta: number; riseIsGood: boolean }) {
  const up = delta > 0;
  const good = up ? riseIsGood : !riseIsGood;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span className={`flex items-center gap-1 ${T11} font-semibold tabular-nums`} style={{ color: good ? GOOD : CRITICAL }}>
      <Icon className="size-3" weight="bold" />
      {(Math.abs(delta) * 100).toFixed(1)}%
    </span>
  );
}

function Spotlight() {
  const pct = (TOTAL / TARGET) * 100;
  const expectedPct = (EXPECTED / TARGET) * 100;
  const stats = [
    { label: "Vs expected", value: `+${fixed(TOTAL - EXPECTED, 2)}`, good: true },
    { label: "Vs last month", value: `+${fixed(TOTAL - PREV, 2)}`, good: true },
    { label: "Daily target", value: fixed(DAILY, 2), good: false },
  ];
  const peak = Math.max(TOTAL, PREV);
  return (
    <section
      className="flex h-full flex-col items-center rounded-xl border border-[#2a322e] bg-[#151917] px-6 pb-5 pt-5 text-center"
      style={{ backgroundImage: "radial-gradient(120% 90% at 50% 0%, rgba(12, 163, 12, 0.13), transparent 62%)" }}
    >
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
        style={{ color: GOOD, background: "rgba(12, 163, 12, 0.13)" }}
      >
        <CheckCircle className="size-3.5" />
        On track
      </span>

      <p className={`mt-5 ${LABEL}`}>Monthly period collection</p>
      <p className={`mt-2 ${T54} font-semibold leading-none tracking-tight`}>{fixed(TOTAL, 2)}</p>
      <p className={`mt-2.5 ${T13} text-[#949e97]`}>
        MT of <span className="font-semibold text-[#f2f3f2]">{fixed(TARGET, 2)} MT</span> target
      </p>

      <div className="mt-5 w-full">
        <div className="relative h-[calc(var(--mu)*7)] rounded-full" style={{ background: "rgba(12, 163, 12, 0.15)" }}>
          <Grow className="block h-full rounded-full" style={{ width: `${pct}%`, background: GOOD }} />
          <span
            className="absolute -top-[calc(var(--mu)*5)] h-[calc(var(--mu)*17)] w-0.5 rounded-full bg-[#f2f3f2]/80"
            style={{ left: `calc(${expectedPct}% - var(--mu))` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-2xs tabular-nums text-[#949e97]/70">
          <span>{pct.toFixed(1)}% done</span>
          <span>expected {fixed(EXPECTED, 2)}</span>
        </div>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-4 border-t border-[#2a322e] pt-5 text-left">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-2xs font-semibold uppercase tracking-wider text-[#949e97]/70">{s.label}</p>
            <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight" style={s.good ? { color: GOOD } : undefined}>
              {s.value}
            </p>
          </div>
        ))}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-wider text-[#949e97]/70">Working days</p>
          <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">
            {WORKING_DAY}
            <span className="text-xs font-normal text-[#949e97]">/{WORKING_DAYS}</span>
          </p>
        </div>
      </div>

      <div className="mt-auto w-full pt-6 text-left">
        <p className="mb-3 text-2xs font-semibold uppercase tracking-wider text-[#949e97]/70">Month on month</p>
        {[
          { label: "This", value: TOTAL, strong: true },
          { label: "Last", value: PREV, strong: false },
        ].map((r) => (
          <div key={r.label} className="mb-2 flex items-center gap-2.5 last:mb-0">
            <span className={`w-9 shrink-0 ${T11} ${r.strong ? "text-[#f2f3f2]" : "text-[#949e97]"}`}>{r.label}</span>
            <span className="h-2 flex-1 rounded-full bg-[#232926]/60">
              <Grow
                className="block h-full rounded-full bg-[#f2f3f2]"
                style={{ width: `${(r.value / peak) * 100}%`, opacity: r.strong ? 0.85 : 0.32 }}
              />
            </span>
            <span
              className={`w-[calc(var(--mu)*52)] shrink-0 text-right text-xs tabular-nums ${
                r.strong ? "font-semibold" : "text-[#949e97]"
              }`}
            >
              {r.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function KpiStrip() {
  return (
    <section className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-[#2a322e] bg-[#2a322e]">
      {KPIS.map((k) => (
        <div key={k.label} className="bg-[#151917] px-3.5 pb-3.5 pt-3.5">
          <p className="text-3xs font-semibold uppercase tracking-wide text-[#949e97]">{k.label}</p>
          <p className="mt-2 text-2xl font-semibold leading-none tracking-tight">
            {k.value}
            {k.unit && <span className={`ml-1 ${T11} font-normal text-[#949e97]`}>{k.unit}</span>}
          </p>
          <div className="mt-2.5">
            <Delta delta={k.delta} riseIsGood={k.riseIsGood} />
          </div>
        </div>
      ))}
    </section>
  );
}

function PaymentComposition() {
  const total = PAYMENTS.reduce((s, p) => s + p.mt, 0);
  return (
    <section className="rounded-xl border border-[#2a322e] bg-[#151917] px-4 pb-4 pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className={LABEL}>By payment type</p>
        <span className="text-2xs text-[#949e97]/60">vs same period last month</span>
      </div>
      <div className="mt-3 flex h-7 gap-0.5">
        {PAYMENTS.map((p, i) => (
          <motion.div
            key={p.label}
            className="h-full first:rounded-l-md last:rounded-r-md"
            style={{ flex: `${(p.mt / total) * 100} 1 0`, background: SERIES[i], originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.75, ease: EASE, delay: i * 0.06 }}
          />
        ))}
      </div>
      <dl className="mt-3.5 grid grid-cols-5 gap-x-3">
        {PAYMENTS.map((p, i) => (
          <div key={p.label} className="min-w-0">
            <dt className="flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-xs" style={{ background: SERIES[i] }} />
              <span className={`truncate ${T11} text-[#949e97]`}>{p.label}</span>
            </dt>
            <dd className="mt-1 pl-3.5">
              <p className="text-sm font-semibold leading-none tabular-nums">
                {fixed(p.mt, 2)}
                <span className="ml-1 text-3xs font-normal text-[#949e97]">MT</span>
              </p>
              <p className="mt-1 text-3xs tabular-nums text-[#949e97]/60">prev {fixed(p.prev, 2)}</p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function BreakdownBars({ title, items }: { title: string; items: { label: string; mt: number }[] }) {
  const max = Math.max(...items.map((i) => i.mt));
  const total = items.reduce((s, i) => s + i.mt, 0);
  const ranked = [...items].sort((a, b) => b.mt - a.mt);
  return (
    <section className="flex flex-col rounded-xl border border-[#2a322e] bg-[#151917] px-4 pb-3.5 pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className={LABEL}>{title}</p>
        <span className="text-2xs text-[#949e97]/60">share of period total</span>
      </div>
      <ul className="mt-2.5">
        {ranked.map((item, i) => (
          <li key={item.label} className="py-[calc(var(--mu)*4.5)]">
            <div className="flex items-baseline gap-2">
              <span className="truncate text-xs text-[#949e97]">{item.label}</span>
              <span className="ml-auto text-xs font-semibold tabular-nums">{fixed(item.mt, 2)}</span>
              <span className={`w-[calc(var(--mu)*28)] shrink-0 text-right ${T10_5} tabular-nums text-[#949e97]/60`}>
                {((item.mt / total) * 100).toFixed(0)}%
              </span>
            </div>
            <span className="mt-1 block h-[calc(var(--mu)*6)] rounded-full bg-[#232926]/60">
              <Grow
                className="block h-full rounded-full"
                style={{ width: `${(item.mt / max) * 100}%`, background: SERIES[0] }}
                delay={i * 0.06}
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-baseline justify-between border-t border-[#2a322e] pt-2.5">
        <span className="text-xs text-[#949e97]">Total</span>
        <span className="text-sm font-semibold tabular-nums">
          {fixed(total, 2)}
          <span className="ml-1 text-2xs font-normal text-[#949e97]">MT</span>
        </span>
      </div>
    </section>
  );
}

/** UCR > Summary: month to date against target, and how it breaks down. */
export function UcrSummary() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid min-h-0 flex-1 grid-cols-[calc(var(--mu)*340)_1fr] gap-4"
    >
      <motion.div variants={fadeUp} className="min-h-0">
        <Spotlight />
      </motion.div>
      <div className="flex min-h-0 min-w-0 flex-col gap-3.5">
        <motion.div variants={fadeUp}>
          <KpiStrip />
        </motion.div>
        <motion.div variants={fadeUp}>
          <PaymentComposition />
        </motion.div>
        <motion.div variants={fadeUp} className="grid min-h-0 flex-1 grid-cols-2 gap-3.5">
          <BreakdownBars title="By collector type" items={COLLECTOR_TYPES} />
          <BreakdownBars title="By tag" items={TAGS} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export const UCR_SUBTITLE = "UCO Collection Report · 1-23 Sep 2026";
export const UCR_AS_OF = "23 Sep 2026";
