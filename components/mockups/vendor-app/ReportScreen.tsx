"use client";

import { CaretRight, Scales, Truck, Warning, Wrench, type Icon } from "@phosphor-icons/react";
import { useState } from "react";
import { MONTHLY_KG, REPORT, formatKg } from "./data";
import { tr, type Lang, type StrKey } from "./i18n";

/* Chart geometry in design px (the chart box is the card's 326 px content width). */
const CW = 326;
const PLOT_L = 26;
const PLOT_T = 8;
const PLOT_H = 92;
const LABEL_Y = PLOT_T + PLOT_H + 15;
const CH = LABEL_Y + 8;
const Y_MAX = 150;
const TICKS = [0, 50, 100, 150];
const BAND = (CW - PLOT_L) / MONTHLY_KG.length;
const BAR_W = 22;
const CURRENT = MONTHLY_KG.length - 1;

const f2 = (n: number) => Math.round(n * 100) / 100;
const yOf = (v: number) => f2(PLOT_T + PLOT_H * (1 - v / Y_MAX));

const BARS = MONTHLY_KG.map((m, i) => {
  const cx = f2(PLOT_L + BAND * i + BAND / 2);
  const x = f2(cx - BAR_W / 2);
  const top = yOf(m.kg);
  const bottom = PLOT_T + PLOT_H;
  const r = 4;
  const d = `M${x} ${bottom} V${f2(top + r)} A${r} ${r} 0 0 1 ${f2(x + r)} ${top} H${f2(x + BAR_W - r)} A${r} ${r} 0 0 1 ${f2(x + BAR_W)} ${f2(top + r)} V${bottom} Z`;
  return { ...m, cx, top, d };
});

export function ReportScreen({ lang }: { lang: Lang }) {
  const t = (key: StrKey) => tr(key, lang);
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? CURRENT;
  const bar = BARS[active];

  return (
    <div data-lenis-prevent="" className="absolute inset-0 overflow-y-auto bg-[#0D1F2D]">
      <div className="h-13.5" />
      <div className="flex h-14 items-center px-4">
        <div className="text-[length:calc(var(--mu)*20)] leading-[1.2] font-bold text-white">{t("reportTitle")}</div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
        <section className="rounded-xl bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-[length:calc(var(--mu)*13)] font-medium text-[#6B7280]">{t("totalUcoCollected")}</div>
            <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[length:calc(var(--mu)*11)] font-semibold text-[#374151]">
              {REPORT.year}
            </span>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="text-[length:calc(var(--mu)*30)] leading-[1.15] font-extrabold tracking-[-0.02em] text-[#111827]">{REPORT.yearKg}</span>
            <span className="ml-1 text-[length:calc(var(--mu)*13)] font-bold text-[#6B7280]">{t("kg")}</span>
          </div>

          <div className="relative mt-3" onPointerLeave={() => setHover(null)}>
            <svg viewBox={`0 0 ${CW} ${CH}`} className="block w-full" aria-hidden>
              {TICKS.map((v) => (
                <g key={v}>
                  <line x1={PLOT_L} x2={CW} y1={yOf(v)} y2={yOf(v)} stroke={v === 0 ? "#E5E7EB" : "#F1F2F4"} strokeWidth={1} />
                  <text
                    x={PLOT_L - 6}
                    y={yOf(v)}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontSize={9.5}
                    fill="#9CA3AF"
                    style={{ fontFamily: "var(--font-ui), system-ui, sans-serif" }}
                  >
                    {v}
                  </text>
                </g>
              ))}
              {BARS.map((b, i) => (
                <g key={b.month}>
                  <path
                    d={b.d}
                    fill={i === active ? "#10B981" : "#A7F3D0"}
                    className="transition-[fill] duration-150 motion-reduce:transition-none"
                  />
                  <text
                    x={b.cx}
                    y={LABEL_Y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10.5}
                    fontWeight={i === active ? 600 : 400}
                    fill={i === active ? "#111827" : "#6B7280"}
                    style={{ fontFamily: "var(--font-ui), system-ui, sans-serif" }}
                  >
                    {b.month}
                  </text>
                  <rect
                    x={b.cx - BAND / 2}
                    y={0}
                    width={BAND}
                    height={CH}
                    fill="transparent"
                    onPointerEnter={() => setHover(i)}
                  />
                </g>
              ))}
            </svg>
            <span
              aria-hidden
              className="pointer-events-none absolute rounded-sm bg-[#111827] px-1.5 py-[calc(var(--mu)*3)] text-[length:calc(var(--mu)*10)] leading-[1.2] font-semibold whitespace-nowrap text-white transition-[left,top] duration-150 motion-reduce:transition-none"
              style={{
                left: `calc(var(--mu) * ${Math.min(Math.max(bar.cx, 30), CW - 30)})`,
                top: `calc(var(--mu) * ${bar.top - 6})`,
                transform: "translate(-50%, -100%)",
              }}
            >
              {formatKg(bar.kg)} {t("kg")}
            </span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <StatTile Icon={Scales} label="Average per pickup" value={REPORT.avgKg} unit={t("kg")} />
          <StatTile Icon={Truck} label="Pickups this month" value={REPORT.pickupsThisMonth} />
        </div>

        <ReportAction Icon={Warning} title={t("logIncident")} desc={t("logIncidentDesc")} />
        <ReportAction Icon={Wrench} title={t("logService")} desc={t("logServiceDesc")} />
      </div>
    </div>
  );
}

function StatTile({ Icon, label, value, unit }: { Icon: Icon; label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <span className="grid size-8 place-items-center rounded-lg bg-[#ECFDF5]">
        <Icon weight="fill" className="size-4.5 text-[#059669]" />
      </span>
      <div className="mt-2.5 text-[length:calc(var(--mu)*12)] leading-[1.3] text-[#6B7280]">{label}</div>
      <div className="mt-1 flex items-baseline">
        <span className="text-[length:calc(var(--mu)*22)] leading-[1.15] font-extrabold tracking-[-0.01em] text-[#111827]">
          {value}
        </span>
        {unit ? <span className="ml-1 text-[length:calc(var(--mu)*12)] font-bold text-[#6B7280]">{unit}</span> : null}
      </div>
    </div>
  );
}

/** The app's own report entry cards (report_page.dart), shown as they appear. */
function ReportAction({ Icon, title, desc }: { Icon: Icon; title: string; desc: string }) {
  return (
    <div className="flex items-center rounded-xl bg-white p-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#F59E0B]/10">
        <Icon className="size-7 text-[#F59E0B]" />
      </span>
      <div className="ml-4 min-w-0 flex-1">
        <div className="text-[length:calc(var(--mu)*15)] font-semibold text-[#1F2937]">{title}</div>
        <div className="mt-1 text-[length:calc(var(--mu)*12)] leading-[1.4] text-[#6B7280]">{desc}</div>
      </div>
      <CaretRight className="ml-2 size-6 shrink-0 text-[#9CA3AF]" />
    </div>
  );
}
