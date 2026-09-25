/**
 * The signing seal, recreated in the browser with Web Crypto. Mirrors how the
 * real portal seals a contract: a SHA-256 content hash over canonical terms,
 * a token derived from it, and an HMAC-SHA256 over token, hash, signer and
 * timestamp. The key below is a published demo value, not a secret.
 */

import type { Contract, TimeLabels } from "./data";

export const DEMO_KEY = "portfolio-demo-key, not a secret";

export interface ContractTerms {
  reference: string;
  counterparty: string;
  product: string;
  volumeMt: number | string;
  priceUsd: number;
  incoterm: string;
  deliveryWindow: string;
}

export interface SealRecord {
  terms: ContractTerms;
  contentHash: string;
  token: string;
  signer: string;
  signedAtIso: string;
  seal: string;
}

/** A seal plus the display labels worked out once, at signing time. */
export interface SignedRecord extends SealRecord {
  labels: TimeLabels;
  /** True when the visitor signed it in this session. */
  session: boolean;
}

export interface VerifyResult {
  hmacOk: boolean;
  contentOk: boolean;
  liveHash: string;
}

export function termsOf(c: Contract): ContractTerms {
  return {
    reference: c.ref,
    counterparty: c.counterparty,
    product: c.product,
    volumeMt: c.volumeMt,
    priceUsd: c.priceUsd,
    incoterm: `FOB ${c.port}`,
    deliveryWindow: c.window.iso,
  };
}

/** Keys sorted, so the same terms always serialise to the same bytes. */
export function canonicalJson(terms: ContractTerms): string {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(terms).sort()) {
    sorted[key] = terms[key as keyof ContractTerms];
  }
  return JSON.stringify(sorted);
}

/** Web Crypto only exists in secure contexts (https, localhost). */
export function hasSubtle(): boolean {
  return typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.subtle !== "undefined";
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return toHex(digest);
}

export async function hmacHex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const k = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await globalThis.crypto.subtle.sign("HMAC", k, enc.encode(message)));
}

/** "TP-SIG-" + the first 8 hex characters of the content hash, as XXXX-XXXX. */
export function tokenFromHash(hash: string): string {
  const h = hash.slice(0, 8).toUpperCase();
  return `TP-SIG-${h.slice(0, 4)}-${h.slice(4, 8)}`;
}

function sealMessage(token: string, contentHash: string, signer: string, signedAtIso: string) {
  return [token, contentHash, signer, signedAtIso].join("|");
}

export async function mintSeal(
  terms: ContractTerms,
  signer: string,
  signedAtIso: string,
): Promise<SealRecord> {
  const contentHash = await sha256Hex(canonicalJson(terms));
  const token = tokenFromHash(contentHash);
  const seal = await hmacHex(DEMO_KEY, sealMessage(token, contentHash, signer, signedAtIso));
  return { terms, contentHash, token, signer, signedAtIso, seal };
}

/**
 * The two checks the verify page runs. The HMAC is recomputed over the sealed
 * record (so it proves the token was minted here); the content hash is
 * recomputed over the terms as they stand now (so it proves nothing moved).
 */
export async function verifySeal(record: SealRecord, live: ContractTerms): Promise<VerifyResult> {
  const [liveHash, expected] = await Promise.all([
    sha256Hex(canonicalJson(live)),
    hmacHex(
      DEMO_KEY,
      sealMessage(record.token, record.contentHash, record.signer, record.signedAtIso),
    ),
  ]);
  return { hmacOk: expected === record.seal, contentOk: liveHash === record.contentHash, liveHash };
}

export function shortSeal(hex: string): string {
  return `sha256:${hex.slice(0, 12)}…`;
}

/**
 * A QR-like block pattern: three finder squares, timing rows, and data
 * modules filled from the seal bytes. Deterministic; it does not scan.
 * Returns one SVG path in module units on a 21 x 21 grid.
 */
export function qrPath(hex: string): string {
  const N = 21;
  const bits: number[] = [];
  for (let i = 0; i + 1 < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    for (let j = 7; j >= 0; j--) bits.push((byte >> j) & 1);
  }
  if (bits.length === 0) bits.push(0);

  const dark: boolean[][] = Array.from({ length: N }, () => Array<boolean>(N).fill(false));
  const used: boolean[][] = Array.from({ length: N }, () => Array<boolean>(N).fill(false));

  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
        used[rr][cc] = true;
        const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const ring = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        dark[rr][cc] = inside && (ring || core);
      }
    }
  };
  finder(0, 0);
  finder(0, N - 7);
  finder(N - 7, 0);

  for (let i = 8; i < N - 8; i++) {
    used[6][i] = true;
    used[i][6] = true;
    dark[6][i] = i % 2 === 0;
    dark[i][6] = i % 2 === 0;
  }

  let k = 0;
  for (let c = N - 1; c >= 0; c--) {
    for (let r = 0; r < N; r++) {
      if (used[r][c]) continue;
      // Light mask so long runs of equal bits still read as a code.
      dark[r][c] = (bits[k % bits.length] ^ ((r + c) % 3 === 0 ? 1 : 0)) === 1;
      k++;
    }
  }

  let d = "";
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (dark[r][c]) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return d;
}
