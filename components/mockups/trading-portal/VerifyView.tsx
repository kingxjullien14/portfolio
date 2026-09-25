import { useId, useState } from "react";
import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  CopySimpleIcon,
  FlaskIcon,
  GlobeSimpleIcon,
  InfoIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  ShieldWarningIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useReducedMotion } from "framer-motion";
import { SIGNER_CAPTION } from "./data";
import {
  canonicalJson,
  hasSubtle,
  verifySeal,
  type ContractTerms,
  type SignedRecord,
  type VerifyResult,
} from "./seal";
import { BRAND_GRADIENT, BRAND_SHADOW, E1, Kicker, T11, T13, cx } from "./ui";

const FOCUS_BTN =
  "focus-visible:rounded-md! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-[#174CB5]!";

/** Styled on the portal's public /verify/[token] page. */
export function VerifyView({
  reference,
  record,
  initial,
  onBack,
  onAnnounce,
}: {
  reference: string;
  record?: SignedRecord;
  initial: VerifyResult | null;
  onBack: () => void;
  onAnnounce: (msg: string) => void;
}) {
  const reduce = useReducedMotion();
  const inputId = useId();
  const original = record ? String(record.terms.volumeMt) : "";
  const [volume, setVolume] = useState(original);
  const [result, setResult] = useState<VerifyResult | null>(initial);
  const [checking, setChecking] = useState(false);
  const [noCrypto, setNoCrypto] = useState(record === undefined || initial === null);

  const run = async (raw: string) => {
    if (!record) return;
    if (!hasSubtle()) {
      setNoCrypto(true);
      return;
    }
    setChecking(true);
    const live = liveTerms(record.terms, raw);
    try {
      const r = await verifySeal(record, live);
      setResult(r);
      onAnnounce(
        r.hmacOk && r.contentOk
          ? "Signature is valid. Contract unchanged since signing."
          : "Signature does not match this contract. Contract unchanged since signing: fail.",
      );
    } catch {
      setNoCrypto(true);
    } finally {
      setChecking(false);
    }
  };

  const jsonLines = record ? jsonPreview(liveTerms(record.terms, volume)) : [];
  const valid = result !== null && result.hmacOk && result.contentOk;
  const tampered = result !== null && !result.contentOk;
  const canRestore = volume !== original || tampered;

  return (
    <div className="flex h-full min-h-0 flex-col px-4 pb-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className={cx(
            "-ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 text-xs font-medium text-[#555D6D] transition-colors hover:text-[#0F121A]",
            FOCUS_BTN,
          )}
        >
          <ArrowLeftIcon aria-hidden="true" className="size-3.5" />
          Back to {reference}
        </button>
        {record && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#DEE1E7] bg-white px-2 py-1 font-mono text-2xs leading-4 text-[#555D6D]">
            <GlobeSimpleIcon aria-hidden="true" className="size-3.5" />
            /verify/{record.token}
          </span>
        )}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_calc(var(--mu)*324)] gap-4">
        {/* Verification card */}
        <div className={cx("flex min-h-0 flex-col rounded-2xl border border-[#DEE1E7]/70 bg-white p-5", E1)}>
          <Kicker>Token</Kicker>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#DEE1E7] bg-[#EDEFF3]/40 px-3 py-2">
            <code className="flex-1 font-mono text-sm font-semibold text-[#0F121A]">
              {record ? record.token : "Unavailable"}
            </code>
            <CopySimpleIcon aria-hidden="true" className="size-4 text-[#555D6D]" />
          </div>

          {noCrypto || !record ? (
            <Banner
              tone="warning"
              title="Could not check this token"
              detail="This browser only offers Web Crypto on secure (https) pages, so the seal cannot be recomputed here."
            />
          ) : (
            <>
              <Banner
                tone={valid ? "ok" : "error"}
                title={valid ? "Signature is valid" : "Signature does not match this contract"}
                detail={
                  valid
                    ? "This token was minted by the Trading Panel and the contract still matches the seal."
                    : "The seal recorded at signing no longer matches the contract in front of you. At least one term has changed since."
                }
              />
              <CheckRow
                ok={result?.hmacOk ?? false}
                label="Token issued by this server (HMAC check)"
                hint="HMAC seal matches the token, content hash, signer and timestamp."
              />
              <CheckRow
                ok={result?.contentOk ?? false}
                label="Contract unchanged since signing"
                hint={
                  result?.contentOk
                    ? "The live contract still hashes to the value sealed at signing."
                    : `Live hash sha256:${result?.liveHash.slice(0, 12) ?? ""}… does not match the sealed sha256:${record.contentHash.slice(0, 12)}…`
                }
              />

              <div
                className={cx(
                  "mt-4 rounded-xl border p-4 transition-colors duration-200",
                  tampered ? "border-[#DEE1E7] bg-[#F6F7F9]" : "border-emerald-300/80 bg-emerald-50/50",
                )}
              >
                <Kicker>Signed by</Kicker>
                <div className="mt-1 truncate font-serif text-xl leading-tight text-[#0F121A] italic">
                  {record.signer}
                </div>
                <div className="mt-0.5 text-xs text-[#555D6D]">{SIGNER_CAPTION}</div>
                <div className={cx("mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2", T11)}>
                  <Field label="Signed at" value={record.labels.stampSeconds} />
                  <Field label="Token" value={record.token} mono />
                  <Field label="HMAC seal" value={`${record.seal.slice(0, 40)}…`} mono wide />
                </div>
              </div>

              <div className={cx("mt-auto grid grid-cols-2 gap-3 rounded-xl border border-[#DEE1E7] bg-[#EDEFF3]/25 px-4 py-3", T11)}>
                <Field label="Contract" value={record.terms.reference} mono />
                <Field label="Document seal" value={`sha256:${record.contentHash.slice(0, 12)}`} mono />
              </div>
            </>
          )}
        </div>

        {/* Side column */}
        <div className="flex min-h-0 flex-col gap-4">
          <div className={cx("rounded-2xl border border-[#DEE1E7]/70 bg-white p-4", E1)}>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-[#174CB5]/10 text-[#174CB5]">
                <InfoIcon aria-hidden="true" className="size-4" />
              </span>
              <div className="font-grotesk text-sm font-semibold text-[#0F121A]">How the seal works</div>
            </div>
            <p className={cx("mt-2 text-[#0F121A]", T13)}>
              HMAC-SHA256 over token, content hash, signer and timestamp.
            </p>
            <ol className="mt-3 flex flex-col gap-1 rounded-lg border border-[#DEE1E7] bg-[#F6F7F9] px-3 py-2.5 font-mono text-2xs leading-4 text-[#555D6D]">
              <li>
                <span className="font-semibold text-[#174CB5]">hash</span> = sha256(canonical terms)
              </li>
              <li>
                <span className="font-semibold text-[#174CB5]">token</span> = TP-SIG + hash[0..8]
              </li>
              <li>
                <span className="font-semibold text-[#174CB5]">seal</span> = hmac(token|hash|signer|time)
              </li>
            </ol>
          </div>

          <div className={cx("flex min-h-0 flex-1 flex-col rounded-2xl border border-[#DEE1E7]/70 bg-white p-4", E1)}>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-[#BF7918]/12 text-[#BF7918]">
                <FlaskIcon aria-hidden="true" className="size-4" />
              </span>
              <div className="font-grotesk text-sm font-semibold text-[#0F121A]">Tamper test</div>
            </div>
            <p className={cx("mt-2 text-[#555D6D]", T11)}>
              Change a signed term, then verify again.
            </p>

            {record && !noCrypto ? (
              <>
                <label htmlFor={inputId} className="mt-2.5 text-xs font-medium text-[#0F121A]">
                  Volume (MT)
                </label>
                <div className="relative mt-1.5">
                  <input
                    id={inputId}
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void run(volume);
                    }}
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    className={cx(
                      "h-9 w-full rounded-md border bg-white pr-12 pl-3 font-grotesk text-[#0F121A] tabular-nums caret-[#174CB5] outline-none focus-visible:rounded-md! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-[#1A53C7]/50 focus-visible:ring-offset-1",
                      T13,
                      volume !== original ? "border-[#BF7918]/60 bg-[#BF7918]/5" : "border-[#DEE1E7]",
                    )}
                  />
                  <span className={cx("pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#555D6D]", T11)}>
                    MT
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void run(volume)}
                    disabled={checking}
                    className={cx(
                      "inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 font-semibold whitespace-nowrap text-white transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98] disabled:cursor-progress disabled:opacity-80",
                      T13,
                      FOCUS_BTN,
                    )}
                    style={{ background: BRAND_GRADIENT, boxShadow: BRAND_SHADOW }}
                  >
                    {checking ? (
                      <CircleNotchIcon aria-hidden="true" weight="bold" className={cx("size-4", !reduce && "animate-spin")} />
                    ) : (
                      <SealCheckIcon aria-hidden="true" weight="bold" className="size-4" />
                    )}
                    Verify again
                  </button>
                  <button
                    type="button"
                    disabled={!canRestore || checking}
                    onClick={() => {
                      setVolume(original);
                      void run(original);
                    }}
                    className={cx(
                      "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-[#DEE1E7] bg-white px-3 font-medium whitespace-nowrap text-[#0F121A] transition-colors hover:bg-[#E6E9EF] disabled:cursor-default disabled:opacity-45 disabled:hover:bg-white",
                      T13,
                      FOCUS_BTN,
                    )}
                  >
                    <ArrowCounterClockwiseIcon aria-hidden="true" className="size-4" />
                    Restore original
                  </button>
                </div>
                <div className="mt-3">
                  <div className={cx("mb-1 font-medium text-[#555D6D]", T11)}>Hashed terms, canonical JSON</div>
                  <pre
                    aria-label="Contract terms as hashed"
                    className="overflow-hidden rounded-lg border border-[#DEE1E7] bg-[#F6F7F9] px-2.5 py-2 font-mono text-[length:calc(var(--mu)*9.5)] leading-3.5 text-[#555D6D]"
                  >
                    {jsonLines.map((line) => (
                      <span
                        key={line.key}
                        className={cx(
                          "block truncate",
                          line.key === "volumeMt" && volume !== original && "-mx-1 rounded-xs bg-[#BF7918]/15 px-1 text-[#8A560F]",
                        )}
                      >
                        {line.text}
                      </span>
                    ))}
                  </pre>
                </div>
                <dl className="mt-auto flex flex-col gap-0.5 border-t border-[#DEE1E7] pt-2.5 font-mono text-2xs leading-4">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#555D6D]">Sealed hash</dt>
                    <dd className="text-[#0F121A]">sha256:{record.contentHash.slice(0, 16)}…</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#555D6D]">Live hash</dt>
                    <dd className={tampered ? "font-semibold text-rose-700" : "text-emerald-700"}>
                      sha256:{(result?.liveHash ?? record.contentHash).slice(0, 16)}…
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <div
                className={cx(
                  "mt-3 flex items-start gap-2 rounded-md border border-[#BF7918]/30 bg-[#BF7918]/10 px-3 py-2 text-[#8A560F]",
                  T11,
                )}
              >
                <InfoIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                Live verification needs Web Crypto, which this browser only offers on secure (https) pages.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Banner({
  tone,
  title,
  detail,
}: {
  tone: "ok" | "warning" | "error";
  title: string;
  detail: string;
}) {
  const I = tone === "ok" ? CheckCircleIcon : tone === "warning" ? WarningIcon : ShieldWarningIcon;
  return (
    <div
      className={cx(
        "mt-4 flex items-start gap-3 rounded-xl border p-3.5",
        tone === "ok" && "border-emerald-300 bg-emerald-50",
        tone === "warning" && "border-amber-300 bg-amber-50",
        tone === "error" && "border-rose-300 bg-rose-50",
      )}
    >
      <I
        aria-hidden="true"
        weight="fill"
        className={cx(
          "mt-0.5 size-5 shrink-0",
          tone === "ok" && "text-emerald-600",
          tone === "warning" && "text-amber-600",
          tone === "error" && "text-rose-600",
        )}
      />
      <div className="min-w-0 flex-1">
        <div
          className={cx(
            "text-sm font-semibold",
            tone === "ok" && "text-emerald-900",
            tone === "warning" && "text-amber-900",
            tone === "error" && "text-rose-900",
          )}
        >
          {title}
        </div>
        <div
          className={cx(
            "mt-0.5 text-xs",
            tone === "ok" && "text-emerald-800/80",
            tone === "warning" && "text-amber-800/80",
            tone === "error" && "text-rose-800/80",
          )}
        >
          {detail}
        </div>
      </div>
    </div>
  );
}

function CheckRow({ ok, label, hint }: { ok: boolean; label: string; hint: string }) {
  return (
    <div className="mt-3 flex items-start gap-3 rounded-lg border border-[#DEE1E7] bg-[#F6F7F9] p-3">
      {ok ? (
        <ShieldCheckIcon aria-hidden="true" weight="fill" className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      ) : (
        <ShieldWarningIcon aria-hidden="true" weight="fill" className="mt-0.5 size-5 shrink-0 text-rose-600" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-medium text-[#0F121A]">
          {label}
          <span
            className={cx(
              "inline-flex h-4.5 items-center rounded-md px-1.5 text-2xs font-bold tracking-wide",
              ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
            )}
          >
            {ok ? "PASS" : "FAIL"}
          </span>
        </div>
        <div className={cx("mt-0.5 truncate text-[#555D6D]", T11)}>{hint}</div>
      </div>
    </div>
  );
}

function Field({ label, value, mono, wide }: { label: string; value: string; mono?: boolean; wide?: boolean }) {
  return (
    <div className={cx("min-w-0", wide && "col-span-2")}>
      <div className="font-semibold tracking-wider text-[#555D6D] uppercase">{label}</div>
      <div className={cx("mt-0.5 truncate text-[#0F121A]", mono && "font-mono")}>{value}</div>
    </div>
  );
}

/** The terms as they stand with the tampered volume. Numeric input stays numeric. */
function liveTerms(terms: ContractTerms, raw: string): ContractTerms {
  const cleaned = raw.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return { ...terms, volumeMt: cleaned !== "" && Number.isFinite(n) ? n : raw };
}

/** Canonical JSON split one key per line, so the hashed bytes stay readable. */
function jsonPreview(terms: ContractTerms): { key: string; text: string }[] {
  const obj = JSON.parse(canonicalJson(terms)) as Record<string, unknown>;
  const keys = Object.keys(obj);
  return keys.map((key, i) => ({
    key,
    text: `${i === 0 ? "{" : " "}${JSON.stringify(key)}:${JSON.stringify(obj[key])}${i === keys.length - 1 ? "}" : ","}`,
  }));
}
