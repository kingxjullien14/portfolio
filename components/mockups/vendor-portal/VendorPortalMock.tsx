"use client";

import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MockScreen } from "../MockScreen";
import { Dashboard } from "./Dashboard";
import { MAINTENANCE, type MaintenanceRow } from "./data";
import { Maintenance } from "./Maintenance";
import { MaintenanceModal } from "./MaintenanceModal";
import { Header, Sidebar, type View } from "./Shell";

interface Toast {
  key: number;
  status: "verified" | "rejected";
  no: string;
}

const TITLES: Record<View, string> = { dashboard: "Dashboard", maintenance: "Maintenance" };

/**
 * The Vendor Portal (restaurant groups register, manage outlets and tanks, and
 * follow collections), recreated at 1180 x 740 with synthetic data.
 * Dashboard and Maintenance are live: the chart toggles re-plot, and a
 * Pending Verify row opens its detail dialog where Verify or Reject updates it.
 */
export function VendorPortalMock({ className }: { className?: string }) {
  const [view, setView] = useState<View>("dashboard");
  const [switched, setSwitched] = useState(false);
  const [rows, setRows] = useState<MaintenanceRow[]>(MAINTENANCE);
  const [openId, setOpenId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ id: string; tone: "verified" | "rejected" } | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLElement | null>(null);
  const regionRef = useRef<HTMLDivElement | null>(null);
  const toastSeq = useRef(0);

  const openRow = rows.find((r) => r.id === openId) ?? null;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 900);
    return () => window.clearTimeout(t);
  }, [flash]);

  const restoreFocus = () => {
    const target = triggerRef.current;
    window.requestAnimationFrame(() => {
      const el = target && target.isConnected ? target : regionRef.current;
      el?.focus({ preventScroll: true });
    });
  };

  const select = (v: View) => {
    if (v === view) return;
    setSwitched(true);
    setView(v);
  };

  const open = (id: string, trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    setToast(null);
    setOpenId(id);
  };

  const close = () => {
    setOpenId(null);
    restoreFocus();
  };

  const decide = (status: "verified" | "rejected") => {
    if (!openRow) return;
    const { id, no } = openRow;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    setOpenId(null);
    setFlash({ id, tone: status });
    toastSeq.current += 1;
    setToast({ key: toastSeq.current, status, no });
    restoreFocus();
  };

  return (
    <MockScreen w={1180} h={740} label="Vendor Portal, recreated with synthetic data" className={className}>
      <div
        className="relative flex size-full bg-[#E8F7ED] font-ui text-sm text-[#1A2822]"
        style={{ fontFeatureSettings: '"cv11", "ss01"' }}
      >
        <Sidebar view={view} onSelect={select} />

        <div className="relative my-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#FCFDFC] shadow-[0_1px_3px_rgba(20,40,30,0.1),0_1px_2px_rgba(20,40,30,0.06)]">
          <motion.div
            key={view}
            initial={switched ? { opacity: 0, y: "1.1%" } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <Header title={TITLES[view]} />
            {view === "dashboard" ? (
              <Dashboard />
            ) : (
              <Maintenance rows={rows} flash={flash} onOpen={open} regionRef={regionRef} />
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {openRow ? <MaintenanceModal key={openRow.id} row={openRow} onClose={close} onDecide={decide} /> : null}
        </AnimatePresence>

        <div aria-live="polite" className="pointer-events-none absolute bottom-6 right-6 z-50">
          <AnimatePresence>
            {toast ? (
              <motion.div
                key={toast.key}
                initial={{ opacity: 0, y: "60%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "20%" }}
                transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-[calc(var(--mu)*300)] items-start gap-2.5 rounded-lg border border-[#E1EAE6] bg-white px-4 py-3.5 shadow-[0_calc(var(--mu)*6)_calc(var(--mu)*18)_rgba(20,40,30,0.12)]"
              >
                {toast.status === "verified" ? (
                  <CheckCircleIcon aria-hidden weight="fill" className="mt-px size-4 shrink-0 text-[#23954D]" />
                ) : (
                  <XCircleIcon aria-hidden weight="fill" className="mt-px size-4 shrink-0 text-[#DE3434]" />
                )}
                <div className="min-w-0">
                  <div className="text-[length:calc(var(--mu)*13)] font-medium leading-[calc(var(--mu)*18)]">
                    {toast.status === "verified" ? "Maintenance verified" : "Maintenance rejected"}
                  </div>
                  <div className="text-xs leading-4 text-[#5B6C65]">{toast.no}</div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </MockScreen>
  );
}
