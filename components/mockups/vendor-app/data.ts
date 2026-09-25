// Synthetic demo data for the Vendor App mock. Every person, outlet, plate,
// chit number and amount is invented.

import type { StrKey } from "./i18n";

export const USER = {
  firstName: "ROSNAH",
  outlet: "RESTORAN SERI KENANGA",
  outletCode: "SGR-0142",
  balance: "1,284.50",
  currency: "MYR",
  lifetimeKg: "1,846.20",
  lastLogin: "25 September 2026 at 8:12 AM",
};

export const PICKUP = {
  date: "26 Sep 2026",
  weight: "25.00",
  collector: "Hafiz Rahman",
  initials: "HR",
  referral: "HR2291",
  plate: "WQK 4821",
  vehicle: "1-Tonne Lorry",
};

export type Status = "assigned" | "pending" | "verify" | "completed" | "rejected";

export type HistoryEntry = {
  id: string;
  month: string;
  chit: string;
  date: string;
  kg: string;
  rm: string;
  status: Status;
};

export const HISTORY: HistoryEntry[] = [
  { id: "h1", month: "September 2026", chit: "CH-260926-0187", date: "26 Sep 2026 @ 10:00 AM", kg: "25.00", rm: "81.25", status: "assigned" },
  { id: "h2", month: "September 2026", chit: "CH-260923-0544", date: "23 Sep 2026 @ 11:20 AM", kg: "18.50", rm: "60.13", status: "pending" },
  { id: "h3", month: "September 2026", chit: "CH-260918-0473", date: "18 Sep 2026 @ 3:42 PM", kg: "31.50", rm: "102.38", status: "verify" },
  { id: "h4", month: "September 2026", chit: "CH-260911-0328", date: "11 Sep 2026 @ 11:15 AM", kg: "28.00", rm: "91.00", status: "completed" },
  { id: "h5", month: "September 2026", chit: "CH-260904-0291", date: "4 Sep 2026 @ 9:48 AM", kg: "17.25", rm: "0.00", status: "rejected" },
  { id: "h6", month: "August 2026", chit: "CH-260828-0655", date: "28 Aug 2026 @ 2:20 PM", kg: "26.75", rm: "86.94", status: "completed" },
  { id: "h7", month: "August 2026", chit: "CH-260821-0412", date: "21 Aug 2026 @ 10:05 AM", kg: "30.00", rm: "97.50", status: "completed" },
];

/** Badge colours straight from collection_history_page.dart. */
export const STATUS_STYLE: Record<Status, { bg: string; fg: string; key: StrKey }> = {
  completed: { bg: "#D1FAE5", fg: "#047857", key: "statusCompleted" },
  verify: { bg: "#EF4444", fg: "#FFFFFF", key: "statusToVerify" },
  pending: { bg: "#FEF3C7", fg: "#92400E", key: "statusPending" },
  assigned: { bg: "#DBEAFE", fg: "#1E40AF", key: "statusAssigned" },
  rejected: { bg: "#FEE2E2", fg: "#991B1B", key: "statusRejected" },
};

export type HistoryFilter = "verify" | "completed" | "failed" | "rejected";

export const HISTORY_FILTERS: { id: HistoryFilter; key: StrKey }[] = [
  { id: "verify", key: "statusToVerify" },
  { id: "completed", key: "statusCompleted" },
  { id: "failed", key: "statusFailed" },
  { id: "rejected", key: "statusRejected" },
];

export type Notice = {
  id: string;
  title: string;
  body: string;
  ago: [StrKey, number];
  unread: boolean;
};

export const NOTIFICATIONS: Notice[] = [
  {
    id: "n1",
    title: "Collector assigned",
    body: "Hafiz Rahman (WQK 4821) will collect your UCO by 26 Sep 2026.",
    ago: ["hoursAgo", 2],
    unread: true,
  },
  {
    id: "n2",
    title: "Collection request received",
    body: "Your request for 25.00 KG is in. A collector will be assigned soon.",
    ago: ["daysAgo", 1],
    unread: true,
  },
  {
    id: "n3",
    title: "Please verify your collection",
    body: "31.50 KG was collected on 18 Sep 2026. Verify or reject it in History.",
    ago: ["daysAgo", 6],
    unread: true,
  },
  {
    id: "n4",
    title: "Payout credited",
    body: "RM 91.00 for Chit# CH-260911-0328 is now available to withdraw.",
    ago: ["weeksAgo", 1],
    unread: false,
  },
  {
    id: "n5",
    title: "Keep your outlet profile up to date",
    body: "Confirm your location and contact details for faster pickups.",
    ago: ["weeksAgo", 2],
    unread: false,
  },
  {
    id: "n6",
    title: "Collection rejected",
    body: "Chit# CH-260904-0291 was rejected. Our team will contact you shortly.",
    ago: ["weeksAgo", 3],
    unread: false,
  },
];

/** KG collected per month, Apr to Sep 2026 (September still in progress). */
export const MONTHLY_KG = [
  { month: "Apr", kg: 96.5 },
  { month: "May", kg: 112.25 },
  { month: "Jun", kg: 88.0 },
  { month: "Jul", kg: 121.75 },
  { month: "Aug", kg: 104.25 },
  { month: "Sep", kg: 78.0 },
];

export const REPORT = {
  year: "2026",
  yearKg: "879.25",
  avgKg: "27.48",
  pickupsThisMonth: "3",
};

export function formatKg(n: number): string {
  return n.toFixed(2);
}

/** collector_tracking: >= 1 km shows "1.2 km", below that whole metres. */
export function formatDistance(metres: number): string {
  return metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${Math.round(metres)} m`;
}
