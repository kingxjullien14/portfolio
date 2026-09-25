"use client";

import { Bell, CaretRight } from "@phosphor-icons/react";
import type { Ref } from "react";
import { NOTIFICATIONS } from "./data";
import { tr, type Lang, type StrKey } from "./i18n";

export type NoticeFilter = "all" | "unread" | "read";

export function NotificationsScreen({
  lang,
  read,
  filter,
  onFilter,
  onMarkAll,
  allRef,
}: {
  lang: Lang;
  read: boolean[];
  filter: NoticeFilter;
  onFilter: (f: NoticeFilter) => void;
  onMarkAll: () => void;
  allRef: Ref<HTMLButtonElement>;
}) {
  const t = (key: StrKey, arg?: string | number) => tr(key, lang, arg);
  const unread = read.filter((r) => !r).length;
  const counts: Record<NoticeFilter, number> = {
    all: NOTIFICATIONS.length,
    unread,
    read: NOTIFICATIONS.length - unread,
  };
  const items = NOTIFICATIONS.map((n, i) => ({ ...n, isRead: read[i] })).filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.isRead : n.isRead,
  );
  const tabs: { id: NoticeFilter; key: StrKey }[] = [
    { id: "all", key: "filterAll" },
    { id: "unread", key: "filterUnread" },
    { id: "read", key: "filterRead" },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0D1F2D]">
      <div className="h-13.5 shrink-0" />
      <div className="shrink-0 p-5">
        <div className="flex h-11 items-center justify-between gap-2">
          <div className="min-w-0 truncate text-[length:calc(var(--mu)*24)] leading-[1.2] font-bold text-white">{t("notificationsTitle")}</div>
          {unread > 0 ? (
            <button
              type="button"
              onClick={onMarkAll}
              className={`shrink-0 rounded-full px-4 py-2.5 text-right text-[length:calc(var(--mu)*14)] leading-[1.2] font-semibold text-[#00B4FF] transition-colors duration-150 hover:bg-[#00B4FF]/10`}
            >
              {t("markAllRead")}
            </button>
          ) : null}
        </div>
        <div className="mt-4 flex gap-2">
          {tabs.map(({ id, key }) => {
            const selected = filter === id;
            const count = counts[id];
            return (
              <button
                key={id}
                ref={id === "all" ? allRef : undefined}
                type="button"
                aria-pressed={selected}
                onClick={() => onFilter(id)}
                className={`flex items-center rounded-[calc(var(--mu)*20)] px-4 py-2 transition-colors duration-150 ${
                  selected ? "bg-white" : "bg-white/10"
                }`}
              >
                <span className={`text-[length:calc(var(--mu)*14)] leading-[1.2] ${selected ? "font-semibold text-[#0D1F2D]" : "text-white"}`}>
                  {t(key)}
                </span>
                {count > 0 ? (
                  <span
                    className={`ml-1.5 rounded-[calc(var(--mu)*10)] px-1.5 py-0.5 text-[length:calc(var(--mu)*11)] leading-[1.2] font-semibold tabular-nums ${
                      selected ? "bg-[#0D1F2D]/20 text-[#0D1F2D]" : "bg-white/20 text-white"
                    }`}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div data-lenis-prevent="" className="min-h-0 flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pb-10">
            <Bell className="size-16 text-white/50" />
            <div className="mt-4 text-[length:calc(var(--mu)*16)] text-white/70">{t("notificationsEmpty")}</div>
          </div>
        ) : (
          <>
            {items.map((n) => (
              <div
                key={n.id}
                className={`mb-3 flex items-center rounded-xl border p-4 transition-colors duration-300 motion-reduce:transition-none ${
                  n.isRead ? "border-transparent bg-white/5" : "border-[#00B4FF]/30 bg-white/15"
                }`}
              >
                {!n.isRead ? <span className="mr-3 size-2 shrink-0 rounded-full bg-[#00B4FF]" /> : null}
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-[length:calc(var(--mu)*14)] text-white ${n.isRead ? "font-normal" : "font-semibold"}`}>{n.title}</div>
                  <div className="mt-0.5 truncate text-[length:calc(var(--mu)*13)] text-white/70">{n.body}</div>
                  <div className="mt-1 text-[length:calc(var(--mu)*12)] text-white/60">{t(n.ago[0], n.ago[1])}</div>
                </div>
                <CaretRight className="ml-2 size-5 shrink-0 text-white/30" />
              </div>
            ))}
            <div className="py-6 text-center text-[length:calc(var(--mu)*12)] text-white/50 italic">{t("notificationsEnd")}</div>
          </>
        )}
      </div>
    </div>
  );
}
