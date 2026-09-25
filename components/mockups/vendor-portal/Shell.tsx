"use client";

import {
  BuildingsIcon,
  CaretUpIcon,
  ChartBarIcon,
  ClockCounterClockwiseIcon,
  CreditCardIcon,
  SidebarSimpleIcon,
  SquaresFourIcon,
  StorefrontIcon,
  SunIcon,
  TagIcon,
  UserCheckIcon,
  UsersIcon,
  WrenchIcon,
  type Icon,
} from "@phosphor-icons/react";
import { FOCUS, LogoMark, cn } from "./ui";

export type View = "dashboard" | "maintenance";

interface NavItem {
  label: string;
  icon: Icon;
  view?: View;
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Home",
    items: [
      { label: "Dashboard", icon: SquaresFourIcon, view: "dashboard" },
      { label: "Collection Histories", icon: ClockCounterClockwiseIcon },
      { label: "Analytics", icon: ChartBarIcon },
      { label: "Vendor Profile", icon: BuildingsIcon },
    ],
  },
  {
    title: "Manage",
    items: [
      { label: "Brands", icon: TagIcon },
      { label: "Outlets", icon: StorefrontIcon },
      { label: "PICs", icon: UserCheckIcon },
      { label: "Maintenance", icon: WrenchIcon, view: "maintenance" },
      { label: "Vendor Users", icon: UsersIcon },
    ],
  },
];

const ITEM = "relative flex h-8 w-full items-center gap-2 rounded-md! px-2 text-left text-sm leading-5";
const ACTIVE = cn(
  "bg-[#D5ECDD] font-semibold text-[#17964A]",
  "before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-[calc(var(--mu)*3)] before:rounded-full before:content-['']",
  "before:bg-[linear-gradient(135deg,#a8d65b_0%,#40b47f_48%,#2cb7c2_100%)]",
);

export function Sidebar({ view, onSelect }: { view: View; onSelect: (v: View) => void }) {
  return (
    <div className="flex w-64 shrink-0 flex-col p-2">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[linear-gradient(180deg,#F0FAF3_0%,#D7EFE1_100%)] text-[#2E3833]">
        <div className="p-2">
          <div className="flex h-12 items-center gap-2 rounded-md p-2">
            <LogoMark className="size-8 shrink-0 rounded-lg" />
            <div className="grid min-w-0 flex-1 text-sm leading-tight">
              <span className="truncate font-semibold text-[#1A2822]">Vendor Portal</span>
              <span className="truncate text-xs">v1.1.0</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          {GROUPS.map((g) => (
            <div key={g.title} className="flex flex-col p-2">
              <div className="flex h-8 items-center px-2 text-xs font-medium text-[#2E3833]/70">{g.title}</div>
              <ul className="flex flex-col gap-1">
                {g.items.map((item) => {
                  const ItemIcon = item.icon;
                  const active = item.view === view;
                  const inner = (
                    <>
                      <ItemIcon aria-hidden weight={active ? "bold" : "regular"} className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </>
                  );
                  return (
                    <li key={item.label}>
                      {item.view ? (
                        <button
                          type="button"
                          aria-current={active ? "page" : undefined}
                          onClick={() => onSelect(item.view as View)}
                          className={cn(
                            ITEM,
                            "cursor-pointer transition-colors duration-150",
                            active ? ACTIVE : "hover:bg-[#D5ECDD]/70 hover:text-[#1A2822]",
                            FOCUS,
                          )}
                        >
                          {inner}
                        </button>
                      ) : (
                        <div className={ITEM}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-2 pb-2">
          <div className="flex w-full flex-col items-center gap-1.5 rounded-lg border border-[#40b47f]/30 bg-[linear-gradient(135deg,rgba(168,214,91,0.14)_0%,rgba(64,180,127,0.1)_50%,rgba(44,183,194,0.16)_100%)] px-3 py-2.5">
            <span className="text-[length:calc(var(--mu)*10)] font-semibold uppercase leading-[calc(var(--mu)*14)] tracking-[0.06em] text-[#1E9A4D]">
              Early Access Trial
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium leading-4 text-[#1E9A4D]">
              <CreditCardIcon aria-hidden className="size-3.5" />
              View Pricing
            </span>
          </div>
        </div>

        <div className="p-2">
          <div className="flex h-12 items-center gap-2 rounded-md p-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#2EB860] text-xs font-semibold text-white">NH</span>
            <div className="grid min-w-0 flex-1 text-sm leading-tight">
              <span className="truncate font-semibold text-[#1A2822]">Nadia Harun</span>
              <span className="truncate text-xs">Seri Kenanga Group</span>
            </div>
            <CaretUpIcon aria-hidden className="ml-auto size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({ title }: { title: string }) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <span className="-ml-1 grid size-7 place-items-center rounded-md text-[#1A2822]">
          <SidebarSimpleIcon aria-hidden className="size-4" />
        </span>
        <span aria-hidden className="mr-2 h-4 w-px bg-[#E1EAE6]" />
        <span className="text-sm leading-5 text-[#1A2822]">{title}</span>
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <span className="grid size-10 place-items-center rounded-md text-[#1A2822]">
          <SunIcon aria-hidden className="size-[calc(var(--mu)*19)]" />
        </span>
      </div>
    </div>
  );
}

