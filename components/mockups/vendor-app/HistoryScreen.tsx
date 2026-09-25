"use client";

import { CaretDown, CaretRight, Drop, Recycle } from "@phosphor-icons/react";
import { Fragment } from "react";
import { HISTORY, HISTORY_FILTERS, STATUS_STYLE, USER, type HistoryEntry, type HistoryFilter } from "./data";
import { tr, type Lang, type StrKey } from "./i18n";

export function HistoryScreen({
  lang,
  filter,
  onFilter,
}: {
  lang: Lang;
  filter: HistoryFilter | null;
  onFilter: (f: HistoryFilter | null) => void;
}) {
  const t = (key: StrKey) => tr(key, lang);
  const rows = filter ? HISTORY.filter((h) => h.status === filter) : HISTORY;
  const months = [...new Set(rows.map((r) => r.month))];

  return (
    <div className="absolute inset-0 flex flex-col bg-[#F7F8FA]">
      <div className="shrink-0 bg-linear-to-br from-[#10B981] via-[#34D399] to-[#6EE7B7] px-6 pt-17.5 pb-6">
        <div className="text-[length:calc(var(--mu)*22)] font-bold text-white">{t("historyTitle")}</div>
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[length:calc(var(--mu)*14)] font-medium text-white/90 italic">
            {t("lifetimeUco")}
            <Drop className="size-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[length:calc(var(--mu)*44)] leading-none font-extrabold tracking-[-0.034em] text-white">
              {USER.lifetimeKg}
            </span>
            <span className="text-[length:calc(var(--mu)*16)] font-bold text-white/80">{t("historyKg")}</span>
          </div>
        </div>
      </div>

      <div data-lenis-prevent="" className="shrink-0 overflow-x-auto bg-white px-4 py-3">
        <div className="flex w-max gap-2">
          <span className="flex items-center rounded-[calc(var(--mu)*20)] border border-[#E5E7EB] bg-white py-2 pr-3 pl-3.5">
            <span className="text-[length:calc(var(--mu)*13)] font-medium text-[#374151]">{t("filterDate")}</span>
            <CaretDown weight="bold" className="ml-0.5 size-3.5 text-[#374151]" />
          </span>
          {HISTORY_FILTERS.map(({ id, key }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onFilter(active ? null : id)}
                className={`rounded-[calc(var(--mu)*20)] border px-3.5 py-2 text-[length:calc(var(--mu)*13)] font-medium transition-colors duration-150 ${
                  active ? "border-[#111827] bg-[#111827] text-white" : "border-[#E5E7EB] bg-white text-[#374151]"
                }`}
              >
                {t(key)}
              </button>
            );
          })}
        </div>
      </div>

      <div data-lenis-prevent="" className="min-h-0 flex-1 overflow-y-auto px-4">
        {rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pb-6">
            <span className="grid place-items-center rounded-[calc(var(--mu)*20)] bg-[#10B981]/10 p-6">
              <Recycle className="size-12 text-[#10B981]" />
            </span>
            <div className="mt-5 text-[length:calc(var(--mu)*16)] font-medium text-[#9CA3AF]">{t("noHistory")}</div>
          </div>
        ) : (
          <>
            {months.map((month) => (
              <Fragment key={month}>
                <div className="pt-4 pb-2 pl-1 text-[length:calc(var(--mu)*13)] font-medium text-[#9CA3AF]">{month}</div>
                {rows
                  .filter((r) => r.month === month)
                  .map((r) => (
                    <HistoryCard key={r.id} entry={r} lang={lang} />
                  ))}
              </Fragment>
            ))}
            <div className="py-6 text-center text-[length:calc(var(--mu)*13)] text-[#B0B7C3]">{t("historyEnd")}</div>
          </>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ entry, lang }: { entry: HistoryEntry; lang: Lang }) {
  const badge = STATUS_STYLE[entry.status];
  const paid = entry.status === "completed";
  return (
    <div className="mb-2 flex items-center rounded-xl bg-white px-3.5 py-3.5 shadow-[0_calc(var(--mu)*2)_calc(var(--mu)*8)_rgba(0,0,0,0.04)]">
      <span className="grid size-10.5 shrink-0 place-items-center rounded-[calc(var(--mu)*10)] bg-[#F3F4F6]">
        <Recycle weight="bold" className="size-5.5 text-[#6B7280]" />
      </span>
      <div className="ml-3 min-w-0 flex-1">
        <div className="truncate text-[length:calc(var(--mu)*14)] font-semibold text-[#111827]">{entry.chit}</div>
        <div className="mt-0.5 truncate text-[length:calc(var(--mu)*12)] text-[#9CA3AF]">{entry.date}</div>
        <div className={`mt-0.5 text-[length:calc(var(--mu)*12)] font-semibold tabular-nums ${paid ? "text-[#059669]" : "text-[#9CA3AF]"}`}>
          RM {entry.rm}
        </div>
      </div>
      <div className="ml-2 flex shrink-0 flex-col items-end">
        <div className="flex items-baseline">
          <span className="text-[length:calc(var(--mu)*18)] leading-[1.2] font-extrabold text-[#111827] tabular-nums">{entry.kg}</span>
          <span className="ml-[calc(var(--mu)*3)] text-[length:calc(var(--mu)*11)] font-semibold text-[#6B7280]">
            {tr("historyKg", lang)}
          </span>
        </div>
        <span
          className="mt-1 rounded-md px-2.5 py-[calc(var(--mu)*3)] text-[length:calc(var(--mu)*10)] leading-[1.2] font-bold whitespace-nowrap"
          style={{ backgroundColor: badge.bg, color: badge.fg }}
        >
          {tr(badge.key, lang)}
        </span>
      </div>
      <CaretRight weight="bold" className="ml-2 size-4.5 shrink-0 text-[#D1D5DB]" />
    </div>
  );
}
