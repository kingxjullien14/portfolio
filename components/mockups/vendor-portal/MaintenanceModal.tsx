"use client";

import { CopyIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon, UserIcon, XIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { STATUS_META, type MaintenanceRow } from "./data";
import { TankPhoto } from "./TankPhoto";
import { Badge, FOCUS, cn } from "./ui";

const LABEL = "text-xs font-semibold uppercase leading-4 tracking-[0.02em] text-[#5B6C65]";
const MUTED = "text-[#5B6C65]";

export function MaintenanceModal({
  row,
  onClose,
  onDecide,
}: {
  row: MaintenanceRow;
  onClose: () => void;
  onDecide: (status: "verified" | "rejected") => void;
}) {
  const d = row.detail;
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduce = useReducedMotion();
  const kind = row.tankType.startsWith("Drum") ? "drum" : "itank";
  const status = STATUS_META[row.status];

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const buttons = dialogRef.current?.querySelectorAll<HTMLElement>("button");
    if (!buttons || buttons.length === 0) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const activeEl = document.activeElement;
    if (e.shiftKey && (activeEl === first || activeEl === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!d) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 grid place-items-center bg-[#FCFDFC]/75 backdrop-blur-[calc(var(--mu)*3)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid w-[calc(var(--mu)*860)] gap-4 rounded-[calc(var(--mu)*10)] border border-[#E1EAE6] bg-[#FCFDFC] p-6 text-[#1A2822] shadow-[0_calc(var(--mu)*16)_calc(var(--mu)*40)_calc(var(--mu)*-8)_rgba(20,40,30,0.22),0_calc(var(--mu)*4)_calc(var(--mu)*10)_calc(var(--mu)*-4)_rgba(20,40,30,0.1)] outline-none!"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 grid size-6 cursor-pointer place-items-center rounded-sm! text-[#1A2822] opacity-70 transition-opacity hover:opacity-100",
            FOCUS,
          )}
        >
          <XIcon aria-hidden className="size-4" />
        </button>

        <div className="pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span id={titleId} className="text-lg font-semibold leading-none tracking-[-0.02em]">
              Maintenance #{row.no}
            </span>
            <span aria-hidden className="grid size-6 place-items-center rounded-md text-[#5B6C65]">
              <CopyIcon className="size-3.5" />
            </span>
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge tone="secondary">{row.source}</Badge>
          </div>
          <p className={cn("mt-2 text-sm leading-5", MUTED)}>
            Completed on {d.completed} by {d.technician}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#E1EAE6] p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold leading-5">[{row.code}]</span>
              <span aria-hidden className="grid size-5 place-items-center text-[#5B6C65]">
                <CopyIcon className="size-3.5" />
              </span>
            </div>
            <div className="mt-1.5 font-medium leading-5">{row.outlet}</div>
            <div className={cn("mt-1 text-[length:calc(var(--mu)*13)] leading-[calc(var(--mu)*18)]", MUTED)}>{d.address}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone="outline">Active</Badge>
              <span className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#E1EAE6] bg-[#FCFDFC] px-2.5 text-xs font-medium">
                <MapPinIcon aria-hidden className="size-3.5" />
                View in Map
              </span>
            </div>
            <div className="my-2.5 h-px bg-[#E1EAE6]" />
            <div className="space-y-0.5 text-[length:calc(var(--mu)*13)] leading-5">
              <div className="flex items-center gap-2">
                <UserIcon aria-hidden className="size-3.5 text-[#5B6C65]" />
                {row.pic}
              </div>
              <div className="flex items-center gap-2 tabular-nums">
                <PhoneIcon aria-hidden className="size-3.5 text-[#5B6C65]" />
                {row.phone}
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimpleIcon aria-hidden className="size-3.5 text-[#5B6C65]" />
                {d.email}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-[#E1EAE6] p-4">
            <div>
              <div className={LABEL}>Description</div>
              <p className="mt-0.5 text-[length:calc(var(--mu)*13)] leading-5">{d.longDescription}</p>
            </div>
            <div>
              <div className={LABEL}>Tank</div>
              <p className="mt-0.5 text-[length:calc(var(--mu)*13)] leading-5">
                {row.tankType} <span className="font-semibold">[{row.tankId}]</span>
              </p>
            </div>
            <div>
              <div className={cn(LABEL, "mb-1.5")}>Media</div>
              <div className="flex gap-2">
                <TankPhoto small stage="before" kind={kind} stamp={d.photoStamp[0]} />
                <TankPhoto small closeUp stage="before" kind={kind} stamp={d.photoStamp[0]} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#E1EAE6] p-4">
          <div className="text-sm font-semibold leading-5">Maintenance Details</div>
          <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1 text-[length:calc(var(--mu)*13)] leading-[calc(var(--mu)*19)]">
            <div>
              <span className={MUTED}>Assign to: </span>
              {d.technician}
            </div>
            <div>
              <span className={MUTED}>Service by: </span>
              {d.serviceBy}
            </div>
            <div>
              <span className={MUTED}>Service type: </span>
              {row.service}
            </div>
            <div className="tabular-nums">
              <span className={MUTED}>Linked trip: </span>
              {d.trip}
            </div>
          </div>
          <div className="mt-3 flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1 space-y-2 text-[length:calc(var(--mu)*13)] leading-[calc(var(--mu)*19)]">
              <div>
                <div className={MUTED}>Service description:</div>
                <ul className="list-inside list-disc">
                  {d.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className={MUTED}>Part used:</div>
                <ul className="list-inside list-disc">
                  {d.parts.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-5">
              <div>
                <div className={cn(LABEL, "mb-1.5")}>Tank Before</div>
                <div className="flex gap-2">
                  <TankPhoto stage="before" kind={kind} stamp={d.photoStamp[0]} />
                  <TankPhoto stage="before" closeUp kind={kind} stamp={d.photoStamp[0]} />
                </div>
              </div>
              <div>
                <div className={cn(LABEL, "mb-1.5")}>Tank After</div>
                <div className="flex gap-2">
                  <TankPhoto stage="after" kind={kind} stamp={d.photoStamp[1]} />
                  <TankPhoto stage="after" closeUp kind={kind} stamp={d.photoStamp[1]} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onDecide("rejected")}
            className={cn(
              "inline-flex h-9 cursor-pointer items-center rounded-lg! border border-[#E1EAE6] bg-[#FCFDFC] px-4 text-sm font-medium transition-colors hover:bg-[#EAF0EC] active:scale-[0.98]",
              FOCUS,
            )}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => onDecide("verified")}
            className={cn(
              "inline-flex h-9 cursor-pointer items-center rounded-lg! bg-[#2EB860] px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgba(20,40,30,0.14)] transition-colors hover:bg-[#2EB860]/90 active:scale-[0.98]",
              FOCUS,
            )}
          >
            Verify
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
