"use client";

import {
  ArrowsLeftRight,
  BellRinging,
  CalendarDots,
  Check,
  Clock,
  Drop,
  MapTrifold,
  Phone,
  QrCode,
  Scales,
  Wallet,
  Wrench,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useId, type Ref } from "react";
import { PICKUP, USER } from "./data";
import { tr, type Lang, type StrKey } from "./i18n";
import { mu } from "./ui";
import styles from "./vendor-app.module.css";

// With an active pickup the app greys out Schedule / Instant Collection.
const SHORTCUTS: { key: StrKey; Icon: Icon; muted: boolean }[] = [
  { key: "scheduleCollection", Icon: CalendarDots, muted: true },
  { key: "instantCollection", Icon: ArrowsLeftRight, muted: true },
  { key: "serviceHistory", Icon: Wrench, muted: false },
  { key: "showQr", Icon: QrCode, muted: false },
];

export function HomeScreen({
  lang,
  sheetOpen,
  onToggleSheet,
  onTrack,
  trackRef,
  onCall,
  onRemind,
  reduce,
}: {
  lang: Lang;
  sheetOpen: boolean;
  onToggleSheet: () => void;
  onTrack: () => void;
  trackRef: Ref<HTMLButtonElement>;
  onCall: () => void;
  onRemind: () => void;
  reduce: boolean;
}) {
  const t = (key: StrKey) => tr(key, lang);

  return (
    <div className="absolute inset-0 bg-[#FAFAFA]">
      <div data-lenis-prevent="" className="absolute inset-0 overflow-y-auto">
        {/* Navy top section: greeting, balance hero, outlet card */}
        <div className="rounded-b-[calc(var(--mu)*28)] bg-linear-to-b from-[#1A3D5C] to-[#0D1F2D] px-5 pt-16.5 pb-5.5">
          <div className="bg-linear-to-r from-white/75 to-white/55 bg-clip-text text-[length:calc(var(--mu)*16)] tracking-[0.03em] text-transparent">
            {t("hello")}
          </div>
          <div className="mt-1 text-[length:calc(var(--mu)*22)] font-bold tracking-[0.02em] text-white">
            {USER.firstName}
          </div>

          <div className="relative mt-6 rounded-[calc(var(--mu)*20)] bg-linear-to-br from-[#047857] via-[#10B981] to-[#34D399] p-4.5 shadow-[0_calc(var(--mu)*8)_calc(var(--mu)*18)_rgba(5,150,105,0.28)]">
            <Wallet weight="fill" aria-hidden className="absolute top-2.5 right-2 size-24 text-white/12" />
            <div className="relative">
              <span className="inline-flex max-w-full items-center gap-[calc(var(--mu)*5)] rounded-full bg-white/18 px-2.5 py-[calc(var(--mu)*5)]">
                <Wallet weight="fill" className="size-[calc(var(--mu)*13)] shrink-0 text-white/95" />
                <span className="truncate text-[length:calc(var(--mu)*11.5)] font-semibold text-white/95">
                  {t("availableToWithdraw")}
                </span>
              </span>
              <div className="mt-4 flex items-start">
                <span className="text-[length:calc(var(--mu)*34)] leading-none font-extrabold tracking-[-0.03em] text-white">
                  {USER.balance}
                </span>
                <span className="pt-[calc(var(--mu)*3)] pl-1 text-[length:calc(var(--mu)*13)] font-bold text-white/70">
                  {USER.currency}
                </span>
              </div>
              <div className="mt-3.5 text-[length:calc(var(--mu)*12)] font-semibold text-white/85">{t("seeActivity")}</div>
            </div>
          </div>

          <div className="mt-4 rounded-[calc(var(--mu)*14)] bg-[#1A3D5C] px-4 py-3.5 shadow-[0_calc(var(--mu)*6)_calc(var(--mu)*16)_rgba(0,0,0,0.2)]">
            <div className="text-[length:calc(var(--mu)*11)] text-white/50 italic">{t("outletName")}</div>
            <div className="mt-1 text-[length:calc(var(--mu)*14)] font-bold tracking-[0.02em] text-white">{USER.outlet}</div>
            <div className="mt-2.5 text-[length:calc(var(--mu)*11)] text-white/50 italic">{t("outletCode")}</div>
            <div className="mt-1 text-[length:calc(var(--mu)*16)] font-bold tracking-[0.03em] text-white">{USER.outletCode}</div>
          </div>
        </div>

        {/* White section: quick actions and promo banner. Bottom padding clears the sheet. */}
        <div className="px-5 pt-5" style={{ paddingBottom: mu(sheetOpen ? 346 : 106) }}>
          <div className="flex rounded-2xl bg-white px-[calc(var(--mu)*5)] py-2.5 shadow-[0_calc(var(--mu)*4)_calc(var(--mu)*16)_rgba(0,0,0,0.1)]">
            {SHORTCUTS.map(({ key, Icon, muted }) => (
              <div key={key} className="flex flex-1 flex-col items-center py-2">
                <Icon className={`size-8 ${muted ? "text-[#9E9E9E]" : "text-[#0EA5E9]"}`} />
                <span className="mt-2 text-center text-[length:calc(var(--mu)*11)] leading-[1.3] font-medium whitespace-pre-line text-[#374151]">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>

          <div className="relative mx-0.5 mt-5 h-40 overflow-hidden rounded-2xl bg-linear-to-br from-[#12324D] via-[#155A86] to-[#0A97D6] shadow-[0_calc(var(--mu)*6)_calc(var(--mu)*16)_rgba(0,0,0,0.2)]">
            <div aria-hidden className="absolute -top-16 -right-14 size-60 rounded-full border border-white/10" />
            <div aria-hidden className="absolute -top-6 -right-4 size-40 rounded-full border border-white/10" />
            <div aria-hidden className="absolute top-4 right-5 grid size-18 place-items-center rounded-full bg-white/10">
              <Drop weight="fill" className="size-9 text-white/85" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="max-w-[calc(var(--mu)*250)] text-[length:calc(var(--mu)*16)] leading-[1.3] font-bold text-balance text-white [text-shadow:0_0_calc(var(--mu)*8)_rgba(0,0,0,0.3)]">
                {t("scheduleNext")}
              </div>
              <div className="mt-1 text-[length:calc(var(--mu)*12)] font-medium text-white/80">{t("visitWebsite")}</div>
            </div>
          </div>
          <div aria-hidden className="mt-3 flex justify-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-[#D5DAE1]" />
            <span className="h-2 w-6 rounded-sm bg-[#00A8FF]" />
          </div>
        </div>
      </div>

      <PickupSheet
        lang={lang}
        open={sheetOpen}
        onToggle={onToggleSheet}
        onTrack={onTrack}
        trackRef={trackRef}
        onCall={onCall}
        onRemind={onRemind}
        reduce={reduce}
      />
    </div>
  );
}

/** The sticky "active pickup" card from home_page.dart (_buildStickyPendingCard). */
function PickupSheet({
  lang,
  open,
  onToggle,
  onTrack,
  trackRef,
  onCall,
  onRemind,
  reduce,
}: {
  lang: Lang;
  open: boolean;
  onToggle: () => void;
  onTrack: () => void;
  trackRef: Ref<HTMLButtonElement>;
  onCall: () => void;
  onRemind: () => void;
  reduce: boolean;
}) {
  const t = (key: StrKey) => tr(key, lang);
  const detailsId = useId();

  return (
    <div className="absolute inset-x-0 bottom-0 rounded-t-[calc(var(--mu)*28)] bg-white pt-1 shadow-[0_calc(var(--mu)*-8)_calc(var(--mu)*24)_rgba(0,0,0,0.12),0_calc(var(--mu)*-2)_calc(var(--mu)*8)_rgba(0,0,0,0.04)]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={onToggle}
        className={`block w-full rounded-t-[calc(var(--mu)*28)] text-left ${styles.inset}`}
      >
        <span aria-hidden className="mx-auto mb-1.5 block h-1 w-9 rounded-xs bg-[#A5D9CB]" />
        <span className="mx-4 flex items-center rounded-[calc(var(--mu)*14)] border border-[#10B981]/20 bg-linear-to-br from-[#10B981]/8 to-[#059669]/5 px-3 py-2.5">
          <span className="min-w-0 flex-1">
            <span className="flex items-center">
              <span className="shrink-0 rounded-sm bg-[#10B981]/15 px-1.5 py-0.5 text-[length:calc(var(--mu)*9)] leading-[1.2] font-bold tracking-[0.055em] text-[#059669]">
                {t("assigned")}
              </span>
              <span className="ml-2 line-clamp-2 text-[length:calc(var(--mu)*14)] font-semibold text-[#059669]">{t("collectorOnWay")}</span>
            </span>
            <span className="mt-[calc(var(--mu)*3)] flex items-center">
              <Clock weight="bold" className="size-3 shrink-0 text-[#059669]" />
              <span className="ml-1 truncate text-[length:calc(var(--mu)*12)] italic">
                <span className="text-[#757575]">{t("scheduledCollectBy")}</span>
                <span className="font-bold text-[#059669]">{PICKUP.date}</span>
              </span>
            </span>
          </span>
          <span className="ml-2.5 grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#10B981]/20 to-[#059669]/10 shadow-[0_0_calc(var(--mu)*12)_rgba(16,185,129,0.3)]">
            <Check weight="bold" className="size-6 text-[#059669]" />
          </span>
        </span>
      </button>

      <motion.div
        id={detailsId}
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        inert={!open}
        className="overflow-hidden"
      >
        <div className="mx-4 mt-2 p-2.5">
          <div className="flex items-center">
            <span className="grid size-10.5 shrink-0 place-items-center rounded-[calc(var(--mu)*10)] bg-linear-to-br from-[#3B82F6]/12 to-[#0EA5E9]/20 text-[length:calc(var(--mu)*14)] font-bold tracking-[0.02em] text-[#0369A1]">
              {PICKUP.initials}
            </span>
            <span className="ml-3 min-w-0 flex-1">
              <span className="block truncate text-[length:calc(var(--mu)*15)] font-bold text-[#1F2937]">
                {PICKUP.collector}
              </span>
              <span className="mt-1 inline-block rounded-sm bg-[#6366F1]/10 px-1.5 py-0.5 text-[length:calc(var(--mu)*10)] leading-[1.2] font-semibold text-[#6366F1]">
                #{PICKUP.referral}
              </span>
            </span>
            <span className="ml-2 flex w-22.5 shrink-0 flex-col items-end">
              <span className="text-[length:calc(var(--mu)*10)] leading-[1.2] text-[#9E9E9E]">{PICKUP.vehicle}</span>
              <span className="mt-1 rounded-[calc(var(--mu)*5)] bg-[#1F2937] px-1.5 py-[calc(var(--mu)*3)] text-[length:calc(var(--mu)*11)] leading-[1.2] font-bold tracking-[0.03em] whitespace-nowrap text-white">
                {PICKUP.plate}
              </span>
            </span>
          </div>
          <div className="mt-2.5 flex items-center rounded-[calc(var(--mu)*10)] bg-[#10B981]/6 px-3 py-2">
            <Scales weight="fill" className="size-4.5 text-[#059669]" />
            <span className="ml-2 text-[length:calc(var(--mu)*13)] font-medium text-[#757575]">{t("ucoWeight")}</span>
            <span className="ml-auto text-[length:calc(var(--mu)*18)] leading-[1.2] font-extrabold text-[#059669]">
              {PICKUP.weight} {t("kg")}
            </span>
          </div>
        </div>

        <div className="mx-4 mt-2">
          <button
            ref={trackRef}
            type="button"
            onClick={onTrack}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] py-[calc(var(--mu)*13)] transition-[filter,transform] duration-150 active:scale-[0.98] active:brightness-95"
          >
            <MapTrifold weight="fill" className="size-4.5 text-white" />
            <span className="text-[length:calc(var(--mu)*14)] font-bold text-white">{t("trackTitle")}</span>
          </button>
        </div>

        <div className="mx-4 mt-2 flex gap-1.5 rounded-[calc(var(--mu)*14)] border border-[#E5E7EB] bg-[#F9FAFB] py-1.5">
          <ActionPill
            label={t("call")}
            Icon={Phone}
            weight="fill"
            tint="#10B981"
            ink="#059669"
            className="ml-1.5"
            onClick={onCall}
          />
          <ActionPill label={t("cancel")} Icon={X} weight="bold" tint="#EF4444" ink="#DC2626" />
          <ActionPill label={t("qr")} Icon={QrCode} weight="bold" tint="#3B82F6" ink="#2563EB" />
          <ActionPill
            label={t("remind")}
            Icon={BellRinging}
            weight="fill"
            tint="#F59E0B"
            ink="#D97706"
            className="mr-1.5"
            onClick={onRemind}
          />
        </div>
      </motion.div>
      <div className="h-3" />
    </div>
  );
}

/** Tinted action pill. Only the ones that do something in the demo are buttons. */
function ActionPill({
  label,
  Icon,
  weight,
  tint,
  ink,
  className = "",
  onClick,
}: {
  label: string;
  Icon: Icon;
  weight: "fill" | "bold";
  tint: string;
  ink: string;
  className?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="grid shrink-0 place-items-center rounded-full p-1" style={{ backgroundColor: `${tint}26` }}>
        <Icon weight={weight} className="size-3.5" style={{ color: ink }} />
      </span>
      <span className="ml-1 truncate text-[length:calc(var(--mu)*12)] font-semibold" style={{ color: ink }}>
        {label}
      </span>
    </>
  );
  const base = `flex min-w-0 flex-1 items-center justify-center rounded-[calc(var(--mu)*10)] px-1 py-3 ${className}`;
  const style = { backgroundColor: `${tint}14` };
  if (!onClick) {
    return (
      <div className={base} style={style}>
        {inner}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} transition-transform duration-150 active:scale-95`}
      style={style}
    >
      {inner}
    </button>
  );
}
