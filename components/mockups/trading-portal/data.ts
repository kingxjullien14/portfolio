/**
 * Synthetic data for the Trading Panel recreation. Every company, person,
 * price and reference here is invented. Timestamps are fixed strings so the
 * screen renders identically on the server and the client.
 */

export type Status =
  | "Draft"
  | "Pending Director"
  | "Pending Confirmation"
  | "To Reply"
  | "Accepted"
  | "To Sign"
  | "Rejected"
  | "Expired"
  | "Fully Executed";

export type Tone = "neutral" | "success" | "info" | "warning" | "danger" | "teal";

export const STATUS_TONE: Record<Status, Tone> = {
  Draft: "neutral",
  "Pending Director": "warning",
  "Pending Confirmation": "info",
  "To Reply": "warning",
  Accepted: "success",
  "To Sign": "teal",
  Rejected: "danger",
  Expired: "neutral",
  "Fully Executed": "success",
};

/** Whose move it is, from the viewer's seat (the buying desk). */
export type Awaiting = "you" | "supplier" | "director";

export type Product = "ISCC-UCO" | "Non-ISCC UCO" | "POME";

export type EventKind =
  | "initiated"
  | "counter"
  | "accepted"
  | "rejected"
  | "routed"
  | "sent_to_ceo"
  | "signed_seller"
  | "signed_buyer";

export interface ThreadEvent {
  id: string;
  kind: EventKind;
  side: "buyer" | "seller";
  label: string;
  actor: string;
  at: string;
  internal?: boolean;
  volumeMt?: number;
  priceUsd?: number;
  prevPriceUsd?: number;
  window?: string;
  prevWindow?: string;
  remarks?: string;
}

export interface Contract {
  ref: string;
  type: "Request" | "Offer";
  counterparty: string;
  contact: string;
  product: Product;
  volumeMt: number;
  priceUsd: number;
  /** The agreed figure a live counter-offer would replace. */
  wasPriceUsd?: number;
  status: Status;
  awaiting?: Awaiting;
  contractDate: string;
  updated: string;
  port: string;
  paymentTerms: string;
  window: { label: string; iso: string };
  generalRemarks: boolean;
  /** Short date for the stage pill ("Rejected on ..."). */
  stageDate?: string;
  /** Supplier signature date, when they have signed. */
  supplierSignedOn?: string;
  /** A signature that already exists before the visitor arrives. */
  presigned?: { signer: string; signedAtIso: string; signedOn: string };
  thread: ThreadEvent[];
}

export const VIEWER = { name: "Aisyah Rahman", initials: "AR", role: "Trade Manager" };
export const BUYER = "Teratai Bioenergy Sdn Bhd";
export const SIGNER_CAPTION = `Authorized Signatory · ${BUYER}`;

export const CONTRACTS: Contract[] = [
  {
    ref: "PRQ-TP-00142",
    type: "Request",
    counterparty: "Seri Tanjung Oleo Sdn Bhd",
    contact: "Hafiz Ismail",
    product: "ISCC-UCO",
    volumeMt: 500,
    priceUsd: 1012.5,
    status: "To Sign",
    awaiting: "you",
    contractDate: "18 Sep 2026",
    updated: "12 min ago",
    port: "Port Klang",
    paymentTerms: "100% Letter of Credit",
    window: { label: "Oct 12 to Oct 26, 2026", iso: "2026-10-12/2026-10-26" },
    generalRemarks: true,
    supplierSignedOn: "25 Sep 2026",
    thread: [
      {
        id: "a1",
        kind: "initiated",
        side: "buyer",
        label: "Initiated Purchase Request",
        actor: VIEWER.name,
        at: "18 Sep 2026 @ 10:12 AM",
        volumeMt: 500,
        priceUsd: 985,
        window: "Oct 5 to Oct 19, 2026",
      },
      {
        id: "a2",
        kind: "counter",
        side: "seller",
        label: "Re-negotiated (Supplier)",
        actor: "Hafiz Ismail",
        at: "19 Sep 2026 @ 3:41 PM",
        volumeMt: 500,
        priceUsd: 1040,
        prevPriceUsd: 985,
        window: "Oct 12 to Oct 26, 2026",
        prevWindow: "Oct 5 to Oct 19",
        remarks: "Klang depot is backlogged until 10 Oct. Earliest loading is 12 Oct.",
      },
      {
        id: "a3",
        kind: "counter",
        side: "buyer",
        label: "Re-negotiated (Buyer)",
        actor: VIEWER.name,
        at: "22 Sep 2026 @ 9:05 AM",
        volumeMt: 500,
        priceUsd: 1012.5,
        prevPriceUsd: 1040,
        remarks: "The later window works for us. Meeting you at 1,012.50.",
      },
      {
        id: "a4",
        kind: "accepted",
        side: "seller",
        label: "Accepted (Supplier)",
        actor: "Hafiz Ismail",
        at: "23 Sep 2026 @ 11:20 AM",
        volumeMt: 500,
        priceUsd: 1012.5,
      },
      {
        id: "a5",
        kind: "sent_to_ceo",
        side: "buyer",
        label: "Sent to CEO for Signing",
        actor: VIEWER.name,
        at: "24 Sep 2026 @ 9:30 AM",
      },
      {
        id: "a6",
        kind: "signed_seller",
        side: "seller",
        label: "Signed by Supplier",
        actor: "Hafiz Ismail",
        at: "25 Sep 2026 @ 9:48 AM",
      },
    ],
  },
  {
    ref: "PRQ-TP-00139",
    type: "Request",
    counterparty: "Merbau Biofuels Sdn Bhd",
    contact: "Lim Wei Jie",
    product: "Non-ISCC UCO",
    volumeMt: 1200,
    priceUsd: 942,
    wasPriceUsd: 915,
    status: "To Reply",
    awaiting: "you",
    contractDate: "16 Sep 2026",
    updated: "1 hr ago",
    port: "Pasir Gudang",
    paymentTerms: "30% TT, 70% LC",
    window: { label: "Oct 1 to Oct 30, 2026", iso: "2026-10-01/2026-10-30" },
    generalRemarks: true,
    thread: [
      {
        id: "b1",
        kind: "initiated",
        side: "buyer",
        label: "Initiated Purchase Request",
        actor: VIEWER.name,
        at: "16 Sep 2026 @ 11:05 AM",
        volumeMt: 1200,
        priceUsd: 915,
        window: "Oct 1 to Oct 30, 2026",
      },
      {
        id: "b2",
        kind: "counter",
        side: "seller",
        label: "Re-negotiated (Supplier)",
        actor: "Lim Wei Jie",
        at: "25 Sep 2026 @ 8:57 AM",
        volumeMt: 1200,
        priceUsd: 942,
        prevPriceUsd: 915,
        remarks: "Collection costs rose this month. 942.00 holds until Friday.",
      },
    ],
  },
  {
    ref: "POF-TP-00088",
    type: "Offer",
    counterparty: "Anggerik Feedstock Trading",
    contact: "Nurul Huda",
    product: "Non-ISCC UCO",
    volumeMt: 300,
    priceUsd: 905,
    status: "Pending Confirmation",
    awaiting: "you",
    contractDate: "25 Sep 2026",
    updated: "3 hr ago",
    port: "Penang",
    paymentTerms: "TT within 7 days of B/L",
    window: { label: "Oct 1 to Oct 14, 2026", iso: "2026-10-01/2026-10-14" },
    generalRemarks: false,
    thread: [
      {
        id: "c1",
        kind: "initiated",
        side: "seller",
        label: "Initiated Purchase Offer",
        actor: "Nurul Huda",
        at: "25 Sep 2026 @ 7:02 AM",
        volumeMt: 300,
        priceUsd: 905,
        window: "Oct 1 to Oct 14, 2026",
        remarks: "Fresh collection from Penang food courts. Moisture tested at 0.6%.",
      },
    ],
  },
  {
    ref: "POF-TP-00087",
    type: "Offer",
    counterparty: "Straits Lipid Supply Pte Ltd",
    contact: "Daniel Tan",
    product: "ISCC-UCO",
    volumeMt: 750,
    priceUsd: 1005,
    wasPriceUsd: 1030,
    status: "To Reply",
    awaiting: "supplier",
    contractDate: "22 Sep 2026",
    updated: "15 hr ago",
    port: "Singapore",
    paymentTerms: "100% Letter of Credit",
    window: { label: "Oct 15 to Oct 29, 2026", iso: "2026-10-15/2026-10-29" },
    generalRemarks: true,
    thread: [
      {
        id: "d1",
        kind: "initiated",
        side: "seller",
        label: "Initiated Purchase Offer",
        actor: "Daniel Tan",
        at: "22 Sep 2026 @ 4:15 PM",
        volumeMt: 750,
        priceUsd: 1030,
        window: "Oct 15 to Oct 29, 2026",
      },
      {
        id: "d2",
        kind: "counter",
        side: "buyer",
        label: "Re-negotiated (Buyer)",
        actor: VIEWER.name,
        at: "24 Sep 2026 @ 6:40 PM",
        volumeMt: 750,
        priceUsd: 1005,
        prevPriceUsd: 1030,
        remarks: "Same window. 1,005.00 reflects this week's ISCC spread.",
      },
    ],
  },
  {
    ref: "PRQ-TP-00140",
    type: "Request",
    counterparty: "Kuala Serai Renewables",
    contact: "Siti Aminah",
    product: "POME",
    volumeMt: 2000,
    priceUsd: 690,
    status: "Pending Director",
    awaiting: "director",
    contractDate: "24 Sep 2026",
    updated: "Yesterday",
    port: "Kuantan",
    paymentTerms: "30% TT, 70% LC",
    window: { label: "Oct 10 to Nov 9, 2026", iso: "2026-10-10/2026-11-09" },
    generalRemarks: true,
    thread: [
      {
        id: "e1",
        kind: "routed",
        side: "buyer",
        label: "Forwarded to Director",
        actor: VIEWER.name,
        at: "24 Sep 2026 @ 8:15 AM",
        internal: true,
        volumeMt: 2000,
        priceUsd: 690,
        remarks: "Above this cycle's POME price limit. Needs approval before it goes out.",
      },
    ],
  },
  {
    ref: "POF-TP-00085",
    type: "Offer",
    counterparty: "Cendana Green Oils Sdn Bhd",
    contact: "Arif Zulkifli",
    product: "ISCC-UCO",
    volumeMt: 800,
    priceUsd: 1021,
    status: "Accepted",
    contractDate: "15 Sep 2026",
    updated: "2 days ago",
    port: "Port Klang",
    paymentTerms: "100% Letter of Credit",
    window: { label: "Oct 3 to Nov 2, 2026", iso: "2026-10-03/2026-11-02" },
    generalRemarks: true,
    thread: [
      {
        id: "f1",
        kind: "initiated",
        side: "seller",
        label: "Initiated Purchase Offer",
        actor: "Arif Zulkifli",
        at: "15 Sep 2026 @ 10:48 AM",
        volumeMt: 800,
        priceUsd: 1045,
        window: "Oct 3 to Nov 2, 2026",
      },
      {
        id: "f2",
        kind: "counter",
        side: "buyer",
        label: "Re-negotiated (Buyer)",
        actor: VIEWER.name,
        at: "18 Sep 2026 @ 3:22 PM",
        volumeMt: 800,
        priceUsd: 1021,
        prevPriceUsd: 1045,
        remarks: "We can close at 1,021.00 on the same window.",
      },
      {
        id: "f3",
        kind: "accepted",
        side: "seller",
        label: "Accepted (Supplier)",
        actor: "Arif Zulkifli",
        at: "23 Sep 2026 @ 2:10 PM",
        volumeMt: 800,
        priceUsd: 1021,
      },
    ],
  },
  {
    ref: "PRQ-TP-00137",
    type: "Request",
    counterparty: "Tasik Biru Oleochem Sdn Bhd",
    contact: "Kavitha Raman",
    product: "POME",
    volumeMt: 1500,
    priceUsd: 702.5,
    status: "Fully Executed",
    contractDate: "08 Sep 2026",
    updated: "4 days ago",
    port: "Kuantan",
    paymentTerms: "30% TT, 70% LC",
    window: { label: "Sep 20 to Oct 19, 2026", iso: "2026-09-20/2026-10-19" },
    generalRemarks: true,
    supplierSignedOn: "18 Sep 2026",
    presigned: {
      signer: "Farid Hamzah",
      signedAtIso: "2026-09-21T06:14:09.000Z",
      signedOn: "21 Sep 2026",
    },
    thread: [
      {
        id: "g1",
        kind: "initiated",
        side: "buyer",
        label: "Initiated Purchase Request",
        actor: VIEWER.name,
        at: "8 Sep 2026 @ 9:40 AM",
        volumeMt: 1500,
        priceUsd: 680,
        window: "Sep 20 to Oct 19, 2026",
      },
      {
        id: "g2",
        kind: "counter",
        side: "seller",
        label: "Re-negotiated (Supplier)",
        actor: "Kavitha Raman",
        at: "10 Sep 2026 @ 12:05 PM",
        volumeMt: 1500,
        priceUsd: 715,
        prevPriceUsd: 680,
        remarks: "Mill output is down after the rains. 715.00 is firm for this parcel.",
      },
      {
        id: "g3",
        kind: "counter",
        side: "buyer",
        label: "Re-negotiated (Buyer)",
        actor: VIEWER.name,
        at: "12 Sep 2026 @ 10:30 AM",
        volumeMt: 1500,
        priceUsd: 702.5,
        prevPriceUsd: 715,
      },
      {
        id: "g4",
        kind: "accepted",
        side: "seller",
        label: "Accepted (Supplier)",
        actor: "Kavitha Raman",
        at: "15 Sep 2026 @ 4:44 PM",
        volumeMt: 1500,
        priceUsd: 702.5,
      },
      {
        id: "g5",
        kind: "sent_to_ceo",
        side: "buyer",
        label: "Sent to CEO for Signing",
        actor: VIEWER.name,
        at: "16 Sep 2026 @ 9:10 AM",
      },
      {
        id: "g6",
        kind: "signed_seller",
        side: "seller",
        label: "Signed by Supplier",
        actor: "Kavitha Raman",
        at: "18 Sep 2026 @ 11:26 AM",
      },
      {
        id: "g7",
        kind: "signed_buyer",
        side: "buyer",
        label: "Signed by Buyer",
        actor: "Farid Hamzah",
        at: "21 Sep 2026 @ 2:14 PM",
      },
    ],
  },
  {
    ref: "PRQ-TP-00136",
    type: "Request",
    counterparty: "Pelangi Oil Recovery Sdn Bhd",
    contact: "Rahim Osman",
    product: "Non-ISCC UCO",
    volumeMt: 450,
    priceUsd: 890,
    status: "Rejected",
    contractDate: "05 Sep 2026",
    updated: "6 days ago",
    port: "Penang",
    paymentTerms: "TT within 7 days of B/L",
    window: { label: "Sep 12 to Sep 25, 2026", iso: "2026-09-12/2026-09-25" },
    generalRemarks: true,
    stageDate: "19 Sep 2026",
    thread: [
      {
        id: "h1",
        kind: "initiated",
        side: "buyer",
        label: "Initiated Purchase Request",
        actor: VIEWER.name,
        at: "5 Sep 2026 @ 3:00 PM",
        volumeMt: 450,
        priceUsd: 890,
        window: "Sep 12 to Sep 25, 2026",
      },
      {
        id: "h2",
        kind: "counter",
        side: "seller",
        label: "Re-negotiated (Supplier)",
        actor: "Rahim Osman",
        at: "9 Sep 2026 @ 10:15 AM",
        volumeMt: 450,
        priceUsd: 955,
        prevPriceUsd: 890,
        remarks: "Buyers in Johor are paying above 950 this month.",
      },
      {
        id: "h3",
        kind: "rejected",
        side: "buyer",
        label: "Rejected",
        actor: VIEWER.name,
        at: "19 Sep 2026 @ 11:40 AM",
        remarks: "955.00 is well above our ceiling for this grade.",
      },
    ],
  },
  {
    ref: "POF-TP-00083",
    type: "Offer",
    counterparty: "Nusa Palma Feedstock Sdn Bhd",
    contact: "Farah Idris",
    product: "ISCC-UCO",
    volumeMt: 400,
    priceUsd: 1048,
    status: "Expired",
    contractDate: "02 Sep 2026",
    updated: "05 Sep 2026",
    port: "Port Klang",
    paymentTerms: "100% Letter of Credit",
    window: { label: "Sep 9 to Sep 22, 2026", iso: "2026-09-09/2026-09-22" },
    generalRemarks: false,
    stageDate: "5 Sep 2026",
    thread: [
      {
        id: "i1",
        kind: "initiated",
        side: "seller",
        label: "Initiated Purchase Offer",
        actor: "Farah Idris",
        at: "2 Sep 2026 @ 9:20 AM",
        volumeMt: 400,
        priceUsd: 1048,
        window: "Sep 9 to Sep 22, 2026",
        remarks: "Offer valid for 72 hours.",
      },
    ],
  },
];

/** Quality limits per product, as printed on the contract. */
export const QUALITY: Record<Product, { param: string; spec: string }[]> = {
  "ISCC-UCO": [
    { param: "FFA", spec: "max 5%" },
    { param: "M&I", spec: "max 1%" },
    { param: "Sulphur", spec: "max 30 ppm" },
    { param: "Iodine Value", spec: "80 to 110" },
  ],
  "Non-ISCC UCO": [
    { param: "FFA", spec: "max 5%" },
    { param: "M&I", spec: "max 1%" },
    { param: "Sulphur", spec: "max 30 ppm" },
    { param: "Iodine Value", spec: "80 to 110" },
  ],
  POME: [
    { param: "FFA", spec: "max 20%" },
    { param: "M&I", spec: "max 2%" },
    { param: "Sulphur", spec: "max 30 ppm" },
    { param: "Iodine Value", spec: "50 to 60" },
  ],
};

export type SegmentKey = "all" | "action" | "negotiating" | "sign" | "executed";

export const SEGMENTS: { key: SegmentKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "action", label: "Needs action" },
  { key: "negotiating", label: "Negotiating" },
  { key: "sign", label: "To sign" },
  { key: "executed", label: "Executed" },
];

export function inSegment(c: Contract, key: SegmentKey): boolean {
  switch (key) {
    case "all":
      return true;
    case "action":
      return c.awaiting === "you";
    case "negotiating":
      return (
        c.status === "Pending Director" ||
        c.status === "Pending Confirmation" ||
        c.status === "To Reply"
      );
    case "sign":
      return c.status === "To Sign" || c.status === "Accepted";
    case "executed":
      return c.status === "Fully Executed";
  }
}

/* ─── Formatting (locale-free, so server and client agree) ─────────────── */

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function group3(int: string): string {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function fmtMoney(n: number): string {
  const [i, f] = n.toFixed(2).split(".");
  return `${group3(i)}.${f}`;
}

export function fmtUsd(n: number): string {
  return `USD ${fmtMoney(n)}`;
}

export function fmtInt(n: number): string {
  return group3(String(Math.round(n)));
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Calendar parts in local time, or in a fixed UTC offset (minutes). */
function parts(d: Date, offsetMin?: number) {
  if (offsetMin === undefined) {
    return {
      day: d.getDate(),
      mon: d.getMonth(),
      year: d.getFullYear(),
      h: d.getHours(),
      m: d.getMinutes(),
      s: d.getSeconds(),
    };
  }
  const t = new Date(d.getTime() + offsetMin * 60_000);
  return {
    day: t.getUTCDate(),
    mon: t.getUTCMonth(),
    year: t.getUTCFullYear(),
    h: t.getUTCHours(),
    m: t.getUTCMinutes(),
    s: t.getUTCSeconds(),
  };
}

export interface TimeLabels {
  /** "26 Sep 2026 at 14:05" */
  stamp: string;
  /** "26 Sep 2026 at 14:05:12" */
  stampSeconds: string;
  /** "26 Sep 2026 @ 2:05 PM" */
  thread: string;
  /** "26 Sep 2026" */
  day: string;
}

export function timeLabels(d: Date, offsetMin?: number): TimeLabels {
  const p = parts(d, offsetMin);
  const day = `${p.day} ${MON[p.mon]} ${p.year}`;
  const h12 = p.h % 12 === 0 ? 12 : p.h % 12;
  return {
    stamp: `${day} at ${pad(p.h)}:${pad(p.m)}`,
    stampSeconds: `${day} at ${pad(p.h)}:${pad(p.m)}:${pad(p.s)}`,
    thread: `${day} @ ${h12}:${pad(p.m)} ${p.h < 12 ? "AM" : "PM"}`,
    day,
  };
}
