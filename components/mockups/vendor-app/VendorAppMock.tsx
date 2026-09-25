"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { MockScreen } from "../MockScreen";
import { NOTIFICATIONS, PICKUP, type HistoryFilter } from "./data";
import { HistoryScreen } from "./HistoryScreen";
import { HomeScreen } from "./HomeScreen";
import { LANGS, tr, type Lang } from "./i18n";
import { NotificationsScreen, type NoticeFilter } from "./NotificationsScreen";
import { LanguageScreen, ProfileScreen } from "./ProfileScreen";
import { ReportScreen } from "./ReportScreen";
import { TrackScreen } from "./TrackScreen";
import { BottomNav, HomeIndicator, StatusBar, usePageVisible, type Tab } from "./ui";
import styles from "./vendor-app.module.css";

/**
 * The Vendor App (Flutter, for restaurants selling used cooking oil), recreated
 * as an interactive 390 x 844 phone screen. The host draws the bezel and island.
 */
export function VendorAppMock({ className }: { className?: string }) {
  return (
    <MockScreen w={390} h={844} label="Vendor App, interactive recreation" className={className}>
      <VendorApp />
    </MockScreen>
  );
}

type Overlay = "track" | "language" | null;
type Snack = { id: number; text: string; tone: "dark" | "teal"; ms: number };

const EASE = [0.2, 0.8, 0.2, 1] as const;

function VendorApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.2 });
  const pageVisible = usePageVisible();
  const reduce = useReducedMotion() ?? false;
  const live = inView && pageVisible;

  const [lang, setLang] = useState<Lang>(0);
  const [tab, setTab] = useState<Tab>("home");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [read, setRead] = useState<boolean[]>(() => NOTIFICATIONS.map((n) => !n.unread));
  const [noticeFilter, setNoticeFilter] = useState<NoticeFilter>("all");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter | null>(null);
  const [snack, setSnack] = useState<Snack | null>(null);
  const [announce, setAnnounce] = useState("");

  const trackRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLButtonElement>(null);
  const allNoticesRef = useRef<HTMLButtonElement>(null);
  const snackId = useRef(0);
  const popTimer = useRef<number | undefined>(undefined);
  const lastOverlay = useRef<Overlay>(null);

  const showSnack = useCallback((text: string, tone: Snack["tone"], ms: number) => {
    snackId.current += 1;
    setSnack({ id: snackId.current, text, tone, ms });
    setAnnounce(text);
  }, []);

  useEffect(() => {
    if (!snack) return;
    const id = window.setTimeout(() => setSnack(null), snack.ms);
    return () => window.clearTimeout(id);
  }, [snack]);

  useEffect(() => () => window.clearTimeout(popTimer.current), []);

  // Hand focus back to whatever opened a pushed screen once it closes.
  useEffect(() => {
    const was = lastOverlay.current;
    lastOverlay.current = overlay;
    if (overlay !== null || was === null) return;
    const target = was === "track" ? trackRef.current : languageRef.current;
    target?.focus({ preventScroll: true });
  }, [overlay]);

  const chooseLanguage = (next: Lang) => {
    setLang(next);
    showSnack(`${tr("languageChanged", next)} ${LANGS[next].name}`, "teal", 2200);
    window.clearTimeout(popTimer.current);
    // The app confirms, switches locale, then pops back to Profile.
    popTimer.current = window.setTimeout(() => setOverlay(null), reduce ? 0 : 280);
  };

  const markAllRead = () => {
    setRead(NOTIFICATIONS.map(() => true));
    allNoticesRef.current?.focus({ preventScroll: true });
  };

  const tabFade = reduce ? { duration: 0 } : { duration: 0.18, ease: EASE };
  const push = reduce ? { duration: 0 } : { duration: 0.24, ease: EASE };
  const light = overlay !== "track";

  return (
    <div ref={rootRef} lang={LANGS[lang].code} className={`absolute inset-0 font-ui leading-[1.2] text-[#111827] select-none ${styles.root}`}>
      {/* Tab shell: the active tab screen plus the bottom bar */}
      <div className="absolute inset-0" inert={overlay !== null}>
        <div className="absolute inset-x-0 top-0 bottom-23.5">
          <AnimatePresence initial={false}>
            <motion.div
              key={tab}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={tabFade}
            >
              {tab === "home" ? (
                <HomeScreen
                  lang={lang}
                  sheetOpen={sheetOpen}
                  onToggleSheet={() => setSheetOpen((o) => !o)}
                  onTrack={() => {
                    setSnack(null);
                    setOverlay("track");
                  }}
                  trackRef={trackRef}
                  onCall={() => showSnack(tr("calling", lang, PICKUP.collector), "dark", 2600)}
                  onRemind={() => showSnack(tr("reminderSent", lang), "dark", 2600)}
                  reduce={reduce}
                />
              ) : tab === "history" ? (
                <HistoryScreen lang={lang} filter={historyFilter} onFilter={setHistoryFilter} />
              ) : tab === "report" ? (
                <ReportScreen lang={lang} />
              ) : tab === "notifications" ? (
                <NotificationsScreen
                  lang={lang}
                  read={read}
                  filter={noticeFilter}
                  onFilter={setNoticeFilter}
                  onMarkAll={markAllRead}
                  allRef={allNoticesRef}
                />
              ) : (
                <ProfileScreen lang={lang} onLanguage={() => setOverlay("language")} languageRef={languageRef} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <BottomNav lang={lang} current={tab} onSelect={setTab} reduce={reduce} />
      </div>

      {/* Pushed routes cover the whole shell, bottom bar included */}
      <AnimatePresence initial={false}>
        {overlay ? (
          <motion.div
            key={overlay}
            className="absolute inset-0 z-20"
            initial={{ opacity: 0, x: "7%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "7%" }}
            transition={push}
          >
            {overlay === "track" ? (
              <TrackScreen lang={lang} live={live} reduce={reduce} onBack={() => setOverlay(null)} />
            ) : (
              <LanguageScreen lang={lang} onBack={() => setOverlay(null)} onChoose={chooseLanguage} />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Floating snackbar, above the bottom bar like the app's SnackBarBehavior.floating */}
      <AnimatePresence>
        {snack ? (
          <motion.div
            key={snack.id}
            aria-hidden
            className={`pointer-events-none absolute inset-x-[calc(var(--mu)*15)] bottom-26 z-30 rounded-lg px-4 py-3.5 text-[length:calc(var(--mu)*14)] leading-[1.3] text-white shadow-[0_calc(var(--mu)*3)_calc(var(--mu)*10)_rgba(0,0,0,0.25)] ${
              snack.tone === "teal" ? "bg-[#2B7070]" : "bg-[#1F2937]"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: EASE }}
          >
            {snack.text}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div aria-live="polite" className="sr-only">
        {announce}
      </div>

      <StatusBar tone={light ? "light" : "dark"} />
      <HomeIndicator tone={light ? "light" : "dark"} />
    </div>
  );
}
