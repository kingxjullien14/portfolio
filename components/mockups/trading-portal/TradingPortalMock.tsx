"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { MockScreen } from "../MockScreen";
import { CONTRACTS, timeLabels, type Contract, type SegmentKey } from "./data";
import { hasSubtle, mintSeal, termsOf, verifySeal, type SignedRecord, type VerifyResult } from "./seal";
import { Sidebar, TopBar } from "./Shell";
import { ListView } from "./ListView";
import { DetailView } from "./DetailView";
import { SignDialog } from "./SignDialog";
import { VerifyView } from "./VerifyView";

type View = "list" | "detail" | "verify";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const MYT = 8 * 60;

const TITLES: Record<View, string> = {
  list: "Purchase Contracts",
  detail: "Purchase Contract",
  verify: "Signature verification",
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * The Trading Panel, recreated: the purchase-contract inbox, a negotiation
 * detail, the CEO signing dialog and the public verification page. The seal
 * is real: SHA-256 and HMAC-SHA256 computed in the browser with Web Crypto.
 */
export function TradingPortalMock({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const groupId = useId();

  const [view, setView] = useState<View>("list");
  const [openRef, setOpenRef] = useState(CONTRACTS[0].ref);
  const [segment, setSegment] = useState<SegmentKey>("all");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<Record<string, SignedRecord>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verify, setVerify] = useState<{ ref: string; initial: VerifyResult | null } | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [announce, setAnnounce] = useState("");

  const viewEls = useRef<Record<View, HTMLDivElement | null>>({ list: null, detail: null, verify: null });
  const signBtn = useRef<HTMLButtonElement>(null);
  const verifyBtn = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const returnFocus = useRef(false);

  // A signature made here flips the row everywhere it appears.
  const contracts: Contract[] = useMemo(
    () =>
      CONTRACTS.map((c) =>
        records[c.ref]?.session
          ? { ...c, status: "Fully Executed", awaiting: undefined, updated: "Just now" }
          : c,
      ),
    [records],
  );
  const current = contracts.find((c) => c.ref === openRef) ?? contracts[0];

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    viewEls.current[view]?.focus({ preventScroll: true });
  }, [view]);

  useEffect(() => {
    if (dialogOpen || !returnFocus.current) return;
    returnFocus.current = false;
    const sign = signBtn.current;
    (sign && sign.isConnected ? sign : verifyBtn.current)?.focus({ preventScroll: true });
  }, [dialogOpen]);

  const go = (next: View) => {
    moveFocus.current = true;
    setView(next);
  };

  const openContract = (ref: string) => {
    setOpenRef(ref);
    go("detail");
  };

  const closeDialog = () => {
    returnFocus.current = true;
    setDialogOpen(false);
  };

  const sign = async (name: string) => {
    if (!hasSubtle()) throw new Error("Web Crypto unavailable");
    const c = current;
    const now = new Date();
    const [rec] = await Promise.all([
      mintSeal(termsOf(c), name, now.toISOString()),
      wait(reduce ? 120 : 520),
    ]);
    setRecords((prev) => ({ ...prev, [c.ref]: { ...rec, labels: timeLabels(now), session: true } }));
    setAnnounce(`Signed and sealed. ${c.ref} is fully executed.`);
  };

  const openVerify = async () => {
    const c = current;
    setVerifyBusy(true);
    try {
      let rec: SignedRecord | undefined = records[c.ref];
      const canCheck = hasSubtle();
      if (!rec && c.presigned && canCheck) {
        const base = await mintSeal(termsOf(c), c.presigned.signer, c.presigned.signedAtIso);
        rec = { ...base, labels: timeLabels(new Date(c.presigned.signedAtIso), MYT), session: false };
        const made = rec;
        setRecords((prev) => ({ ...prev, [c.ref]: made }));
      }
      const initial = rec && canCheck ? await verifySeal(rec, rec.terms) : null;
      setVerify({ ref: c.ref, initial });
      returnFocus.current = false;
      setDialogOpen(false);
      go("verify");
      setAnnounce(
        initial === null
          ? "The seal cannot be checked in this browser."
          : initial.hmacOk && initial.contentOk
            ? "Signature is valid."
            : "Signature does not match this contract.",
      );
    } finally {
      setVerifyBusy(false);
    }
  };

  const fade = reduce ? { duration: 0 } : { duration: 0.2, ease: EASE };
  const verifyRecord = verify ? records[verify.ref] : undefined;

  return (
    <MockScreen w={1180} h={740} label="Trading Panel purchase contracts, interactive recreation" className={className}>
      <LayoutGroup id={groupId}>
        <div className="relative flex size-full bg-[#F2F4F8] font-ui text-[#0F121A] antialiased selection:bg-[#174CB5]/20 selection:text-[#0F121A]">
          <div className="flex size-full" inert={dialogOpen || undefined}>
            <Sidebar />
            <div className="relative my-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#F6F7F9] shadow-[0_1px_3px_rgba(13,18,28,0.1),0_1px_2px_-1px_rgba(13,18,28,0.1)]">
              <TopBar title={TITLES[view]} showNew={view === "list"} />
              <div className="relative min-h-0 flex-1">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={view}
                    ref={(el: HTMLDivElement | null) => {
                      viewEls.current[view] = el;
                    }}
                    tabIndex={-1}
                    role="region"
                    aria-label={
                      view === "list"
                        ? "Purchase contracts"
                        : view === "detail"
                          ? `Contract ${current.ref}`
                          : "Signature verification"
                    }
                    className="absolute inset-0 outline-none focus-visible:outline-none!"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                  >
                    {view === "list" && (
                      <ListView
                        contracts={contracts}
                        segment={segment}
                        onSegment={setSegment}
                        query={query}
                        onQuery={setQuery}
                        onOpen={openContract}
                      />
                    )}
                    {view === "detail" && (
                      <DetailView
                        contract={current}
                        record={records[current.ref]}
                        onBack={() => go("list")}
                        onSign={() => setDialogOpen(true)}
                        onViewStamp={() => setDialogOpen(true)}
                        onVerify={() => void openVerify()}
                        verifyBusy={verifyBusy}
                        signRef={signBtn}
                        verifyRef={verifyBtn}
                      />
                    )}
                    {view === "verify" && verify && (
                      <VerifyView
                        key={verify.ref}
                        reference={verify.ref}
                        record={verifyRecord}
                        initial={verify.initial}
                        onBack={() => go("detail")}
                        onAnnounce={setAnnounce}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {dialogOpen && (
              <SignDialog
                key="sign"
                contract={current}
                record={records[current.ref]?.session ? records[current.ref] : undefined}
                onClose={closeDialog}
                onSign={sign}
                onVerify={() => void openVerify()}
              />
            )}
          </AnimatePresence>

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {announce}
          </div>
        </div>
      </LayoutGroup>
    </MockScreen>
  );
}
