import type { Icon } from "@phosphor-icons/react";
import {
  BuildingsIcon,
  CalendarBlankIcon,
  CalendarDotsIcon,
  CaretRightIcon,
  CaretUpDownIcon,
  ChartBarIcon,
  FileArrowUpIcon,
  GearSixIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SidebarSimpleIcon,
  SquaresFourIcon,
  SunIcon,
  TrayIcon,
  TreeStructureIcon,
  TrendUpIcon,
  WalletIcon,
  WarehouseIcon,
} from "@phosphor-icons/react";
import { VIEWER } from "./data";
import { LogoMark, T13, cx } from "./ui";

interface NavItem {
  label: string;
  icon: Icon;
  active?: boolean;
}

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Home",
    items: [
      { label: "Dashboard", icon: SquaresFourIcon },
      { label: "My Decisions", icon: TrayIcon },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "Purchase Contracts", icon: ShoppingCartIcon, active: true },
      { label: "Sales Contracts", icon: FileArrowUpIcon },
      { label: "Payments", icon: WalletIcon },
    ],
  },
  {
    group: "Reports",
    items: [
      { label: "Analytics", icon: ChartBarIcon },
      { label: "Weekly Report", icon: CalendarBlankIcon },
      { label: "Monthly Report", icon: CalendarDotsIcon },
      { label: "Year-to-Date", icon: TrendUpIcon },
    ],
  },
  {
    group: "Manage",
    items: [
      { label: "Companies", icon: BuildingsIcon },
      { label: "KYC & Compliance", icon: ShieldCheckIcon },
      { label: "Storage", icon: WarehouseIcon },
      { label: "Subsidiaries", icon: TreeStructureIcon },
    ],
  },
];

const COLLAPSED: NavItem[] = [
  { label: "Configure", icon: GearSixIcon },
  { label: "Administrator", icon: KeyIcon },
];

/** shadcn "inset" sidebar. Every item is decorative in the demo. */
export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col p-2 text-[#2D3443]">
      <div
        className="flex h-full min-h-0 flex-col rounded-xl"
        style={{ background: "linear-gradient(180deg, #F2F4F8 0%, #E3E6EE 100%)" }}
      >
        <div className="p-2">
          <div className="flex h-12 items-center gap-2 rounded-md p-2">
            <LogoMark />
            <div className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-sm font-semibold text-[#0F121A]">Trading Panel</span>
              <span className="truncate text-xs text-[#606876]">v1.53.0</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {NAV.map((g) => (
            <div key={g.group} className="flex flex-col px-2 py-0.5">
              <div className="flex h-6 items-center px-2 text-xs font-medium text-[#2D3443]/70">
                {g.group}
              </div>
              <ul className="flex flex-col gap-0.5">
                {g.items.map((it) => (
                  <NavRow key={it.label} item={it} />
                ))}
              </ul>
            </div>
          ))}
          <div className="mx-4 my-1.5 h-px bg-[#D8DCE4]" />
          <ul className="flex flex-col gap-0.5 px-2">
            {COLLAPSED.map((it) => (
              <NavRow key={it.label} item={it} collapsed />
            ))}
          </ul>
        </div>

        <div className="p-2">
          <div className="flex h-12 items-center gap-2 rounded-md p-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#174CB5] text-xs font-medium text-white">
              {VIEWER.initials}
            </span>
            <div className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-sm font-semibold text-[#0F121A]">{VIEWER.name}</span>
              <span className="truncate text-xs text-[#606876]">{VIEWER.role}</span>
            </div>
            <CaretUpDownIcon aria-hidden="true" className="size-4 shrink-0 text-[#606876]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavRow({ item, collapsed }: { item: NavItem; collapsed?: boolean }) {
  const I = item.icon;
  return (
    <li
      className={cx(
        "relative flex h-7 items-center gap-2 rounded-md px-2",
        T13,
        item.active
          ? "bg-[#E2E6EE] font-semibold text-[#174CB5] before:absolute before:inset-y-1.5 before:left-0 before:w-0.75 before:rounded-r-full before:bg-[#174CB5] before:content-['']"
          : "text-[#2D3443]",
      )}
    >
      <I aria-hidden="true" weight={item.active ? "bold" : "regular"} className="size-4 shrink-0" />
      <span className="truncate">{item.label}</span>
      {collapsed && <CaretRightIcon aria-hidden="true" className="ml-auto size-3.5 text-[#606876]" />}
    </li>
  );
}

/** Top bar: no breadcrumbs, a display title, the command search and theme toggle. */
export function TopBar({ title, showNew }: { title: string; showNew?: boolean }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
      <span className="grid size-7 place-items-center rounded-md text-[#0F121A]">
        <SidebarSimpleIcon aria-hidden="true" className="size-4" />
      </span>
      <span aria-hidden="true" className="mr-1.5 ml-0.5 h-4 w-px bg-[#DEE1E7]" />
      <div className="font-grotesk text-lg font-semibold tracking-tight text-[#0F121A]">{title}</div>
      {showNew && (
        <span
          className={cx(
            "ml-2 inline-flex h-8 items-center gap-1 rounded-md border border-[#DEE1E7] bg-[#F6F7F9] px-3 font-medium text-[#0F121A]",
            T13,
          )}
        >
          <PlusIcon aria-hidden="true" className="size-4" />
          New
        </span>
      )}
      <div className="ml-auto flex items-center gap-2">
        <div
          className={cx(
            "flex h-9 w-86 items-center gap-2 rounded-md border border-[#DEE1E7] bg-[#F6F7F9] px-3 text-[#555D6D]",
            T13,
          )}
        >
          <MagnifyingGlassIcon aria-hidden="true" className="size-4 shrink-0" />
          <span className="flex-1 truncate">Search pages, companies, contracts…</span>
          <kbd className="rounded-xs border border-[#DEE1E7] bg-[#EDEFF3] px-1.5 font-mono text-2xs leading-4 font-medium text-[#555D6D]">
            ⌘K
          </kbd>
        </div>
        <span className="grid size-9 place-items-center rounded-md text-[#0F121A]">
          <SunIcon aria-hidden="true" className="size-4.5" />
        </span>
      </div>
    </header>
  );
}
