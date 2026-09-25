"use client";

import { CaretLeft, CaretRight, Check, Globe, Info, SignOut, User } from "@phosphor-icons/react";
import { useEffect, useRef, type Ref } from "react";
import { USER } from "./data";
import { LANGS, tr, type Lang, type StrKey } from "./i18n";
import styles from "./vendor-app.module.css";

const MENU: StrKey[] = [
  "menuUpdateProfile",
  "menuDigitalPayout",
  "menuChangePassword",
  "menuScc",
  "menuTerms",
  "menuPrivacy",
  "menuHelp",
  "menuChat",
  "menuLanguage",
  "menuDelete",
];

export function ProfileScreen({
  lang,
  onLanguage,
  languageRef,
}: {
  lang: Lang;
  onLanguage: () => void;
  languageRef: Ref<HTMLButtonElement>;
}) {
  const t = (key: StrKey, arg?: string | number) => tr(key, lang, arg);
  const row = "flex w-full items-center justify-between border-b-[0.5px] border-white/5 px-5 py-4 text-left";

  return (
    <div data-lenis-prevent="" className="absolute inset-0 overflow-y-auto bg-[#0D1F2D]">
      <div className="h-13.5" />
      <div className="flex items-center px-5 pt-4">
        <span className="grid size-13 shrink-0 place-items-center rounded-full border-[1.5px] border-white/20 bg-white/10">
          <User className="size-7 text-white/70" />
        </span>
        <div className="ml-3.5 min-w-0 flex-1">
          <div className="text-[length:calc(var(--mu)*15)] leading-[1.3] font-bold tracking-[0.02em] text-white">{USER.outlet}</div>
          <div className="mt-[calc(var(--mu)*3)] text-[length:calc(var(--mu)*10)] leading-[1.2] text-white/45 italic">
            {t("lastLoginOn", USER.lastLogin)}
          </div>
        </div>
      </div>

      <div className="mt-5 pb-8">
        {MENU.map((key) =>
          key === "menuLanguage" ? (
            <button
              key={key}
              ref={languageRef}
              type="button"
              onClick={onLanguage}
              className={`${row} transition-colors duration-150 hover:bg-white/[0.04] ${styles.inset}`}
            >
              <span className="text-[length:calc(var(--mu)*14)] leading-[1.2] font-medium text-white">{t(key)}</span>
              <CaretRight className="size-5 shrink-0 text-white/50" />
            </button>
          ) : (
            <div key={key} className={row}>
              <span className="text-[length:calc(var(--mu)*14)] leading-[1.2] font-medium text-white">{t(key)}</span>
              <CaretRight className="size-5 shrink-0 text-white/50" />
            </div>
          ),
        )}
        <div className={row}>
          <span className="text-[length:calc(var(--mu)*14)] leading-[1.2] font-semibold text-[#FF5252]">{t("menuLogout")}</span>
          <SignOut className="size-5 shrink-0 text-[#FF5252]" />
        </div>
      </div>
    </div>
  );
}

/** change_language_page.dart, with two-letter code tiles in place of flag emoji. */
export function LanguageScreen({
  lang,
  onBack,
  onChoose,
}: {
  lang: Lang;
  onBack: () => void;
  onChoose: (lang: Lang) => void;
}) {
  const t = (key: StrKey) => tr(key, lang);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0D1F2D]">
      <div className="h-13.5 shrink-0" />
      <div className="relative flex h-14 shrink-0 items-center">
        <button
          ref={backRef}
          type="button"
          aria-label="Back"
          onClick={onBack}
          className={`ml-1 grid size-12 place-items-center rounded-full`}
        >
          <CaretLeft weight="bold" className="size-5 text-white" />
        </button>
        <div className="pointer-events-none absolute inset-x-16 truncate text-center text-[length:calc(var(--mu)*16)] font-semibold text-white">
          {t("changeLanguage")}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center px-5 pt-4">
        <span className="grid size-16 place-items-center rounded-full bg-[#2B7070]/20">
          <Globe className="size-8 text-[#3A9090]" />
        </span>
        <div className="mt-3 text-center text-[length:calc(var(--mu)*13)] text-white/70">{t("selectLanguage")}</div>
      </div>

      <div data-lenis-prevent="" className="mt-6 min-h-0 flex-1 overflow-y-auto" role="group" aria-label={t("changeLanguage")}>
        {LANGS.map((l, i) => {
          const selected = i === lang;
          return (
            <div key={l.code}>
              {i > 0 ? <div className="mx-5 h-px bg-white/5" /> : null}
              <button
                type="button"
                lang={l.code}
                aria-current={selected ? "true" : undefined}
                onClick={() => onChoose(i)}
                className={`group flex w-full items-center px-5 py-3 text-left ${styles.inset} ${selected ? "bg-[#2B7070]/10" : ""}`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-lg text-[length:calc(var(--mu)*13)] font-bold tracking-[0.06em] ${
                    selected
                      ? "bg-[#2B7070]/35 text-[#8FE0D6]"
                      : "bg-white/5 text-white/75 transition-colors duration-150 group-hover:bg-white/10 group-hover:text-white"
                  }`}
                >
                  {l.badge}
                </span>
                <span className="ml-3.5 min-w-0 flex-1">
                  <span lang="en" className={`block text-[length:calc(var(--mu)*14)] leading-[1.2] text-white ${selected ? "font-semibold" : "font-medium"}`}>
                    {l.name}
                  </span>
                  <span className="mt-0.5 block text-[length:calc(var(--mu)*12)] leading-[1.25] text-white/50">{l.native}</span>
                </span>
                {selected ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#2B7070]">
                    <Check weight="bold" className="size-4 text-white" />
                  </span>
                ) : (
                  <span className="size-6 shrink-0 rounded-full border-[1.5px] border-white/20 transition-colors duration-150 group-hover:border-white/45" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mx-5 mt-4 mb-[calc(var(--mu)*42)] flex shrink-0 items-start gap-2 rounded-lg border border-[#2B7070]/30 bg-[#2B7070]/15 p-3">
        <Info className="size-4.5 shrink-0 text-[#3A9090]" />
        <div className="text-[length:calc(var(--mu)*11)] leading-[1.4] text-white/80">{t("languageNote")}</div>
      </div>
    </div>
  );
}
