// Hand-tokenised GraphQL and JSON for the GraphiQL recreation, plus the
// Winston-style server log. Every value is synthetic and fixed.

export type TokenType = "kw" | "def" | "prop" | "attr" | "str" | "num" | "punc" | "plain" | "key0" | "key";
export type Token = [TokenType, string];
export type Line = Token[];

const sp = (n: number): Token => ["plain", " ".repeat(n)];

export const QUERY: Line[] = [
  [["kw", "query"], sp(1), ["def", "OutletCollections"], sp(1), ["punc", "{"]],
  [
    sp(2),
    ["prop", "collections"],
    ["punc", "("],
    ["attr", "outlet"],
    ["punc", ":"],
    sp(1),
    ["str", '"SGR-0142"'],
    ["punc", ","],
    sp(1),
    ["attr", "last"],
    ["punc", ":"],
    sp(1),
    ["num", "3"],
    ["punc", ")"],
    sp(1),
    ["punc", "{"],
  ],
  [sp(4), ["prop", "chit"]],
  [sp(4), ["prop", "weightKg"]],
  [sp(4), ["prop", "status"]],
  [sp(4), ["prop", "collectedAt"]],
  [sp(4), ["prop", "collector"], sp(1), ["punc", "{"], sp(1), ["prop", "name"], sp(1), ["prop", "plate"], sp(1), ["punc", "}"]],
  [sp(2), ["punc", "}"]],
  [["punc", "}"]],
];

export const VARIABLES: Line[] = [[["punc", "{}"]]];

export const HEADERS: Line[] = [
  [["punc", "{"]],
  [sp(2), ["attr", '"authorization"'], ["punc", ":"], sp(1), ["str", '"Bearer eyJhbGciOiJIUzI1NiJ9..."'], ["punc", ","]],
  [sp(2), ["attr", '"x-signature"'], ["punc", ":"], sp(1), ["str", '"sha256=9f2c..."']],
  [["punc", "}"]],
];

/* ---------- JSON response ---------- */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** JSON.stringify(value, null, 2), emitted as coloured lines the way GraphiQL's result viewer tokenises them. */
function jsonLines(root: Json): Line[] {
  const out: Line[] = [];
  const scalar = (v: string | number | boolean | null): Token =>
    typeof v === "string" ? ["str", JSON.stringify(v)] : typeof v === "number" ? ["num", String(v)] : ["kw", String(v)];

  const emit = (v: Json, depth: number, prefix: Token[], comma: boolean) => {
    const tail: Token[] = comma ? [["punc", ","]] : [];
    if (v !== null && typeof v === "object") {
      const isArr = Array.isArray(v);
      out.push([sp(depth * 2), ...prefix, ["punc", isArr ? "[" : "{"]]);
      const entries: [string | null, Json][] = isArr ? v.map((x) => [null, x]) : Object.entries(v);
      entries.forEach(([k, child], i) => {
        const keyPrefix: Token[] = k === null ? [] : [[depth === 0 ? "key0" : "key", JSON.stringify(k)], ["punc", ":"], sp(1)];
        emit(child, depth + 1, keyPrefix, i < entries.length - 1);
      });
      out.push([sp(depth * 2), ["punc", isArr ? "]" : "}"], ...tail]);
    } else {
      out.push([sp(depth * 2), ...prefix, scalar(v), ...tail]);
    }
  };

  emit(root, 0, [], false);
  return out;
}

export const RESPONSE: Line[] = jsonLines({
  data: {
    collections: [
      {
        chit: "CH-260918-0473",
        weightKg: 84.5,
        status: "COMPLETED",
        collectedAt: "2026-09-18T03:42:10.000Z",
        collector: { name: "Faizal Hamdan", plate: "WXY 4127" },
      },
      {
        chit: "CH-260911-0388",
        weightKg: 92,
        status: "COMPLETED",
        collectedAt: "2026-09-11T04:15:37.000Z",
        collector: { name: "Faizal Hamdan", plate: "WXY 4127" },
      },
      {
        chit: "CH-260904-0301",
        weightKg: 77.25,
        status: "COMPLETED",
        collectedAt: "2026-09-04T02:58:02.000Z",
        collector: { name: "Rizal Mokhtar", plate: "BQA 2291" },
      },
    ],
  },
});

/** A line opens a foldable block when its last token is an opening brace or bracket. */
export function opensBlock(line: Line): boolean {
  const last = line[line.length - 1];
  return !!last && last[0] === "punc" && (last[1] === "{" || last[1] === "[");
}

/* ---------- server log ---------- */

export type Level = "info" | "http" | "debug" | "warn";

export interface LogLine {
  id: string;
  ts: string;
  level: Level;
  label: string;
  msg: string;
}

const p2 = (n: number) => String(n).padStart(2, "0");

/** Milliseconds since midnight UTC on 26 Sep 2026, as an ISO timestamp. */
function stamp(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor(ms / 60_000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return `2026-09-26T${p2(h)}:${p2(m)}:${p2(s)}.${String(ms % 1000).padStart(3, "0")}Z`;
}

export const BOOT_LOGS: LogLine[] = [
  { id: "boot-1", ts: "2026-09-26T06:04:58.102Z", level: "info", label: "server", msg: "api-platform listening on :4000/graphql" },
  { id: "boot-2", ts: "2026-09-26T06:04:58.117Z", level: "info", label: "schema", msg: "loaded 14 types, 23 queries, 9 mutations" },
  { id: "boot-3", ts: "2026-09-26T06:05:02.448Z", level: "http", label: "http", msg: "GET /graphql 200 4ms req=1c07d2" },
];

const RUN_MS = [182, 164, 197, 171, 158, 189];
const RUN_WAIT = [540, 470, 620, 500, 690, 440];
const RUN_REQ = ["7f3a9c", "b21e07", "c94d1a", "e0f6b3", "5a8d21", "93c4fe"];
const FIRST_RUN_START = ((6 * 60 + 5) * 60 + 14) * 1000 + 29; // 06:05:14.029Z

export interface RunPlan {
  ms: number;
  wait: number;
  req: string;
  steps: { after: number; line: LogLine }[];
  abort: LogLine;
}

/** Deterministic timings for the n-th execution (0-based). */
export function planRun(n: number): RunPlan {
  const ms = RUN_MS[n % RUN_MS.length];
  const wait = RUN_WAIT[n % RUN_WAIT.length];
  const req = n < RUN_REQ.length ? RUN_REQ[n] : (((n + 1) * 2654435761) >>> 0).toString(16).padStart(8, "0").slice(-6);
  const start = FIRST_RUN_START + n * 17_413 + ((n * n * 211) % 4000);
  const db = Math.round(ms * 0.22);
  const line = (i: number, off: number, level: Level, label: string, msg: string): LogLine => ({
    id: `${req}-${n}-${i}`,
    ts: stamp(start + off),
    level,
    label,
    msg,
  });
  return {
    ms,
    wait,
    req,
    steps: [
      { after: 70, line: line(0, 2, "debug", "auth", `hmac ok key=demo-01 req=${req}`) },
      { after: wait - 150, line: line(1, ms - db - 7, "debug", "db", `collection.findMany outlet=SGR-0142 take=3 rows=3 ${db}ms req=${req}`) },
      { after: wait - 25, line: line(2, ms, "info", "graphql", `OutletCollections outlet=SGR-0142 ${ms}ms req=${req}`) },
      { after: wait, line: line(3, ms + 1, "http", "http", `POST /graphql 200 1.3kb ${ms + 1}ms req=${req}`) },
    ],
    abort: line(9, 120, "warn", "graphql", `OutletCollections aborted by client req=${req}`),
  };
}
