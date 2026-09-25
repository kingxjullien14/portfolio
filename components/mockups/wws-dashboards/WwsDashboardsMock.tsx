"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  ArrowCounterClockwise,
  ArrowsClockwise,
  ArrowsLeftRight,
  CalendarBlank,
  CalendarDots,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretUpDown,
  CheckCircle,
  ClipboardText,
  Drop,
  Files,
  FileText,
  Moon,
  Pulse,
  Scales,
  SidebarSimple,
  Storefront,
  Timer,
  Truck,
  type IconProps,
} from "@phosphor-icons/react";
import { MockScreen } from "../MockScreen";
import { ArcMap } from "./ArcMap";
import { UCR_AS_OF, UCR_SUBTITLE, UcrSummary } from "./UcrSummary";
import { MAX_COLOURED_DEPOTS, NETWORK, count, getWeek, kg, weekLabel } from "./data";
import { FOCUS, LABEL, T11, T27 } from "./tokens";

type View = "weekly" | "ucr";
type Icon = ComponentType<IconProps>;

interface NavItem {
  title: string;
  icon: Icon;
  view?: View;
  chevron?: "closed" | "open";
  sub?: { title: string; icon: Icon; view: View }[];
}

/** The sidebar follows the oil: due, collected, at the depot, reported. */
const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Today", items: [{ title: "At a Glance", icon: Pulse }] },
  {
    label: "Collection",
    items: [
      { title: "CDR", icon: Files, chevron: "closed" },
      { title: "Collection Completion", icon: CheckCircle },
      { title: "Collection Movement", icon: Truck },
      { title: "Outlet Movement", icon: Storefront },
      { title: "Weekly Collection", icon: CalendarDots, view: "weekly" },
    ],
  },
  {
    label: "At the depot",
    items: [
      { title: "QnQs", icon: ClipboardText },
      { title: "Stock Balance", icon: Scales },
      { title: "Stock Movement", icon: ArrowsLeftRight },
    ],
  },
  {
    label: "Reporting",
    items: [
      { title: "UCR", icon: FileText, chevron: "open", sub: [{ title: "Summary", icon: FileText, view: "ucr" }] },
      { title: "SLA Report", icon: Timer },
    ],
  },
];

const INK = "text-[#f2f3f2]";
const MUTED = "text-[#949e97]";
const SIDE_FG = "text-[#e3e8e5]";

/** A MYT wall clock for the freshness stamp, read only when a refresh lands. */
function mytClock(ms: number): string {
  const s = Math.floor(ms / 1000) + 8 * 3600;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600) % 24)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function NavRow({
  item,
  active,
  collapsed,
  onSelect,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onSelect?: () => void;
}) {
  const I = item.icon;
  const body = (
    <>
      <I className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
      {!collapsed && item.chevron && (
        <CaretRight
          className={`ml-auto size-4 shrink-0 transition-transform duration-200 ${item.chevron === "open" ? "rotate-90" : ""}`}
        />
      )}
    </>
  );
  const cls = `flex h-8 w-full items-center gap-2 overflow-hidden p-2 text-left text-sm ${SIDE_FG} ${
    collapsed ? "justify-center" : ""
  } ${active ? "bg-[#1a2821] font-medium" : ""}`;
  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? item.title : undefined}
        className={`${cls} rounded-md! transition-colors hover:bg-[#1a2821] ${FOCUS}`}
      >
        {body}
      </button>
    );
  }
  return <div className={`${cls} rounded-md`}>{body}</div>;
}

function Sidebar({ view, collapsed, onView }: { view: View; collapsed: boolean; onView: (v: View) => void }) {
  return (
    <div
      className={`relative shrink-0 transition-[width] duration-200 ease-linear ${collapsed ? "w-16" : "w-64"}`}
    >
      <div
        className={`absolute inset-y-0 left-0 p-2 transition-[width] duration-200 ease-linear ${
          collapsed ? "w-[calc(var(--mu)*66)]" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[linear-gradient(180deg,#16221c_0%,#0b140f_100%)]">
          {/* Brand */}
          <div className="p-2">
            <div className={`flex h-12 items-center gap-2 rounded-md ${collapsed ? "justify-center" : "p-2"}`}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#2eb860_0%,#13703a_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <Drop weight="fill" className="size-[calc(var(--mu)*17)] text-white" />
              </span>
              {!collapsed && (
                <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className={`truncate font-semibold ${SIDE_FG}`}>WWS Dashboards</span>
                  <span className={`truncate text-xs ${MUTED}`}>v0.1.0</span>
                </span>
              )}
            </div>
          </div>

          {/* Groups */}
          <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
            {GROUPS.map((g) => (
              <div key={g.label} className="flex flex-col px-2 py-1">
                <p
                  className={`flex h-7 shrink-0 items-center px-2 text-xs font-medium text-[#e3e8e5]/70 transition-[margin,opacity] duration-200 ease-linear ${
                    collapsed ? "-mt-7 opacity-0" : ""
                  }`}
                >
                  {g.label}
                </p>
                <div className="flex flex-col gap-1">
                  {g.items.map((item) => (
                    <div key={item.title}>
                      <NavRow
                        item={item}
                        collapsed={collapsed}
                        active={item.view === view}
                        onSelect={item.view ? () => onView(item.view as View) : undefined}
                      />
                      {item.sub && !collapsed && (
                        <div className="mx-3.5 mt-1 flex translate-x-px flex-col gap-1 border-l border-[#1e2924] px-2.5 py-0.5">
                          {item.sub.map((s) => {
                            const SubIcon = s.icon;
                            const on = s.view === view;
                            return (
                              <button
                                key={s.title}
                                type="button"
                                onClick={() => onView(s.view)}
                                aria-current={on ? "page" : undefined}
                                className={`flex h-7 -translate-x-px items-center gap-2 overflow-hidden rounded-md! px-2 text-left text-sm ${SIDE_FG} transition-colors hover:bg-[#1a2821] ${FOCUS} ${
                                  on ? "bg-[#1a2821] font-medium" : ""
                                }`}
                              >
                                <SubIcon className="size-4 shrink-0" />
                                <span className="truncate">{s.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Signed-in user */}
          <div className="p-2">
            <div className={`flex h-12 items-center gap-2 rounded-md ${collapsed ? "justify-center" : "p-2"}`}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2eb860] text-xs text-white">
                AZ
              </span>
              {!collapsed && (
                <>
                  <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className={`truncate font-semibold ${SIDE_FG}`}>Aina Zulkifli</span>
                    <span className={`truncate text-xs ${MUTED}`}>aina.z@wws.example</span>
                  </span>
                  <CaretUp className={`ml-auto size-4 shrink-0 ${SIDE_FG}`} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page furniture                                                      */
/* ------------------------------------------------------------------ */

function PageHeader({
  title,
  subtitle,
  asOf,
  busy,
  onRefresh,
}: {
  title: string;
  subtitle: string;
  asOf: string;
  busy: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0">
        <p className={`text-xl font-semibold tracking-tight ${INK}`}>{title}</p>
        <p className={`text-xs ${MUTED}`}>{subtitle}</p>
      </div>
      <div className={`flex items-center gap-2 text-xs ${MUTED}`}>
        <span className={`size-1.5 rounded-full ${busy ? "animate-pulse bg-[#fab219]" : "bg-[#0ca30c]"}`} />
        <span className="tabular-nums">{asOf}</span>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh"
          className={`flex size-7 items-center justify-center rounded-md! transition-colors hover:bg-[#232926] hover:text-[#f2f3f2] ${FOCUS}`}
        >
          <ArrowsClockwise className={`size-3.5 ${busy ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

/** Decorative filter controls: the look of the app's 32px triggers. */
function FakeSelect({ width, children, muted, icon }: { width: number; children: ReactNode; muted?: boolean; icon: "down" | "updown" }) {
  return (
    <div
      className={`flex h-8 items-center justify-between gap-2 rounded-md border border-[#2a322e] bg-[#101412] px-3 text-xs ${
        muted ? MUTED : INK
      }`}
      style={{ width: `calc(var(--mu) * ${width})` }}
    >
      <span className="truncate">{children}</span>
      {icon === "down" ? (
        <CaretDown className="size-4 shrink-0 opacity-50" />
      ) : (
        <CaretUpDown className="size-3.5 shrink-0 opacity-50" />
      )}
    </div>
  );
}

function FilterCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-x-3 rounded-xl border border-[#2a322e] bg-[#151917] px-3 py-2.5">
      {children}
      <div className={`flex h-8 items-center gap-1.5 px-2.5 ${T11} font-medium ${INK}`}>
        <ArrowCounterClockwise className="size-3" />
        Reset
      </div>
    </div>
  );
}

function KpiCell({ label, value, unit, hint }: { label: string; value: string; unit?: string; hint: string }) {
  return (
    <div className="bg-[#151917] p-4">
      <p className={LABEL}>{label}</p>
      <p className={`mt-2 ${T27} font-semibold leading-none tracking-tight ${INK}`}>
        {value}
        {unit && <span className={`ml-1 ${T11} font-normal ${MUTED}`}>{unit}</span>}
      </p>
      <p className={`mt-2.5 ${T11} ${MUTED}`}>{hint}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The mock                                                            */
/* ------------------------------------------------------------------ */

/**
 * WWS Dashboards, the operations dashboards of a used-cooking-oil collection
 * network, recreated in its dark theme: the Weekly Collection arc map (the
 * default) and UCR > Summary, switched from the sidebar.
 */
export function WwsDashboardsMock({ className }: { className?: string }) {
  const [view, setView] = useState<View>("weekly");
  const [collapsed, setCollapsed] = useState(false);
  // The week the stepper asks for, and the one whose data has landed.
  const [offset, setOffset] = useState(0);
  const [dataOffset, setDataOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [asOf, setAsOf] = useState("06:05:12");

  useEffect(() => {
    if (offset === dataOffset) return;
    const id = window.setTimeout(() => setDataOffset(offset), 420);
    return () => window.clearTimeout(id);
  }, [offset, dataOffset]);

  useEffect(() => {
    if (!refreshing) return;
    const id = window.setTimeout(() => {
      setRefreshing(false);
      setAsOf(mytClock(Date.now()));
    }, 720);
    return () => window.clearTimeout(id);
  }, [refreshing]);

  const week = getWeek(dataOffset);
  const pending = offset !== dataOffset;
  const busy = pending || refreshing;
  const { depots } = NETWORK;
  const busiest = depots[week.busiest];

  return (
    <MockScreen w={1180} h={740} label="WWS Dashboards, recreated: weekly collection map and UCR summary" className={className}>
      <div className="flex size-full bg-[#0e1b14] font-ui leading-normal text-[#f2f3f2] antialiased">
        <Sidebar view={view} collapsed={collapsed} onView={setView} />

        <div
          className={`relative my-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#101412] shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-[margin] duration-200 ease-linear ${
            collapsed ? "ml-2" : "ml-0"
          }`}
        >
          {/* Top bar */}
          <div className="flex h-16 shrink-0 items-center gap-2 px-4">
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={collapsed}
              className={`-ml-1 flex size-7 items-center justify-center rounded-md! ${INK} transition-colors hover:bg-[#232926] ${FOCUS}`}
            >
              <SidebarSimple className="size-4" />
            </button>
            <span className="mr-2 h-4 w-px bg-[#2a322e]" />
            <span className={`text-sm ${INK}`}>{view === "weekly" ? "Weekly Collection" : "UCR Dashboard"}</span>
            <span className={`ml-auto flex size-10 items-center justify-center ${INK}`} aria-hidden>
              <Moon className="size-[calc(var(--mu)*19)]" />
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 pb-4 pt-5">
            {view === "weekly" ? (
              <>
                <PageHeader
                  title="Weekly Collection"
                  subtitle={`UCO from outlet to depot · ${week.label}`}
                  asOf={asOf}
                  busy={busy}
                  onRefresh={() => setRefreshing(true)}
                />
                <FilterCard>
                  <FakeSelect width={150} icon="down">
                    All countries
                  </FakeSelect>
                  <FakeSelect width={185} icon="updown" muted>
                    All my depots
                  </FakeSelect>
                  <div className="inline-flex h-8 items-center gap-0.5 rounded-md border border-[#2a322e] bg-[#1b1f1d] p-0.5">
                    <button
                      type="button"
                      aria-label="Previous week"
                      onClick={() => setOffset((o) => Math.min(51, o + 1))}
                      className={`flex h-[calc(var(--mu)*26)] w-7 items-center justify-center rounded-sm! ${MUTED} transition-colors hover:bg-[#101412] hover:text-[#f2f3f2] ${FOCUS}`}
                    >
                      <CaretLeft className="size-3.5" />
                    </button>
                    <div className={`flex h-[calc(var(--mu)*26)] w-[calc(var(--mu)*168)] items-center justify-between gap-2 px-3 ${T11} ${INK}`}>
                      <span className="truncate">{offset === 0 ? "Latest complete week" : weekLabel(offset)}</span>
                      <CaretUpDown className="size-3.5 shrink-0 opacity-50" />
                    </div>
                    <button
                      type="button"
                      aria-label="Next week"
                      disabled={offset === 0}
                      onClick={() => setOffset((o) => Math.max(0, o - 1))}
                      title={offset === 0 ? "This is the most recent completed week" : undefined}
                      className={`flex h-[calc(var(--mu)*26)] w-7 items-center justify-center rounded-sm! transition-colors ${FOCUS} ${
                        offset === 0
                          ? "cursor-not-allowed text-[#949e97]/30"
                          : `${MUTED} hover:bg-[#101412] hover:text-[#f2f3f2]`
                      }`}
                    >
                      <CaretRight className="size-3.5" />
                    </button>
                  </div>
                </FilterCard>

                <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-[#2a322e] bg-[#2a322e]">
                  <KpiCell
                    label="Total UCO"
                    value={kg(week.totalKg)}
                    unit="kg"
                    hint={`${count(week.collections.length)} collections mapped`}
                  />
                  <KpiCell
                    label="Depots"
                    value={count(depots.length)}
                    hint={`${MAX_COLOURED_DEPOTS} coloured · the rest neutral`}
                  />
                  <KpiCell label="Outlets" value={count(week.outletsCollected)} hint="collected from this week" />
                  <KpiCell label="Busiest depot" value={busiest.code} hint={`${kg(week.depotWeek[week.busiest].kg)} kg`} />
                </div>

                <ArcMap week={week} dim={pending} />
              </>
            ) : (
              <>
                <PageHeader
                  title="UCR Summary"
                  subtitle={UCR_SUBTITLE}
                  asOf={asOf}
                  busy={busy}
                  onRefresh={() => setRefreshing(true)}
                />
                <FilterCard>
                  <div className="flex items-center gap-2">
                    <span className={`${T11} ${MUTED}`}>As of</span>
                    <div className={`flex h-8 w-[calc(var(--mu)*150)] items-center gap-2 rounded-md border border-[#2a322e] bg-[#101412] px-3 text-xs ${INK}`}>
                      <CalendarBlank className="size-3.5 shrink-0 opacity-60" />
                      {UCR_AS_OF}
                    </div>
                  </div>
                  <FakeSelect width={150} icon="down">
                    All countries
                  </FakeSelect>
                  <FakeSelect width={185} icon="updown" muted>
                    All my depots
                  </FakeSelect>
                </FilterCard>
                <UcrSummary />
              </>
            )}
          </div>
        </div>
      </div>
    </MockScreen>
  );
}
