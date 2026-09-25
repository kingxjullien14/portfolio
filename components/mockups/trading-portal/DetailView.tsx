import { useLayoutEffect, useRef, type Ref } from "react";
import { useReducedMotion } from "framer-motion";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUUpLeftIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockCounterClockwiseIcon,
  ClockIcon,
  HandshakeIcon,
  LockSimpleIcon,
  MinusIcon,
  PaperPlaneRightIcon,
  PaperPlaneTiltIcon,
  SealCheckIcon,
  SignatureIcon,
  StampIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  BUYER,
  QUALITY,
  fmtInt,
  fmtUsd,
  type Contract,
  type EventKind,
  type ThreadEvent,
  type Tone,
} from "./data";
import type { SignedRecord } from "./seal";
import { BRAND_GRADIENT, BRAND_SHADOW, E1, E2, Kicker, StatusPill, T11, T13, T15, cx } from "./ui";

const TABS = [
  "Contract Information",
  "Quality Information",
  "Volume & Cost",
  "General Remarks",
  "Internal Use",
  "Authorized Signatory",
];

type TabState = "current" | "completed" | "optional" | "locked";

export function DetailView({
  contract: c,
  record,
  onBack,
  onSign,
  onViewStamp,
  onVerify,
  verifyBusy,
  signRef,
  verifyRef,
}: {
  contract: Contract;
  record?: SignedRecord;
  onBack: () => void;
  onSign: () => void;
  onViewStamp: () => void;
  onVerify: () => void;
  verifyBusy: boolean;
  signRef: Ref<HTMLButtonElement>;
  verifyRef: Ref<HTMLButtonElement>;
}) {
  const executed = c.status === "Fully Executed";
  const signing = c.status === "To Sign";
  const events: ThreadEvent[] =
    record?.session === true
      ? [
          ...c.thread,
          {
            id: "session-sig",
            kind: "signed_buyer",
            side: "buyer",
            label: "Signed by Buyer",
            actor: record.signer,
            at: record.labels.thread,
          },
        ]
      : c.thread;

  return (
    <div className="relative flex h-full min-h-0 flex-col px-4 pb-4">
      <div
        className={cx(
          "mb-17 grid min-h-0 flex-1 grid-cols-[calc(var(--mu)*244)_minmax(0,1fr)] gap-3 rounded-2xl border border-[#DEE1E7]/70 bg-white p-3",
          E1,
        )}
      >
        <Rail contract={c} record={record} executed={executed} signing={signing} onBack={onBack} />
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#DEE1E7]/70 bg-[#F6F7F9]">
          <div className="border-b border-[#DEE1E7]/70 bg-linear-to-b from-[#EDEFF3]/40 to-[#F6F7F9] px-5 pt-3.5 pb-3">
            <div className="font-grotesk text-base leading-6 font-semibold text-[#0F121A]">
              {signing || executed ? "Authorized Signatory" : "Volume & Cost"}
            </div>
            <p className="text-xs text-[#555D6D]">
              {executed
                ? "Both parties have signed. Each signature carries a verification token and a tamper-evident seal."
                : signing
                  ? "Review the negotiation record and the agreed terms, then sign to execute the contract."
                  : "The negotiation record and the terms currently on the table."}
            </p>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_calc(var(--mu)*204)] gap-3 p-3.5">
            <History events={events} />
            <KeyTerms c={c} />
          </div>
        </section>
      </div>

      <ActionBar
        contract={c}
        record={record}
        executed={executed}
        signing={signing}
        onSign={onSign}
        onViewStamp={onViewStamp}
        onVerify={onVerify}
        verifyBusy={verifyBusy}
        signRef={signRef}
        verifyRef={verifyRef}
      />
    </div>
  );
}

/* ─── Left rail ───────────────────────────────────────────────────────── */

function Rail({
  contract: c,
  record,
  executed,
  signing,
  onBack,
}: {
  contract: Contract;
  record?: SignedRecord;
  executed: boolean;
  signing: boolean;
  onBack: () => void;
}) {
  const current = signing || executed ? 5 : 2;
  const states: TabState[] = TABS.map((_, i) => {
    if (i === 5) return executed ? "completed" : signing ? "current" : "locked";
    if (i === current) return "current";
    if (i === 3) return c.generalRemarks ? "completed" : "optional";
    return "completed";
  });
  const done = states.filter((s, i) => s === "completed" || (s === "current" && i < 5)).length;
  const buyerSignedOn = record?.labels.day ?? c.presigned?.signedOn;

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#DEE1E7]/70 bg-[#EDEFF3]/30">
      <div className="border-b border-[#DEE1E7]/70 bg-white/80 px-4 pt-3 pb-3.5">
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 text-xs font-medium text-[#555D6D] transition-colors hover:text-[#0F121A] focus-visible:rounded-md! focus-visible:outline-2! focus-visible:outline-offset-1! focus-visible:outline-[#174CB5]!"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-3.5" />
          Back to List
        </button>
        <Kicker className="mt-3 mb-1">Purchase {c.type}</Kicker>
        <div className="truncate font-grotesk text-sm leading-tight font-semibold text-[#0F121A]">
          {c.ref}
        </div>
        <StatusPill status={c.status} className="mt-2" />
      </div>

      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="text-xs font-semibold text-[#555D6D]">Sections</div>
        <div className="text-2xs font-medium tabular-nums text-[#555D6D]/70">
          {done}/{TABS.length} complete
        </div>
      </div>
      <ol className="flex flex-col gap-1 px-3">
        {TABS.map((label, i) => (
          <TabRow
            key={label}
            label={label}
            index={i}
            state={i === current && states[i] === "completed" ? "current" : states[i]}
            doneMark={i === current && states[i] === "completed"}
            internal={i === 4}
          />
        ))}
      </ol>

      <div className="mt-auto px-3 pt-3 pb-3">
        <div className="rounded-lg border border-[#DEE1E7]/80 bg-white/70 p-3">
          <Kicker className="mb-2">Signatures</Kicker>
          <SignRow
            name={c.counterparty}
            role="Supplier"
            state={c.supplierSignedOn ? "signed" : "idle"}
            note={c.supplierSignedOn ? `Signed ${c.supplierSignedOn}` : "Not yet signed"}
          />
          <SignRow
            name={BUYER}
            role="Buyer"
            state={executed ? "signed" : signing ? "waiting" : "idle"}
            note={
              executed && buyerSignedOn
                ? `Signed ${buyerSignedOn}`
                : signing
                  ? "Awaiting CEO signature"
                  : "Not yet signed"
            }
            className="mt-2"
          />
        </div>
      </div>
    </aside>
  );
}

function TabRow({
  label,
  index,
  state,
  doneMark,
  internal,
}: {
  label: string;
  index: number;
  state: TabState;
  doneMark: boolean;
  internal: boolean;
}) {
  const current = state === "current";
  return (
    <li
      aria-current={current ? "step" : undefined}
      className={cx(
        "relative flex items-center gap-2.5 rounded-lg border px-3 py-2",
        current
          ? cx("border-[#174CB5]/40 bg-[#174CB5]/10 text-[#0F121A]", E1)
          : state === "completed"
            ? "border-transparent bg-white/70 text-[#0F121A]"
            : state === "locked"
              ? "border-transparent bg-white/50 text-[#555D6D] opacity-60"
              : "border-transparent bg-white/50 text-[#555D6D]",
      )}
    >
      {current && (
        <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[#174CB5]" />
      )}
      <span
        className={cx(
          "grid size-5 shrink-0 place-items-center rounded-full text-2xs leading-none font-semibold",
          current && doneMark
            ? "bg-[#22774F] text-white"
            : current
              ? "bg-[#174CB5] text-white"
              : state === "completed"
                ? "bg-[#22774F]/15 text-[#22774F]"
                : state === "optional"
                  ? "bg-[#EDEFF3]/60 text-[#555D6D]/70"
                  : "bg-[#EDEFF3] text-[#555D6D]",
        )}
      >
        {(current && doneMark) || state === "completed" ? (
          <CheckIcon aria-hidden="true" weight="bold" className="size-3" />
        ) : state === "optional" ? (
          <MinusIcon aria-hidden="true" weight="bold" className="size-3" />
        ) : (
          index + 1
        )}
      </span>
      <span className="truncate font-grotesk text-xs leading-tight font-medium">{label}</span>
      {(internal || state === "locked") && (
        <LockSimpleIcon
          aria-label={internal ? "Internal only" : "Locked until signing"}
          className="ml-auto size-3 shrink-0 text-[#555D6D]"
        />
      )}
    </li>
  );
}

function SignRow({
  name,
  role,
  state,
  note,
  className,
}: {
  name: string;
  role: string;
  state: "signed" | "waiting" | "idle";
  note: string;
  className?: string;
}) {
  return (
    <div className={cx("flex items-start gap-2", className)}>
      <span
        className={cx(
          "mt-px grid size-4 shrink-0 place-items-center rounded-full",
          state === "signed"
            ? "bg-[#22774F] text-white"
            : state === "waiting"
              ? "bg-[#BF7918]/15 text-[#BF7918]"
              : "border border-dashed border-[#555D6D]/40",
        )}
      >
        {state === "signed" && <CheckIcon aria-hidden="true" weight="bold" className="size-2.5" />}
        {state === "waiting" && <ClockIcon aria-hidden="true" weight="bold" className="size-2.5" />}
      </span>
      <div className="min-w-0">
        <div className={cx("truncate font-medium text-[#0F121A]", T11)}>{name}</div>
        <div className={cx("text-2xs leading-3.5", state === "waiting" ? "text-[#BF7918]" : "text-[#555D6D]")}>
          {role} · {note}
        </div>
      </div>
    </div>
  );
}

/* ─── Flow of History ─────────────────────────────────────────────────── */

const EVENT_ICON: Record<EventKind, Icon> = {
  initiated: PaperPlaneTiltIcon,
  counter: ArrowsClockwiseIcon,
  accepted: CheckCircleIcon,
  rejected: XCircleIcon,
  routed: PaperPlaneRightIcon,
  sent_to_ceo: PaperPlaneTiltIcon,
  signed_seller: StampIcon,
  signed_buyer: SignatureIcon,
};

function History({ events }: { events: ThreadEvent[] }) {
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const seen = useRef(0);

  // Open at the latest event; glide to anything appended after that.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const appended = seen.current > 0 && events.length > seen.current;
    seen.current = events.length;
    el.scrollTo({ top: el.scrollHeight, behavior: appended && !reduce ? "smooth" : "auto" });
  }, [events.length, reduce]);

  return (
    <div className={cx("flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#DEE1E7]/70 bg-white", E1)}>
      <div className="flex items-center justify-between gap-3 border-b border-[#DEE1E7]/70 bg-linear-to-b from-[#EDEFF3]/30 to-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-[#174CB5]/10 text-[#174CB5]">
            <ClockCounterClockwiseIcon aria-hidden="true" className="size-3.5" />
          </span>
          <div>
            <div className="font-grotesk text-sm leading-tight font-semibold text-[#0F121A]">
              Flow of History
            </div>
            <div className="text-2xs leading-tight text-[#555D6D]">
              {events.length === 0
                ? "Negotiation timeline"
                : `${events.length} event${events.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-2xs text-[#555D6D]">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full border border-[#DEE1E7] bg-[#EDEFF3]" />
            Supplier
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full border border-[#174CB5]/40 bg-[#174CB5]/15" />
            Buyer (you)
          </span>
        </div>
      </div>
      <div
        ref={scroller}
        role="region"
        aria-label="Flow of History"
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto px-3.5 pt-5 pb-3.5 focus-visible:rounded-none! focus-visible:outline-2! focus-visible:-outline-offset-2! focus-visible:outline-[#174CB5]/60!"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0, #000 calc(var(--mu) * 22))",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 calc(var(--mu) * 22))",
        }}
      >
        {events.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-[#EDEFF3] text-[#555D6D]">
              <ClockCounterClockwiseIcon aria-hidden="true" className="size-5" />
            </span>
            <p className="text-xs text-[#555D6D]">
              Nothing yet. The negotiation history appears once the contract is sent.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-3">
            {events.map((e) => (
              <Bubble key={e.id} e={e} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function Bubble({ e }: { e: ThreadEvent }) {
  const own = e.side === "buyer";
  const I = EVENT_ICON[e.kind];
  const hasTerms = e.volumeMt !== undefined || e.window !== undefined || e.remarks !== undefined;
  return (
    <li className={cx("flex flex-col", own ? "items-end" : "items-start")}>
      <div
        className={cx(
          "max-w-[91%] rounded-2xl border px-3.5 py-2.5 shadow-[0_1px_2px_rgba(13,18,28,0.04)]",
          own ? "border-[#174CB5]/30 bg-[#174CB5]/5" : "border-[#DEE1E7] bg-[#EDEFF3]/40",
        )}
      >
        <div
          className={cx(
            "flex items-center gap-1.5 leading-4 font-semibold",
            T11,
            own ? "text-[#174CB5]" : "text-[#555D6D]",
          )}
        >
          <I aria-hidden="true" weight="bold" className="size-3.5" />
          <span>{e.label}</span>
          {e.internal && (
            <span className="rounded-full border border-[#DEE1E7]/70 bg-[#EDEFF3] px-1.5 text-3xs leading-3.5 font-semibold tracking-wide text-[#555D6D] uppercase">
              Internal
            </span>
          )}
        </div>
        {hasTerms && (
          <div className="mt-1.5 flex flex-col gap-1.5 text-[#0F121A]">
            {e.volumeMt !== undefined && e.priceUsd !== undefined && (
              <div className="flex flex-wrap items-baseline gap-x-1.5 font-grotesk tabular-nums">
                <span className={cx("font-semibold", T15)}>{fmtInt(e.volumeMt)} MT @</span>
                {e.prevPriceUsd !== undefined && (
                  <>
                    <span className="text-xs text-[#555D6D] line-through decoration-[#555D6D]/70">
                      {fmtUsd(e.prevPriceUsd)}
                    </span>
                    <ArrowRightIcon aria-label="changed to" className="size-3 self-center text-[#555D6D]/80" />
                  </>
                )}
                <span className={cx("font-semibold", T15)}>{fmtUsd(e.priceUsd)}</span>
              </div>
            )}
            {e.window && (
              <div>
                <div className={cx("font-medium opacity-70", T11)}>Delivery Window</div>
                <div className={cx("flex flex-wrap items-center gap-x-1.5", T13)}>
                  {e.prevWindow && (
                    <>
                      <span className="text-[#555D6D] line-through decoration-[#555D6D]/70">{e.prevWindow}</span>
                      <ArrowRightIcon aria-label="changed to" className="size-3 text-[#555D6D]/80" />
                    </>
                  )}
                  <span>{e.window}</span>
                </div>
              </div>
            )}
            {e.remarks && (
              <div>
                <div className={cx("font-medium opacity-70", T11)}>Remarks</div>
                <div className={cx("leading-4.5", T13)}>{e.remarks}</div>
              </div>
            )}
          </div>
        )}
        <div
          className={cx(
            "mt-1.5 flex items-center justify-between gap-4 text-2xs leading-3.5",
            own ? "text-[#174CB5]/65" : "text-[#555D6D]/80",
          )}
        >
          <span>by {e.actor}</span>
          <span className="tabular-nums">{e.at}</span>
        </div>
      </div>
    </li>
  );
}

/* ─── Key terms ───────────────────────────────────────────────────────── */

function KeyTerms({ c }: { c: Contract }) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#DEE1E7]/70 bg-white">
      <div className="flex items-center gap-2 border-b border-[#DEE1E7]/60 bg-[#EDEFF3]/30 px-3.5 py-2.5">
        <HandshakeIcon aria-hidden="true" className="size-3.5 text-[#555D6D]" />
        <span className={cx("font-grotesk font-semibold text-[#0F121A]", T13)}>Key Terms</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <div className="rounded-lg border border-[#174CB5]/25 bg-[#174CB5]/5 px-3 py-2.5">
          <div className={cx("font-medium text-[#555D6D]", T11)}>Contract Value</div>
          <div className="mt-0.5 font-grotesk text-base leading-5 font-semibold tabular-nums text-[#174CB5]">
            {fmtUsd(c.volumeMt * c.priceUsd)}
          </div>
          <div className={cx("mt-0.5 font-grotesk tabular-nums text-[#555D6D]", T11)}>
            {fmtInt(c.volumeMt)} MT at {fmtUsd(c.priceUsd)}
          </div>
        </div>
        <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2">
          <Term label="Product" value={c.product} />
          <Term label="Incoterm" value="FOB" />
          <Term label="Port" value={c.port} wide />
          <Term label="Payment Terms" value={c.paymentTerms} wide />
          <Term label="Delivery Window" value={c.window.label} wide />
        </dl>
        <div className="border-t border-[#DEE1E7]/70 pt-2.5">
          <Kicker className="mb-1.5">Quality specification</Kicker>
          <dl className="flex flex-col">
            {QUALITY[c.product].map((q) => (
              <div
                key={q.param}
                className={cx("flex items-center justify-between border-b border-dashed border-[#DEE1E7] py-0.75 last:border-0", T11)}
              >
                <dt className="text-[#555D6D]">{q.param}</dt>
                <dd className="font-grotesk font-semibold tabular-nums text-[#0F121A]">{q.spec}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Term({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className={cx("font-medium text-[#555D6D]", T11)}>{label}</dt>
      <dd className={cx("mt-px leading-4.5 font-medium text-[#0F121A]", T13)}>{value}</dd>
    </div>
  );
}

/* ─── Floating action bar ─────────────────────────────────────────────── */

const STAGE_TONE: Record<Tone, string> = {
  neutral: "bg-[#EDEFF3] text-[#555D6D]",
  success: "bg-[#22774F]/12 text-[#22774F]",
  info: "bg-[#1474A3]/12 text-[#1474A3]",
  warning: "bg-[#BF7918]/15 text-[#BF7918]",
  danger: "bg-[#CF3830]/10 text-[#CF3830]",
  teal: "bg-[#17827D]/12 text-[#17827D]",
};

function stageOf(c: Contract, record?: SignedRecord): { tone: Tone; text: string } {
  switch (c.status) {
    case "To Sign":
      return { tone: "warning", text: "Supplier has signed, awaiting CEO signature" };
    case "Fully Executed":
      return {
        tone: "success",
        text: `Fully executed on ${record?.labels.day ?? c.presigned?.signedOn ?? ""}`,
      };
    case "To Reply":
      return c.awaiting === "you"
        ? { tone: "warning", text: "Supplier countered, your reply is due" }
        : { tone: "neutral", text: "Counter sent, awaiting supplier reply" };
    case "Pending Confirmation":
      return { tone: "warning", text: "New offer, awaiting your confirmation" };
    case "Pending Director":
      return { tone: "warning", text: "Awaiting Director approval" };
    case "Accepted":
      return { tone: "info", text: "Terms agreed, ready to send for signing" };
    case "Rejected":
      return { tone: "danger", text: `Rejected on ${c.stageDate ?? ""}` };
    case "Expired":
      return { tone: "neutral", text: `Offer lapsed on ${c.stageDate ?? ""}` };
    default:
      return { tone: "neutral", text: "Draft" };
  }
}

const GHOST_BTN =
  "inline-flex h-9 items-center gap-1.5 rounded-md border border-[#DEE1E7] bg-[#F6F7F9] px-3 font-medium text-[#0F121A]";

function ActionBar({
  contract: c,
  record,
  executed,
  signing,
  onSign,
  onViewStamp,
  onVerify,
  verifyBusy,
  signRef,
  verifyRef,
}: {
  contract: Contract;
  record?: SignedRecord;
  executed: boolean;
  signing: boolean;
  onSign: () => void;
  onViewStamp: () => void;
  onVerify: () => void;
  verifyBusy: boolean;
  signRef: Ref<HTMLButtonElement>;
  verifyRef: Ref<HTMLButtonElement>;
}) {
  const stage = stageOf(c, record);
  const lockedTitle = signing
    ? "Terms are locked while the contract is out for signature"
    : "Not available at this stage";

  return (
    <div
      className={cx(
        "absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl border border-[#DEE1E7]/70 bg-white/90 px-4 py-2.5 backdrop-blur",
        E2,
      )}
    >
      <span role="status" className={cx("mr-auto rounded-md px-3 py-1.5 text-xs font-medium", STAGE_TONE[stage.tone])}>
        {stage.text}
      </span>

      {executed ? (
        <div className="flex items-center gap-2">
          {record?.session && (
            <button
              type="button"
              onClick={onViewStamp}
              className={cx(
                GHOST_BTN,
                "cursor-pointer transition-colors hover:bg-[#E6E9EF] focus-visible:rounded-md! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-[#174CB5]!",
                T13,
              )}
            >
              <StampIcon aria-hidden="true" className="size-4" />
              View stamp
            </button>
          )}
          <button
            ref={verifyRef}
            type="button"
            onClick={onVerify}
            disabled={verifyBusy}
            className={cx(
              "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-4 font-semibold text-white transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98] disabled:cursor-progress disabled:opacity-80 focus-visible:rounded-md! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-[#174CB5]!",
              T13,
            )}
            style={{ background: BRAND_GRADIENT, boxShadow: BRAND_SHADOW }}
          >
            <SealCheckIcon aria-hidden="true" weight="bold" className="size-4" />
            {verifyBusy ? "Checking…" : "Verify signature"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span title={lockedTitle} className={cx(GHOST_BTN, "cursor-not-allowed opacity-50", T13)}>
            <CheckIcon aria-hidden="true" className="size-4" />
            Accept
          </span>
          <span title={lockedTitle} className={cx(GHOST_BTN, "cursor-not-allowed opacity-50", T13)}>
            <ArrowUUpLeftIcon aria-hidden="true" className="size-4" />
            Counter
          </span>
          <span
            title={lockedTitle}
            className={cx(GHOST_BTN, "cursor-not-allowed text-[#CF3830] opacity-50", T13)}
          >
            <XIcon aria-hidden="true" className="size-4" />
            Reject
          </span>
          <span aria-hidden="true" className="mx-1 h-6 w-px bg-[#DEE1E7]" />
          {signing ? (
            <button
              ref={signRef}
              type="button"
              onClick={onSign}
              className={cx(
                "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-4 font-semibold text-white transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98] focus-visible:rounded-md! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-[#174CB5]!",
                T13,
              )}
              style={{ background: BRAND_GRADIENT, boxShadow: BRAND_SHADOW }}
            >
              <SignatureIcon aria-hidden="true" weight="bold" className="size-4" />
              Sign
            </button>
          ) : (
            <span
              title="Signing opens once terms are agreed and sent to the CEO"
              className={cx(
                "inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-md bg-[#174CB5] px-4 font-semibold text-white opacity-40",
                T13,
              )}
            >
              <SignatureIcon aria-hidden="true" weight="bold" className="size-4" />
              Sign
            </span>
          )}
        </div>
      )}
    </div>
  );
}
