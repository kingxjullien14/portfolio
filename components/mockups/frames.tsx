import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowClockwise, LockSimple } from "@phosphor-icons/react/dist/ssr";

/** A phone in dark titanium. The screen inside supplies its own status bar. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone-wrap ${className}`}>
      <div className="phone">
        <div className="phone-screen">
          {children}
          <span className="phone-island" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/** A quiet browser window: traffic lights, history keys and an address pill. */
export function BrowserFrame({
  url,
  children,
  className = "",
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`browser ${className}`}>
      <div className="browser-bar" aria-hidden>
        <span className="flex items-center gap-[7px]">
          <span className="browser-dot bg-[#ff5f57]" />
          <span className="browser-dot bg-[#febc2e]" />
          <span className="browser-dot bg-[#28c840]" />
        </span>
        <span className="hidden items-center gap-3 text-[#8a8f8b] sm:flex">
          <ArrowLeft weight="bold" className="size-3.5" />
          <ArrowRight weight="bold" className="size-3.5 opacity-50" />
          <ArrowClockwise weight="bold" className="size-3.5" />
        </span>
        <span className="browser-url">
          <LockSimple weight="fill" className="size-3 shrink-0 opacity-60" />
          <span className="truncate">{url}</span>
        </span>
        <span className="hidden w-16 sm:block" />
      </div>
      <div className="browser-view">{children}</div>
    </div>
  );
}

/** A frameless desktop app window; the app draws its own title bar. */
export function WindowFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`appwin ${className}`}>{children}</div>;
}
