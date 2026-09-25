import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  FileTextIcon,
  InfoIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  SignatureIcon,
  XIcon,
} from "@phosphor-icons/react";
import { BUYER, SIGNER_CAPTION, type Contract } from "./data";
import { shortSeal, type SignedRecord } from "./seal";
import {
  BRAND_GRADIENT,
  BRAND_SHADOW,
  E3,
  Kicker,
  QrBlock,
  StatusPill,
  T11,
  T13,
  cx,
} from "./ui";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const FOCUS_BTN =
  "focus-visible:rounded-md! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-[#174CB5]!";

/**
 * The CEO signing dialog. Types a legal name, previews the stamp, then mints
 * a real seal and shows the executed stamp with its QR block.
 */
export function SignDialog({
  contract: c,
  record,
  onClose,
  onSign,
  onVerify,
}: {
  contract: Contract;
  record?: SignedRecord;
  onClose: () => void;
  onSign: (name: string) => Promise<void>;
  onVerify: () => void;
}) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const verifyBtn = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"form" | "sealing" | "error">("form");
  const done = record !== undefined;
  const busy = phase === "sealing" && !done;
  const trimmed = name.trim();

  // Put focus where the work is: the name field, then the next step.
  useEffect(() => {
    const el = done ? verifyBtn.current : nameInput.current;
    el?.focus({ preventScroll: true });
  }, [done]);

  const submit = async () => {
    if (!trimmed || busy) return;
    setPhase("sealing");
    try {
      await onSign(trimmed);
    } catch {
      setPhase("error");
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && !busy) {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panel.current) return;
    const items = Array.from(
      panel.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled])"),
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = panel.current.ownerDocument.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const fade = reduce ? { duration: 0 } : { duration: 0.18, ease: EASE };

  return (
    <div className="absolute inset-0 z-50 grid place-items-center" onKeyDown={onKeyDown}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[#0B0F18]/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
        onClick={() => !busy && onClose()}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cx(
          "relative w-[calc(var(--mu)*620)] rounded-xl border border-[#DEE1E7] bg-white p-6 text-[#0F121A]",
          E3,
        )}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        transition={fade}
      >


        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASE }}
            >
              <div className="flex items-center gap-2.5 pr-8">
                <span className="grid size-7 place-items-center rounded-full bg-[#22774F]/12 text-[#22774F]">
                  <CheckCircleIcon aria-hidden="true" weight="fill" className="size-4.5" />
                </span>
                <div id={titleId} className="font-grotesk text-lg leading-6 font-semibold tracking-tight">
                  Contract executed
                </div>
              </div>
              <p id={descId} className={cx("mt-1.5 text-[#555D6D]", T13)}>
                Your signature is sealed. <span className="font-grotesk font-medium text-[#0F121A]">{c.ref}</span>{" "}
                is now fully executed and anyone holding the token can verify it.
              </p>

              <ExecutedStamp record={record} className="mt-5" />

              <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#DEE1E7]/80 bg-[#F6F7F9] px-3.5 py-2.5">
                <span className={cx("font-medium text-[#555D6D]", T11)}>Status</span>
                <StatusPill status="Fully Executed" />
                <span className={cx("ml-auto truncate text-[#555D6D]", T11)}>
                  Counter-signed by {c.counterparty}
                  {c.supplierSignedOn ? ` on ${c.supplierSignedOn}` : ""}
                </span>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={cx(
                    "inline-flex h-9 cursor-pointer items-center rounded-md border border-[#DEE1E7] bg-white px-4 font-medium transition-colors hover:bg-[#E6E9EF]",
                    T13,
                    FOCUS_BTN,
                  )}
                >
                  Close
                </button>
                <button
                  ref={verifyBtn}
                  type="button"
                  onClick={onVerify}
                  className={cx(
                    "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-4 font-semibold text-white transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98]",
                    T13,
                    FOCUS_BTN,
                  )}
                  style={{ background: BRAND_GRADIENT, boxShadow: BRAND_SHADOW }}
                >
                  <SealCheckIcon aria-hidden="true" weight="bold" className="size-4" />
                  Verify signature
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.14, ease: EASE }}
            >
              <div className="flex items-center gap-2 pr-8">
                <FileTextIcon aria-hidden="true" className="size-5" />
                <div id={titleId} className="font-grotesk text-lg leading-6 font-semibold tracking-tight">
                  Sign Purchase Contract
                </div>
              </div>
              <p id={descId} className={cx("mt-1.5 text-[#555D6D]", T13)}>
                Sign on behalf of {BUYER} to add the buyer&apos;s signature to{" "}
                <span className="font-grotesk font-medium text-[#0F121A]">{c.ref}</span>. The supplier has
                already signed, so your signature executes the contract.
              </p>

              <div className="mt-5">
                <label htmlFor={`${titleId}-name`} className="text-xs font-medium">
                  Type your full legal name <span className="text-[#CF3830]">*</span>
                </label>
                <input
                  ref={nameInput}
                  id={`${titleId}-name`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (phase === "error") setPhase("form");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void submit();
                  }}
                  disabled={busy}
                  placeholder="e.g. Daniel Lim"
                  autoComplete="off"
                  spellCheck={false}
                  className={cx(
                    "mt-2 h-10 w-full rounded-md border border-[#DEE1E7] bg-white px-3 text-[#0F121A] caret-[#174CB5] outline-none placeholder:text-[#555D6D]/80 disabled:opacity-60 focus-visible:rounded-md! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-[#1A53C7]/50 focus-visible:ring-offset-1",
                    T13,
                  )}
                />
                <p className={cx("mt-2 leading-relaxed text-[#555D6D]", T11)}>
                  By typing your name and clicking <strong className="font-semibold text-[#0F121A]">Sign contract</strong>, you
                  agree this is a legally binding electronic signature. The portal mints a unique verification token and a
                  tamper-evident seal over the contract, and prints both on the executed file.
                </p>
              </div>

              <StampPreview name={trimmed} className="mt-4" />

              {phase === "error" && (
                <div
                  role="alert"
                  className={cx(
                    "mt-3 flex items-start gap-2 rounded-md border border-[#BF7918]/30 bg-[#BF7918]/10 px-3 py-2 text-[#8A560F]",
                    T11,
                  )}
                >
                  <InfoIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                  Signing needs the Web Crypto API, which this browser only offers on secure (https) pages.
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className={cx(
                    "inline-flex h-9 cursor-pointer items-center rounded-md border border-[#DEE1E7] bg-white px-4 font-medium transition-colors hover:bg-[#E6E9EF] disabled:opacity-50",
                    T13,
                    FOCUS_BTN,
                  )}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void submit()}
                  disabled={!trimmed || busy}
                  className={cx(
                    "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-[#174CB5] px-4 font-semibold text-white transition-[filter,transform,opacity] duration-150 enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
                    T13,
                    FOCUS_BTN,
                  )}
                  style={trimmed ? { background: BRAND_GRADIENT, boxShadow: BRAND_SHADOW } : undefined}
                >
                  {busy ? (
                    <CircleNotchIcon
                      aria-hidden="true"
                      weight="bold"
                      className={cx("size-4", !reduce && "animate-spin")}
                    />
                  ) : (
                    <SignatureIcon aria-hidden="true" weight="bold" className="size-4" />
                  )}
                  {busy ? "Sealing…" : "Sign contract"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
          className={cx(
            "absolute top-4 right-4 grid size-7 cursor-pointer place-items-center rounded-md text-[#555D6D] transition-colors hover:bg-[#EDEFF3] hover:text-[#0F121A] disabled:opacity-40",
            FOCUS_BTN,
          )}
        >
          <XIcon aria-hidden="true" className="size-4" />
        </button>
      </motion.div>
    </div>
  );
}

function StampPreview({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cx("rounded-lg border-2 border-dashed border-[#DEE1E7] bg-[#EDEFF3]/40 p-4", className)}>
      <Kicker>Stamp preview</Kicker>
      <div
        className={cx(
          "mt-2 rounded-md border p-4 transition-colors duration-200",
          name ? "border-[#174CB5]/30 bg-[#174CB5]/5" : "border-[#DEE1E7] bg-white",
        )}
      >
        <div className="flex items-start gap-3">
          <ShieldCheckIcon
            aria-hidden="true"
            weight={name ? "fill" : "regular"}
            className={cx("mt-0.5 size-5 shrink-0", name ? "text-[#174CB5]" : "text-[#555D6D]/40")}
          />
          <div className="min-w-0 flex-1">
            <div
              className={cx(
                "truncate font-serif text-xl leading-tight italic",
                name ? "text-[#0F121A]" : "text-[#555D6D]/45",
              )}
            >
              {name || "Your name will appear here"}
            </div>
            <div className={cx("mt-0.5 text-[#555D6D]", T11)}>{SIGNER_CAPTION}</div>
            <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-2xs leading-4 text-[#555D6D]">
              <span className="font-semibold tracking-wider uppercase">Token</span>
              <span>
                TP-SIG-XXXX-XXXX <span className="text-[#555D6D]/60">(generated on submit)</span>
              </span>
              <span className="font-semibold tracking-wider uppercase">Seal</span>
              <span>
                sha256:… <span className="text-[#555D6D]/60">(generated on submit)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The executed stamp as printed on the contract, with its QR block. */
export function ExecutedStamp({ record, className }: { record: SignedRecord; className?: string }) {
  return (
    <div className={cx("rounded-lg border border-[#174CB5]/25 bg-[#174CB5]/[0.035] p-4", className)}>
      <div className="flex items-start gap-3">
        <ShieldCheckIcon aria-hidden="true" weight="fill" className="mt-0.5 size-5 shrink-0 text-[#174CB5]" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-serif text-xl leading-tight text-[#0F121A] italic">{record.signer}</div>
          <div className={cx("mt-0.5 text-[#555D6D]", T11)}>{SIGNER_CAPTION}</div>
          <div className={cx("text-[#555D6D]", T11)}>Signed {record.labels.stamp}</div>
          <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-2xs leading-4 text-[#555D6D]">
            <span className="font-semibold tracking-wider uppercase">Token</span>
            <span className="font-medium break-all text-[#0F121A]">{record.token}</span>
            <span className="font-semibold tracking-wider uppercase">Seal</span>
            <span className="break-all">{shortSeal(record.seal)}</span>
          </div>
        </div>
        <QrBlock hex={record.seal} />
      </div>
    </div>
  );
}
