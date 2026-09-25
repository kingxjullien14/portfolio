import type { ReactNode } from "react";
import type { UnitId } from "@/lib/data";
import { BrowserFrame, PhoneFrame, WindowFrame } from "./frames";
import { VendorAppMock } from "./vendor-app/VendorAppMock";
import { TradingPortalMock } from "./trading-portal/TradingPortalMock";
import { VendorPortalMock } from "./vendor-portal/VendorPortalMock";
import { WwsDashboardsMock } from "./wws-dashboards/WwsDashboardsMock";
import { ApiPlatformMock } from "./api-platform/ApiPlatformMock";
import { OsaiMock } from "./osai/OsaiMock";
import { StoneChiselMock } from "./stone-chisel/StoneChiselMock";

/** Which recreated screen sits in which bay, already mounted in its frame. */
export const screens: Record<UnitId, ReactNode> = {
  "vendor-app": (
    <PhoneFrame className="w-full max-w-[340px]">
      <VendorAppMock />
    </PhoneFrame>
  ),
  "trading-portal": (
    <BrowserFrame url="tradingpanel.demo/purchase-contracts">
      <TradingPortalMock />
    </BrowserFrame>
  ),
  "vendor-portal": (
    <BrowserFrame url="vendorportal.demo/dashboard">
      <VendorPortalMock />
    </BrowserFrame>
  ),
  "wws-dashboards": (
    <BrowserFrame url="wws.demo/weekly-collection">
      <WwsDashboardsMock />
    </BrowserFrame>
  ),
  "api-platform": (
    <BrowserFrame url="api.demo/graphql">
      <ApiPlatformMock />
    </BrowserFrame>
  ),
  osai: (
    <WindowFrame>
      <OsaiMock />
    </WindowFrame>
  ),
  "stone-chisel": (
    <BrowserFrame url="stonenchisel.com/notes/carving-a-calm-editor">
      <StoneChiselMock />
    </BrowserFrame>
  ),
};
