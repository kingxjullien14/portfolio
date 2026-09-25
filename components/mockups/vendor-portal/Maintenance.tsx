"use client";

import {
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  PlusCircleIcon,
  PlusIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useState, type RefObject } from "react";
import { MAINTENANCE_TOTAL, STATUS_META, type MaintenanceRow } from "./data";
import { Badge, FOCUS, cn } from "./ui";

const FILTERS = ["Date range", "State", "Service type", "Status"];
const COLUMNS: { label: string; width: string }[] = [
  { label: "No", width: "w-[calc(var(--mu)*40)]" },
  { label: "Date", width: "w-[calc(var(--mu)*100)]" },
  { label: "Outlet", width: "w-[calc(var(--mu)*214)]" },
  { label: "State", width: "w-[calc(var(--mu)*96)]" },
  { label: "Tank", width: "w-[calc(var(--mu)*100)]" },
  { label: "Description", width: "w-[calc(var(--mu)*186)]" },
  { label: "Status", width: "w-[calc(var(--mu)*106)]" },
  { label: "", width: "w-[calc(var(--mu)*40)]" },
];
const CELL = "px-3 py-1.5 align-middle first:pl-4 last:pr-3";
const MUTED = "text-[#5B6C65]";

export function Maintenance({
  rows,
  flash,
  onOpen,
  regionRef,
}: {
  rows: MaintenanceRow[];
  flash: { id: string; tone: "verified" | "rejected" } | null;
  onOpen: (id: string, trigger: HTMLElement | null) => void;
  regionRef: RefObject<HTMLDivElement | null>;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q
    ? rows.filter((r) => [r.outlet, r.code, r.pic, r.phone, r.no, r.state].some((v) => v.toLowerCase().includes(q)))
    : rows;
  const total = q ? visible.length : MAINTENANCE_TOTAL;
  const pages = Math.max(1, Math.ceil(total / 8));

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E1EAE6] bg-white shadow-[0_1px_2px_rgba(20,40,30,0.05)]">
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <label className="relative block w-[calc(var(--mu)*212)] shrink-0">
              <span className="sr-only">Search maintenance by outlet, code, PIC, mobile or maintenance number</span>
              <MagnifyingGlassIcon aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#5B6C65]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search outlet, PIC or MTN"
                className={cn(
                  "h-9 w-full rounded-lg! border border-[#E1EAE6] bg-[#FCFDFC] pl-8 pr-2.5 text-[length:calc(var(--mu)*13)] text-[#1A2822] caret-[#2EB860] shadow-[0_1px_2px_rgba(20,40,30,0.04)] transition-colors placeholder:text-[#5B6C65]/85 hover:border-[#1A2822]/20 focus-visible:border-[#2EB860] [&::-webkit-search-cancel-button]:hidden",
                  FOCUS,
                )}
              />
            </label>
            {FILTERS.map((f) => (
              <span
                key={f}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-[#CFDCD5] bg-[#FCFDFC] px-2.5 text-xs font-medium text-[#1A2822]"
              >
                <PlusCircleIcon aria-hidden className="size-3.5 text-[#5B6C65]" />
                {f}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E1EAE6] bg-[#FCFDFC] px-3 text-[length:calc(var(--mu)*13)] font-medium">
              <DownloadSimpleIcon aria-hidden className="size-4" />
              CSV
            </span>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2EB860] px-3.5 text-[length:calc(var(--mu)*13)] font-medium text-white shadow-[0_1px_2px_rgba(20,40,30,0.12)]">
              <PlusIcon aria-hidden weight="bold" className="size-3.5" />
              New Request
            </span>
          </div>
        </div>

        <div ref={regionRef} tabIndex={-1} aria-label="Maintenance requests" className="mt-4 border-y border-[#E1EAE6] outline-none">
          <table className="w-full table-fixed border-collapse text-[length:calc(var(--mu)*13)] leading-[calc(var(--mu)*18)]">
            <colgroup>
              {COLUMNS.map((c, i) => (
                <col key={i} className={c.width} />
              ))}
            </colgroup>
            <thead className="bg-[#F4F8F6]">
              <tr className="border-b border-[#E1EAE6]">
                {COLUMNS.map((c, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="h-9 px-3 text-left align-middle text-[length:calc(var(--mu)*11)] font-medium uppercase tracking-[0.05em] text-[#5B6C65] first:pl-4 last:pr-3"
                  >
                    {i === 0 ? <span className="pl-1">{c.label}</span> : c.label || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="h-48 p-0">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <span className="grid size-12 place-items-center rounded-full bg-[#F0F4F1] text-[#5B6C65]">
                        <MagnifyingGlassIcon aria-hidden className="size-6" />
                      </span>
                      <div>
                        <div className="text-sm font-medium">No results found</div>
                        <div className={cn("text-sm", MUTED)}>No records match your current search or filters.</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((r, i) => {
                  const status = STATUS_META[r.status];
                  const pending = r.status === "pending";
                  return (
                    <tr
                      key={r.id}
                      onClick={pending ? (e) => onOpen(r.id, e.currentTarget.querySelector("button")) : undefined}
                      className={cn(
                        "border-b border-[#E1EAE6] transition-colors last:border-0",
                        pending && "cursor-pointer hover:bg-[#F0F4F1]/70",
                        flash?.id === r.id
                          ? cn("duration-150", flash.tone === "verified" ? "bg-[#23954D]/[0.08]" : "bg-[#EF4343]/[0.07]")
                          : "duration-1000",
                      )}
                    >
                      <td className={CELL}>
                        <span className="pl-1 tabular-nums">{i + 1}</span>
                      </td>
                      <td className={CELL}>
                        <div className="whitespace-nowrap tabular-nums">{r.date}</div>
                        <div className={cn("text-xs leading-4 tabular-nums", MUTED)}>{r.time}</div>
                      </td>
                      <td className={CELL}>
                        <div className="truncate font-medium leading-4 text-[#1E9A4D]">{r.outlet}</div>
                        <div className={cn("text-xs leading-[calc(var(--mu)*15)]", MUTED)}>[{r.code}]</div>
                        <div className={cn("flex items-center gap-2.5 whitespace-nowrap text-xs leading-[calc(var(--mu)*15)]", MUTED)}>
                          <span className="flex items-center gap-1">
                            <UserIcon aria-hidden className="size-3" />
                            {r.pic}
                          </span>
                          <span className="flex items-center gap-1 tabular-nums">
                            <PhoneIcon aria-hidden className="size-3" />
                            {r.phone}
                          </span>
                        </div>
                      </td>
                      <td className={cn(CELL, "whitespace-nowrap")}>{r.state}</td>
                      <td className={CELL}>
                        <div className="whitespace-nowrap">{r.tankType}</div>
                        <div className="text-xs font-semibold italic leading-4">{r.tankId}</div>
                      </td>
                      <td className={CELL}>
                        <div className={cn("truncate", MUTED)}>{r.description}</div>
                        <span className="mt-1 inline-flex whitespace-nowrap rounded-full bg-[#EDF2EF] px-2 text-[length:calc(var(--mu)*10)] font-semibold leading-4 text-[#1A2822]">
                          {r.service}
                        </span>
                      </td>
                      <td className={CELL}>
                        <Badge tone={status.tone}>{status.label}</Badge>
                        <div className={cn("mt-1 text-[length:calc(var(--mu)*10)] leading-[calc(var(--mu)*13)]", MUTED)}>{r.source}</div>
                      </td>
                      <td className={cn(CELL, "text-right")}>
                        {pending ? (
                          <button
                            type="button"
                            aria-label={`Review ${r.no}, ${r.outlet}`}
                            aria-haspopup="dialog"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen(r.id, e.currentTarget);
                            }}
                            className={cn(
                              "ml-auto grid size-8 cursor-pointer place-items-center rounded-md! text-[#5B6C65] transition-colors hover:bg-[#EAF0EC] hover:text-[#1A2822]",
                              FOCUS,
                            )}
                          >
                            <DotsThreeIcon aria-hidden weight="bold" className="size-4" />
                          </button>
                        ) : (
                          <span aria-hidden className="ml-auto grid size-8 place-items-center text-[#5B6C65]">
                            <DotsThreeIcon weight="bold" className="size-4" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5">
          <div className={cn("text-[length:calc(var(--mu)*13)] tabular-nums", MUTED)}>
            {visible.length ? `Showing 1-${visible.length} of ${total} maintenances` : "Showing 0 of 0 maintenances"}
          </div>
          <div aria-hidden className="flex items-center gap-1 text-[length:calc(var(--mu)*13)] font-medium">
            <span className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E1EAE6] px-2.5 opacity-50">
              <CaretLeftIcon className="size-3.5" />
              Previous
            </span>
            {Array.from({ length: pages }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "grid size-8 place-items-center rounded-lg tabular-nums",
                  i === 0 ? "bg-[#2EB860] text-white shadow-[0_1px_2px_rgba(20,40,30,0.12)]" : "border border-[#E1EAE6]",
                )}
              >
                {i + 1}
              </span>
            ))}
            <span className={cn("inline-flex h-8 items-center gap-1 rounded-lg border border-[#E1EAE6] px-2.5", pages === 1 && "opacity-50")}>
              Next
              <CaretRightIcon className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
