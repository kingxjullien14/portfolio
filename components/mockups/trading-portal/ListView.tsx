import { useId, useRef, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpDownIcon,
  MagnifyingGlassIcon,
  TrayIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { SEGMENTS, fmtInt, fmtUsd, inSegment, type Contract, type SegmentKey } from "./data";
import { AwaitingChip, E1, StatusPill, T11, T13, cx } from "./ui";

const COLS: { label: string; width: string; align?: "right"; sort?: boolean }[] = [
  { label: "Reference", width: "11.66%", sort: true },
  { label: "Counterparty", width: "16.59%", sort: true },
  { label: "Product", width: "13%", sort: true },
  { label: "Volume", width: "8.52%", align: "right", sort: true },
  { label: "Price", width: "12.33%", align: "right", sort: true },
  { label: "Status", width: "17.71%" },
  { label: "Contract Date", width: "10.76%", sort: true },
  { label: "Updated", width: "9.43%", sort: true },
];

export function ListView({
  contracts,
  segment,
  onSegment,
  query,
  onQuery,
  onOpen,
}: {
  contracts: Contract[];
  segment: SegmentKey;
  onSegment: (k: SegmentKey) => void;
  query: string;
  onQuery: (q: string) => void;
  onOpen: (ref: string) => void;
}) {
  const uid = useId();
  const q = query.trim().toLowerCase();
  const searched = q
    ? contracts.filter(
        (c) => c.ref.toLowerCase().includes(q) || c.counterparty.toLowerCase().includes(q),
      )
    : contracts;
  const rows = searched.filter((c) => inSegment(c, segment));
  const n = rows.length;

  return (
    <div className="flex h-full min-h-0 flex-col px-4 pb-4">
      <div
        className={cx(
          "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#DEE1E7] bg-white",
          E1,
        )}
      >
        <div className="flex shrink-0 flex-col gap-3 px-3 pt-3 pb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-72">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#555D6D]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder="Search by reference or counterparty…"
                aria-label="Search contracts by reference or counterparty"
                autoComplete="off"
                spellCheck={false}
                className={cx(
                  "h-9 w-full rounded-md border border-[#DEE1E7] bg-[#F6F7F9] pr-3 pl-9 text-[#0F121A] caret-[#174CB5] outline-none placeholder:text-[#555D6D] focus-visible:rounded-md! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-[#1A53C7]/50 focus-visible:ring-offset-1",
                  T13,
                )}
              />
            </div>
            <FilterStub label="By Type" />
            <FilterStub label="By Product" />
            <span
              className={cx(
                "ml-auto inline-flex h-9 items-center gap-2 rounded-md border border-[#DEE1E7] bg-[#F6F7F9] px-3.5 font-medium text-[#0F121A]",
                T13,
              )}
            >
              <UploadSimpleIcon aria-hidden="true" className="size-4" />
              Export
            </span>
          </div>
          <Segmented
            uid={uid}
            value={segment}
            onChange={onSegment}
            counts={Object.fromEntries(
              SEGMENTS.map((s) => [s.key, searched.filter((c) => inSegment(c, s.key)).length]),
            )}
          />
        </div>

        <div
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-tab-${segment}`}
          className="relative mx-3 min-h-0 flex-1 overflow-y-auto border-y border-[#DEE1E7]"
        >
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <colgroup>
              {COLS.map((c) => (
                <col key={c.label} style={{ width: c.width }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLS.map((c) => (
                  <th
                    key={c.label}
                    scope="col"
                    className={cx(
                      "sticky top-0 z-10 h-9 border-b border-[#DEE1E7] bg-[#EDEFF3] px-2 font-medium whitespace-nowrap tracking-wide text-[#555D6D]",
                      T11,
                      c.align === "right" && "text-right",
                    )}
                  >
                    <span
                      className={cx(
                        "inline-flex items-center gap-1 align-middle",
                        c.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {c.label}
                      {c.sort && (
                        <CaretUpDownIcon aria-hidden="true" className="size-3 opacity-70" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <Row key={c.ref} c={c} onOpen={onOpen} />
              ))}
              {n === 0 && (
                <tr>
                  <td colSpan={COLS.length} className="h-40">
                    <div className="flex flex-col items-center justify-center gap-2 text-[#555D6D]">
                      <TrayIcon aria-hidden="true" weight="light" className="size-10" />
                      <p className={T13}>No contracts match your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 items-center justify-between px-3 py-3">
          <div className={cx("tabular-nums text-[#555D6D]", T13)} aria-live="polite">
            Showing{" "}
            <span className="font-grotesk font-medium text-[#0F121A]">
              {n === 0 ? "0-0" : `1-${n}`}
            </span>{" "}
            of <span className="font-grotesk font-medium text-[#0F121A]">{n}</span>{" "}
            {n === 1 ? "contract" : "contracts"}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cx(
                "inline-flex h-8 items-center gap-1 rounded-md border border-[#DEE1E7] bg-[#F6F7F9] px-3 font-medium text-[#0F121A] opacity-50",
                T13,
              )}
            >
              <CaretLeftIcon aria-hidden="true" className="size-3.5" />
              Previous
            </span>
            <span
              className={cx(
                "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-[#174CB5] bg-[#174CB5] px-2 font-grotesk font-semibold text-white tabular-nums",
                T13,
              )}
            >
              1
            </span>
            <span
              className={cx(
                "inline-flex h-8 items-center gap-1 rounded-md border border-[#DEE1E7] bg-[#F6F7F9] px-3 font-medium text-[#0F121A] opacity-50",
                T13,
              )}
            >
              Next
              <CaretRightIcon aria-hidden="true" className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterStub({ label }: { label: string }) {
  return (
    <span
      className={cx(
        "inline-flex h-9 items-center gap-6 rounded-md border border-[#DEE1E7] bg-[#F6F7F9] pr-2.5 pl-3 text-[#555D6D]",
        T13,
      )}
    >
      {label}
      <CaretDownIcon aria-hidden="true" className="size-3.5 opacity-60" />
    </span>
  );
}

function Segmented({
  uid,
  value,
  onChange,
  counts,
}: {
  uid: string;
  value: SegmentKey;
  onChange: (k: SegmentKey) => void;
  counts: Record<string, number>;
}) {
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = SEGMENTS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    onChange(SEGMENTS[next].key);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Filter by status"
      className="inline-flex w-fit items-center rounded-full border border-[#DEE1E7] bg-[#EDEFF3] p-0.75"
    >
      {SEGMENTS.map((s, i) => {
        const active = s.key === value;
        return (
          <button
            key={s.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${s.key}`}
            aria-selected={active}
            aria-controls={`${uid}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(s.key)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              "relative inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:rounded-full! focus-visible:outline-2! focus-visible:outline-offset-1! focus-visible:outline-[#174CB5]!",
              active ? "text-[#0F121A]" : "text-[#555D6D] hover:text-[#0F121A]",
            )}
          >
            {active && (
              <motion.span
                layoutId="tp-segment-pill"
                aria-hidden="true"
                className={cx("absolute inset-0 rounded-full bg-white", E1)}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{s.label}</span>
            <span className="relative font-medium tabular-nums text-[#555D6D]/70">{counts[s.key]}</span>
          </button>
        );
      })}
    </div>
  );
}

function Row({ c, onOpen }: { c: Contract; onOpen: (ref: string) => void }) {
  const hot = c.status === "To Reply";
  const cell = "border-b border-[#DEE1E7] px-2 py-2 align-middle";
  return (
    <tr
      onClick={() => onOpen(c.ref)}
      className="group cursor-pointer transition-colors duration-150 last:*:border-b-0 hover:bg-[#EDEFF3]/50 has-[button:focus-visible]:bg-[#174CB5]/5"
    >
      <td className={cell}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(c.ref);
          }}
          className={cx(
            "cursor-pointer font-grotesk font-semibold tracking-tight text-[#174CB5] hover:underline focus-visible:rounded-xs! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-[#174CB5]!",
            T13,
          )}
        >
          {c.ref}
        </button>
        <div className={cx("text-[#555D6D]", T11)}>{c.type}</div>
      </td>
      <td className={cell}>
        <div className={cx("line-clamp-2 leading-4 font-semibold text-[#0F121A]", T13)}>
          {c.counterparty.replace(/ (Sdn|Pte) (Bhd|Ltd)$/, " $1 $2")}
        </div>
      </td>
      <td className={cell}>
        <span
          className={cx(
            "-ml-2 inline-block rounded-md px-2 py-0.5 whitespace-nowrap",
            T13,
            hot ? "bg-[#BF7918]/15 font-semibold text-[#BF7918]" : "text-[#555D6D]",
          )}
        >
          {c.product}
          {hot && <span className="sr-only"> (in negotiation)</span>}
        </span>
      </td>
      <td className={cx(cell, "text-right")}>
        <div
          className={cx(
            "font-grotesk whitespace-nowrap tabular-nums",
            T13,
            hot ? "font-semibold text-[#BF7918]" : "text-[#0F121A]",
          )}
        >
          {fmtInt(c.volumeMt)} MT
        </div>
      </td>
      <td className={cx(cell, "text-right")}>
        <div
          className={cx(
            "font-grotesk whitespace-nowrap tabular-nums",
            T13,
            hot ? "font-semibold text-[#BF7918]" : "text-[#0F121A]",
          )}
        >
          {fmtUsd(c.priceUsd)}
        </div>
        {c.wasPriceUsd !== undefined && (
          <div className={cx("font-grotesk whitespace-nowrap tabular-nums text-[#555D6D]", T11)}>
            was {fmtUsd(c.wasPriceUsd)}
          </div>
        )}
      </td>
      <td className={cell}>
        <div className="flex flex-col items-start gap-1">
          <StatusPill status={c.status} />
          {c.awaiting && <AwaitingChip awaiting={c.awaiting} />}
        </div>
      </td>
      <td className={cell}>
        <span className={cx("font-grotesk whitespace-nowrap tabular-nums text-[#0F121A]", T13)}>
          {c.contractDate}
        </span>
      </td>
      <td className={cell}>
        <span className={cx("whitespace-nowrap text-[#555D6D]", T13)}>{c.updated}</span>
      </td>
    </tr>
  );
}
