import type { Icon } from "@phosphor-icons/react";
import {
  ArrowCounterClockwise,
  ArrowsClockwise,
  Asterisk,
  ChatCircleText,
  ClockCounterClockwise,
  FilePlus,
  FileText,
  Folder,
  Folders,
  GearSix,
  Globe,
  Lightning,
  MagnifyingGlass,
  NotePencil,
  PencilSimpleLine,
  Terminal,
  TerminalWindow,
} from "@phosphor-icons/react/dist/ssr";

/* Everything here is synthetic: a made-up payout service and conversation. */

export const TOOLS: { label: string; icon: Icon }[] = [
  { label: "terminal", icon: TerminalWindow },
  { label: "notes", icon: NotePencil },
  { label: "files", icon: Folder },
  { label: "browser", icon: Globe },
  { label: "history", icon: ClockCounterClockwise },
  { label: "projects", icon: Folders },
  { label: "pulse", icon: Lightning },
];

export type Tone = "add" | "del" | "ok" | "fail" | "dim";
export type Step = { verb: string; icon: Icon; target: string; meta: { text: string; tone: Tone }[] };

export const STEPS: Step[] = [
  { verb: "read", icon: FileText, target: "src/webhooks/payout.ts", meta: [{ text: "212 lines", tone: "dim" }] },
  { verb: "grep", icon: MagnifyingGlass, target: '"idempotency"', meta: [{ text: "6 hits", tone: "dim" }] },
  { verb: "read", icon: FileText, target: "src/lib/idempotency.ts", meta: [{ text: "64 lines", tone: "dim" }] },
  { verb: "read", icon: FileText, target: "test/payout.test.ts", meta: [{ text: "188 lines", tone: "dim" }] },
  { verb: "glob", icon: Asterisk, target: "src/lib/*.ts", meta: [{ text: "7 files", tone: "dim" }] },
  { verb: "write", icon: FilePlus, target: "src/lib/retry.ts", meta: [{ text: "+54", tone: "add" }] },
  {
    verb: "edit",
    icon: PencilSimpleLine,
    target: "src/webhooks/payout.ts",
    meta: [
      { text: "+38", tone: "add" },
      { text: "-6", tone: "del" },
    ],
  },
  {
    verb: "edit",
    icon: PencilSimpleLine,
    target: "src/lib/idempotency.ts",
    meta: [
      { text: "+9", tone: "add" },
      { text: "-2", tone: "del" },
    ],
  },
  { verb: "run", icon: Terminal, target: "pnpm tsc --noEmit", meta: [{ text: "ok", tone: "ok" }] },
  {
    verb: "edit",
    icon: PencilSimpleLine,
    target: "test/payout.test.ts",
    meta: [
      { text: "+61", tone: "add" },
      { text: "-4", tone: "del" },
    ],
  },
  { verb: "write", icon: FilePlus, target: "test/retry.test.ts", meta: [{ text: "+48", tone: "add" }] },
  { verb: "run", icon: Terminal, target: "pnpm test", meta: [{ text: "2 failed", tone: "fail" }] },
  {
    verb: "edit",
    icon: PencilSimpleLine,
    target: "src/lib/retry.ts",
    meta: [
      { text: "+3", tone: "add" },
      { text: "-1", tone: "del" },
    ],
  },
  { verb: "run", icon: Terminal, target: "pnpm test", meta: [{ text: "42 passed", tone: "ok" }] },
];

export const REPLY = "On it. Reading the handler first, then I'll add a retry wrapper with jitter.";
export const REPLY_WORDS = REPLY.split(" ");

/* ---------- the files window ---------- */

export type Git = "M" | "A" | "U";
export type TreeNode = { name: string; path: string; git?: Git; children?: TreeNode[] };

export const TREE: TreeNode = {
  name: "payout-service",
  path: "",
  children: [
    {
      name: ".github",
      path: ".github",
      children: [{ name: "workflows", path: ".github/workflows", children: [{ name: "ci.yml", path: ".github/workflows/ci.yml" }] }],
    },
    {
      name: "src",
      path: "src",
      children: [
        {
          name: "webhooks",
          path: "src/webhooks",
          children: [
            { name: "payout.ts", path: "src/webhooks/payout.ts", git: "M" },
            { name: "refund.ts", path: "src/webhooks/refund.ts" },
          ],
        },
        {
          name: "lib",
          path: "src/lib",
          children: [
            { name: "idempotency.ts", path: "src/lib/idempotency.ts", git: "M" },
            { name: "logger.ts", path: "src/lib/logger.ts" },
            { name: "retry.ts", path: "src/lib/retry.ts", git: "A" },
          ],
        },
        { name: "server.ts", path: "src/server.ts" },
      ],
    },
    {
      name: "test",
      path: "test",
      children: [
        { name: "payout.test.ts", path: "test/payout.test.ts", git: "M" },
        { name: "retry.test.ts", path: "test/retry.test.ts", git: "U" },
      ],
    },
    { name: ".env.example", path: ".env.example" },
    { name: "package.json", path: "package.json" },
    { name: "pnpm-lock.yaml", path: "pnpm-lock.yaml" },
    { name: "README.md", path: "README.md" },
    { name: "tsconfig.json", path: "tsconfig.json" },
  ],
};

export const DEFAULT_OPEN = ["src", "src/webhooks", "src/lib", "test"];

/** seti-ish colours the real tree uses, keyed by extension */
export const EXT_COLOR: Record<string, string> = {
  ts: "#4a9bd6",
  json: "#e8c343",
  yaml: "#d6699b",
  yml: "#d6699b",
  md: "#5b9bd6",
};

/* ---------- the command palette ---------- */

export type CommandAction = "composer" | "resume" | "files" | "toast";
export type Command = { id: string; group: string; title: string; sub?: string; icon: Icon; action: CommandAction };

export const COMMANDS: Command[] = [
  { id: "terminal", group: "recent", title: "open terminal", sub: "zsh · payout-service", icon: TerminalWindow, action: "toast" },
  { id: "chat", group: "recent", title: "new agent chat", sub: "opus 4.8", icon: ChatCircleText, action: "composer" },
  { id: "resume", group: "recent", title: 'resume "payout-retry"', sub: "2d 6h", icon: ArrowCounterClockwise, action: "resume" },
  { id: "notes", group: "open", title: "open notes", icon: NotePencil, action: "toast" },
  { id: "browser", group: "open", title: "browser", icon: Globe, action: "toast" },
  { id: "files", group: "open", title: "files", sub: "~/code/payout-service", icon: Folder, action: "files" },
  { id: "settings", group: "app", title: "settings", icon: GearSix, action: "toast" },
  { id: "updates", group: "app", title: "check for updates", sub: "v2.10", icon: ArrowsClockwise, action: "toast" },
];

/* ---------- the code block, pre-tokenised ---------- */

export type TokKind = "kw" | "fn" | "id" | "prop" | "num" | "str" | "pun" | "com" | "ws";
export type Tok = readonly [string, TokKind];

export const CODE: readonly (readonly Tok[])[] = [
  [["// every attempt reuses one key, so no double payouts", "com"]],
  [
    ["const", "kw"],
    [" transfer ", "id"],
    ["=", "pun"],
    [" ", "ws"],
    ["await", "kw"],
    [" ", "ws"],
    ["withRetry", "fn"],
    ["(", "pun"],
  ],
  [
    ["  ", "ws"],
    ["() =>", "pun"],
    [" payouts", "id"],
    [".", "pun"],
    ["create", "fn"],
    ["(", "pun"],
    ["evt", "id"],
    [".", "pun"],
    ["data", "prop"],
    [", { ", "pun"],
    ["idempotencyKey", "prop"],
    [": ", "pun"],
    ["evt", "id"],
    [".", "pun"],
    ["id", "prop"],
    [" }),", "pun"],
  ],
  [
    ["  { ", "pun"],
    ["attempts", "prop"],
    [": ", "pun"],
    ["5", "num"],
    [", ", "pun"],
    ["baseMs", "prop"],
    [": ", "pun"],
    ["200", "num"],
    [", ", "pun"],
    ["maxMs", "prop"],
    [": ", "pun"],
    ["8_000", "num"],
    [", ", "pun"],
    ["jitter", "prop"],
    [": ", "pun"],
    ['"full"', "str"],
    [" },", "pun"],
  ],
  [[");", "pun"]],
];

export const TOK_COLOR: Record<TokKind, string> = {
  kw: "#c3a6ff",
  fn: "#f7ab7c",
  id: "#e4e4e6",
  prop: "#b4b6b8",
  num: "#3de8ff",
  str: "#6ee7a0",
  pun: "#808284",
  com: "#6b6d70",
  ws: "inherit",
};
