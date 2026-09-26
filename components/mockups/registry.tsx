import type { ReactNode } from "react";
import type { UnitId } from "@/lib/data";
import { BrowserFrame, PhoneFrame, WindowFrame } from "./frames";
import { LazyScreen } from "./LazyScreen";

/** Which recreated screen sits in which bay, already mounted in its frame. */
export const screens: Record<UnitId, ReactNode> = {
  "vendor-app": (
    <PhoneFrame className="w-full max-w-[340px]">
      <LazyScreen id="vendor-app" name="Vendor App" />
    </PhoneFrame>
  ),
  "trading-portal": (
    <BrowserFrame url="tradingpanel.demo/purchase-contracts">
      <LazyScreen id="trading-portal" name="Trading Portal" />
    </BrowserFrame>
  ),
  "vendor-portal": (
    <BrowserFrame url="vendorportal.demo/dashboard">
      <LazyScreen id="vendor-portal" name="Vendor Portal" />
    </BrowserFrame>
  ),
  "wws-dashboards": (
    <BrowserFrame url="wws.demo/weekly-collection">
      <LazyScreen id="wws-dashboards" name="WWS Dashboards" />
    </BrowserFrame>
  ),
  "api-platform": (
    <BrowserFrame url="api.demo/graphql">
      <LazyScreen id="api-platform" name="API Platform" />
    </BrowserFrame>
  ),
  osai: (
    <WindowFrame>
      <LazyScreen id="osai" name="OSAI" />
    </WindowFrame>
  ),
  "stone-chisel": (
    <BrowserFrame url="stonenchisel.com/notes/carving-a-calm-editor">
      <LazyScreen id="stone-chisel" name="Stone & Chisel" />
    </BrowserFrame>
  ),
};
