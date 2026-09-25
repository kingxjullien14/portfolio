"use client";

import {
  ArrowRightIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  CalendarDotsIcon,
  CheckCircleIcon,
  ClockIcon,
  RadioButtonIcon,
  TrendDownIcon,
  TrendUpIcon,
  WrenchIcon,
  XCircleIcon,
  type Icon,
} from "@phosphor-icons/react";
import { CollectionsChart } from "./CollectionsChart";
import { ACTIVITY, STATS, type Activity, type Stat } from "./data";
import { cn } from "./ui";

const STAT_ICON: Record<Stat["icon"], Icon> = {
  day: CalendarDotsIcon,
  week: CalendarBlankIcon,
  month: CalendarCheckIcon,
  pending: ClockIcon,
};

const CARD_SHADOW = "shadow-[0_1px_3px_rgba(20,40,30,0.07),0_1px_2px_rgba(20,40,30,0.04)]";

function StatCard({ stat }: { stat: Stat }) {
  const StatIcon = STAT_ICON[stat.icon];
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E1EAE6] bg-white bg-[linear-gradient(135deg,rgba(168,214,91,0.14)_0%,rgba(64,180,127,0.1)_50%,rgba(44,183,194,0.16)_100%)] px-4 py-4",
        CARD_SHADOW,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[length:calc(var(--mu)*11)] font-semibold uppercase leading-[calc(var(--mu)*14)] tracking-[0.06em] text-[#5B6C65]">
          <div>{stat.title[0]}</div>
          <div>{stat.title[1]}</div>
        </div>
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#2EB860]/12 text-[#1E9A4D]">
          <StatIcon aria-hidden className="size-4" />
        </div>
      </div>
      <div className="mt-2 text-[length:calc(var(--mu)*28)] font-bold leading-8 tracking-[-0.025em] tabular-nums">{stat.value}</div>
      <div className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[length:calc(var(--mu)*13)] leading-5 text-[#5B6C65] tabular-nums">
        <span>{stat.detail}</span>
        {stat.trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 text-[length:calc(var(--mu)*11)] font-semibold leading-[calc(var(--mu)*17)]",
              stat.trend.dir === "up" ? "bg-[#23954D]/12 text-[#1F8A46]" : "bg-[#EF4343]/10 text-[#D63535]",
            )}
          >
            {stat.trend.dir === "up" ? (
              <TrendUpIcon aria-hidden weight="bold" className="size-3" />
            ) : (
              <TrendDownIcon aria-hidden weight="bold" className="size-3" />
            )}
            {stat.trend.value}
          </span>
        ) : null}
      </div>
      {stat.flag ? (
        <div className="mt-1">
          <span className="inline-flex rounded-full border border-[#D78109]/25 bg-[#D78109]/14 px-2 text-[length:calc(var(--mu)*11)] font-semibold leading-[calc(var(--mu)*16)] text-[#B86E07]">
            {stat.flag}
          </span>
        </div>
      ) : (
        <div className="mt-0.5 text-xs leading-4 text-[#5B6C65]/80">{stat.sub}</div>
      )}
    </div>
  );
}

const ACTIVITY_STYLE: Record<Activity["kind"], { icon: Icon; tile: string }> = {
  completed: { icon: CheckCircleIcon, tile: "bg-[#23954D]/10 text-[#23954D]" },
  request: { icon: RadioButtonIcon, tile: "bg-[#107AC6]/10 text-[#107AC6]" },
  pending: { icon: ClockIcon, tile: "bg-[#D78109]/12 text-[#C47508]" },
  scheduled: { icon: WrenchIcon, tile: "bg-[#107AC6]/10 text-[#107AC6]" },
  cancelled: { icon: XCircleIcon, tile: "bg-[#EF4343]/10 text-[#DE3434]" },
};

function ActivityCard() {
  return (
    <div className={cn("flex min-h-0 flex-col rounded-xl border border-[#E1EAE6] bg-white p-4", CARD_SHADOW)}>
      <div className="px-1 pt-1">
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold leading-6 tracking-[-0.02em]">Recent Activity</div>
          <span className="-mr-1 inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium text-[#1A2822]">
            View all
            <ArrowRightIcon aria-hidden className="size-3" />
          </span>
        </div>
        <div className="text-[length:calc(var(--mu)*13)] leading-5 text-[#5B6C65]">Latest collection events across your outlets</div>
      </div>
      <ul className="mt-2.5 flex flex-col gap-px">
        {ACTIVITY.map((a) => {
          const s = ACTIVITY_STYLE[a.kind];
          const ActivityIcon = s.icon;
          return (
            <li key={a.ref} className="flex items-start gap-3 rounded-lg px-2 py-[calc(var(--mu)*5)]">
              <span className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg", s.tile)}>
                <ActivityIcon aria-hidden className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[length:calc(var(--mu)*13)] leading-[calc(var(--mu)*17)] text-[#1A2822]">
                  {a.before}
                  <span className="font-semibold">{a.strong}</span>
                  {a.after}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs leading-4 text-[#5B6C65] tabular-nums">
                  <span>{a.time}</span>
                  <span aria-hidden className="size-[calc(var(--mu)*3)] rounded-full bg-[#5B6C65]/50" />
                  <span className="text-[#5B6C65]/80">{a.ref}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4">
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.icon} stat={s} />
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_calc(var(--mu)*332)] gap-4">
        <CollectionsChart />
        <ActivityCard />
      </div>
    </div>
  );
}
