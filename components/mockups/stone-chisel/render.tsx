import { Fragment, type ReactNode } from "react";
import { Check, Copy, FlowArrow, Info, Lightbulb, Warning } from "@phosphor-icons/react";
import { RX, fenceCloser, mermaidNodes, tokenizeTs, type Block, type TsKind } from "./markdown";

/*
 * Rendering for the recreated editor. Everything here builds React elements
 * from parsed data; sizes inside the preview are in em so the same markup
 * reads at split (14 design px) and preview (15.5 design px) sizes.
 */

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/* ---------------------------------------------------------------- inline */

const INLINE_CODE =
  "rounded-[0.32em] border border-(--line) bg-(--ink-5) px-[0.34em] py-[0.06em] font-mono text-[0.8em] text-(--code-ink)";
const LINK =
  "text-(--primary-ink) underline decoration-(--link-line) decoration-1 underline-offset-[0.2em]";
const WIKI =
  "whitespace-nowrap rounded-[0.3em] bg-(--tint) px-[0.32em] py-[0.04em] text-(--primary-ink) shadow-[inset_0_0_0_1px_var(--tint-2)]";

const isWordChar = (ch: string | undefined) => !!ch && /[\p{L}\p{N}]/u.test(ch);

/** Next index of a single `ch` that is not part of a doubled pair. */
function findSingle(src: string, ch: string, from: number): number {
  for (let j = from; j < src.length; j++) {
    if (src[j] !== ch) continue;
    if (src[j + 1] === ch) {
      j++;
      continue;
    }
    return j;
  }
  return -1;
}

const TEX_SYMBOLS: Record<string, string> = {
  cdot: "·",
  times: "×",
  approx: "≈",
  le: "≤",
  ge: "≥",
  to: "→",
  pi: "π",
  Delta: "Δ",
  delta: "δ",
  sum: "∑",
};

/** A tiny TeX-ish renderer: italic letters, upright digits, sub/superscripts. */
function renderTex(tex: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let n = 0;
  const k = () => `${key}-${n++}`;
  const group = (): string => {
    if (tex[i] === "{") {
      let depth = 0;
      for (let j = i; j < tex.length; j++) {
        if (tex[j] === "{") depth++;
        else if (tex[j] === "}" && --depth === 0) {
          const g = tex.slice(i + 1, j);
          i = j + 1;
          return g;
        }
      }
      const g = tex.slice(i + 1);
      i = tex.length;
      return g;
    }
    const ch = tex[i] ?? "";
    i++;
    return ch;
  };
  while (i < tex.length) {
    const c = tex[i];
    if (c === "_" || c === "^") {
      i++;
      const g = group();
      out.push(
        c === "_" ? <sub key={k()}>{renderTex(g, k())}</sub> : <sup key={k()}>{renderTex(g, k())}</sup>,
      );
      continue;
    }
    if (c === "\\") {
      const m = /^\\([a-zA-Z]+)/.exec(tex.slice(i));
      if (m) {
        out.push(<span key={k()}>{TEX_SYMBOLS[m[1]] ?? m[1]}</span>);
        i += m[0].length;
        continue;
      }
    }
    if (/[A-Za-z]/.test(c)) {
      let j = i;
      while (j < tex.length && /[A-Za-z]/.test(tex[j])) j++;
      out.push(
        <i key={k()} className="italic">
          {tex.slice(i, j)}
        </i>,
      );
      i = j;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < tex.length && /[0-9.,]/.test(tex[j])) j++;
      out.push(<span key={k()}>{tex.slice(i, j)}</span>);
      i = j;
      continue;
    }
    if (/[=+<>*/-]/.test(c)) {
      out.push(
        <span key={k()} className="px-[0.24em]">
          {c === "*" ? "·" : c}
        </span>,
      );
      i++;
      continue;
    }
    if (c === " " || c === "{" || c === "}") {
      i++;
      continue;
    }
    out.push(<span key={k()}>{c}</span>);
    i++;
  }
  return out;
}

export function renderInline(src: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let n = 0;
  const k = () => `${key}.${n++}`;
  const flush = () => {
    if (buf) {
      out.push(buf);
      buf = "";
    }
  };
  const push = (node: ReactNode) => {
    flush();
    out.push(node);
  };

  let i = 0;
  while (i < src.length) {
    const c = src[i];

    if (c === "\\" && /[\\`*_[\]$#>~|-]/.test(src[i + 1] ?? "")) {
      buf += src[i + 1];
      i += 2;
      continue;
    }

    if (c === "`") {
      const end = src.indexOf("`", i + 1);
      if (end > i + 1) {
        push(
          <code key={k()} className={INLINE_CODE}>
            {src.slice(i + 1, end)}
          </code>,
        );
        i = end + 1;
        continue;
      }
    }

    if (c === "$" && src[i + 1] && src[i + 1] !== " ") {
      const end = src.indexOf("$", i + 1);
      if (end > i + 1 && src[end - 1] !== " ") {
        push(
          <span key={k()} className="whitespace-nowrap font-serif tracking-[0.01em] text-(--fg)">
            {renderTex(src.slice(i + 1, end), k())}
          </span>,
        );
        i = end + 1;
        continue;
      }
    }

    if (c === "[" && src[i + 1] === "[") {
      const end = src.indexOf("]]", i + 2);
      if (end > i + 2) {
        const raw = src.slice(i + 2, end);
        const label = (raw.includes("|") ? raw.slice(raw.indexOf("|") + 1) : raw).trim();
        push(
          <span key={k()} className={WIKI}>
            {label}
          </span>,
        );
        i = end + 2;
        continue;
      }
    }

    if (c === "[") {
      const close = src.indexOf("]", i + 1);
      if (close > i + 1 && src[close + 1] === "(") {
        const end = src.indexOf(")", close + 2);
        if (end > close + 1) {
          push(
            <span key={k()} className={LINK}>
              {renderInline(src.slice(i + 1, close), k())}
            </span>,
          );
          i = end + 1;
          continue;
        }
      }
    }

    if ((c === "*" || c === "_") && src[i + 1] === c) {
      const end = src.indexOf(c + c, i + 2);
      if (end > i + 2 && src[i + 2] !== " " && src[end - 1] !== " ") {
        push(
          <strong key={k()} className="font-semibold text-(--fg)">
            {renderInline(src.slice(i + 2, end), k())}
          </strong>,
        );
        i = end + 2;
        continue;
      }
    }

    if (c === "~" && src[i + 1] === "~") {
      const end = src.indexOf("~~", i + 2);
      if (end > i + 2) {
        push(
          <del key={k()} className="decoration-(--line-strong)">
            {renderInline(src.slice(i + 2, end), k())}
          </del>,
        );
        i = end + 2;
        continue;
      }
    }

    if (c === "*" || (c === "_" && !isWordChar(src[i - 1]))) {
      const end = findSingle(src, c, i + 1);
      if (
        end > i + 1 &&
        src[i + 1] !== " " &&
        src[end - 1] !== " " &&
        (c === "*" || !isWordChar(src[end + 1]))
      ) {
        push(
          <em key={k()} className="italic">
            {renderInline(src.slice(i + 1, end), k())}
          </em>,
        );
        i = end + 1;
        continue;
      }
    }

    buf += c;
    i++;
  }
  flush();
  return out;
}

/* ----------------------------------------------------------------- cards */

const TS_COLOR: Record<TsKind, string> = {
  kw: "text-[#E0A85A]",
  type: "text-[#A9C08A]",
  fn: "text-[#E9C98A]",
  str: "text-[#D9A38A]",
  num: "text-[#E39A6B]",
  com: "italic text-[#9C8B72]",
  punct: "text-[#A3937A]",
  plain: "",
};

const SCRIPT_LANGS = new Set(["ts", "tsx", "typescript", "js", "jsx", "javascript"]);

function CodeCard({ lang, code }: { lang: string; code: string }) {
  const tokens = SCRIPT_LANGS.has(lang) ? tokenizeTs(code) : [{ text: code, kind: "plain" as const }];
  return (
    <div className="my-[1.15em] overflow-hidden rounded-xl border border-white/[0.06] bg-(--espresso) shadow-(--code-shadow)">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-[calc(var(--mu)*7)]">
        <span aria-hidden className="flex gap-[calc(var(--mu)*5)]">
          <span className="size-2 rounded-full bg-[#C4623C]" />
          <span className="size-2 rounded-full bg-[#C99A4A]" />
          <span className="size-2 rounded-full bg-[#6E7A5A]" />
        </span>
        <span className="ml-0.5 font-mono text-[length:calc(var(--mu)*9.5)] uppercase tracking-[0.08em] text-[#9C8B72]">
          {lang || "text"}
        </span>
        <Copy aria-hidden className="ml-auto size-3.5 text-[#9C8B72]" />
      </div>
      <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[0.75em] leading-[1.7] text-[#E9DCC6] [font-variant-ligatures:none]">
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={TS_COLOR[t.kind]}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function MermaidCard({ code }: { code: string }) {
  const nodes = mermaidNodes(code);
  return (
    <figure className="my-[1.2em] overflow-hidden rounded-xl border border-(--line-strong) bg-(--diagram) shadow-(--card-shadow)">
      <figcaption className="flex items-center gap-1.5 border-b border-(--line) px-3 py-[calc(var(--mu)*7)] font-mono text-[length:calc(var(--mu)*9.5)] tracking-[0.04em] text-(--indigo)">
        <FlowArrow aria-hidden weight="bold" className="size-3.5" />
        mermaid · flowchart
      </figcaption>
      <div
        role="img"
        aria-label={nodes.length ? `Flow diagram: ${nodes.join(", then ")}` : "Empty flow diagram"}
        className="flex flex-wrap items-center justify-center gap-y-2 px-2.5 py-[1.2em] font-ui text-[0.7em]"
      >
        {nodes.length === 0 && <span className="text-(--muted-fg)">Nothing to draw yet</span>}
        {nodes.map((node, i) => (
          <Fragment key={`${node}-${i}`}>
            {i > 0 && (
              <span aria-hidden className="mx-[0.3em] flex items-center">
                <span className="h-[1.5px] w-[0.95em] bg-(--muted-fg)" />
                <span className="size-0 border-y-[0.26em] border-l-[0.42em] border-y-transparent border-l-(--muted-fg)" />
              </span>
            )}
            <span className="rounded-lg border-[1.5px] border-(--primary) bg-(--node) px-[0.62em] py-[0.5em] font-semibold leading-none text-(--fg) shadow-[0_1px_0_color-mix(in_oklab,white_60%,transparent)_inset]">
              {node}
            </span>
          </Fragment>
        ))}
      </div>
    </figure>
  );
}

const CALLOUTS: Record<string, { label: string; Icon: typeof Info }> = {
  note: { label: "Note", Icon: Info },
  info: { label: "Info", Icon: Info },
  tip: { label: "Tip", Icon: Lightbulb },
  important: { label: "Important", Icon: Info },
  warning: { label: "Warning", Icon: Warning },
  caution: { label: "Caution", Icon: Warning },
};

/** Groups quoted lines into paragraphs (blank quoted lines split them). */
function paragraphs(lines: string[]): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  for (const l of lines) {
    if (l.trim()) cur.push(l.trim());
    else if (cur.length) {
      out.push(cur.join(" "));
      cur = [];
    }
  }
  if (cur.length) out.push(cur.join(" "));
  return out;
}

/* ---------------------------------------------------------------- blocks */

const DROP_CAP =
  "first-letter:float-left first-letter:mr-[0.08em] first-letter:mt-[0.06em] first-letter:font-semibold first-letter:text-[3.05em] first-letter:leading-[0.8] first-letter:text-(--primary)";

const HEADING: Record<number, string> = {
  1: "mt-[1.3em] mb-[0.5em] text-[1.5em] leading-[1.15]",
  2: "mt-[1.45em] mb-[0.55em] text-[1.24em] leading-[1.2] after:mt-[0.42em] after:block after:h-px after:bg-(--line)",
  3: "mt-[1.3em] mb-[0.35em] text-[1.06em] leading-[1.25]",
};

export function renderBlocks(blocks: Block[]): ReactNode[] {
  return blocks.map((b, bi) => {
    const k = `b${bi}`;
    switch (b.t) {
      case "p":
        return (
          <p key={k} className={cx("mb-[0.95em]", bi === 0 && DROP_CAP)}>
            {renderInline(b.text, k)}
          </p>
        );
      case "h":
        return (
          <div
            key={k}
            data-hidx={b.idx}
            className={cx(
              "font-serif font-semibold tracking-[-0.015em] text-balance text-(--fg) first:mt-0",
              HEADING[Math.min(3, b.level)],
            )}
          >
            {renderInline(b.text, k)}
          </div>
        );
      case "hr":
        return (
          <div key={k} role="separator" className="my-[1.7em] flex items-center justify-center gap-[1em]">
            <span className="h-px w-[26%] bg-(--line-strong)" />
            <span aria-hidden className="font-serif text-[1.3em] leading-none text-(--primary)">
              {"❦"}
            </span>
            <span className="h-px w-[26%] bg-(--line-strong)" />
          </div>
        );
      case "quote":
        return (
          <blockquote key={k} className="my-[1.15em] border-l-2 border-(--primary) pl-[0.95em] italic text-(--muted-fg)">
            {paragraphs(b.lines).map((para, pi) => (
              <p key={pi} className="mb-[0.5em] last:mb-0">
                {renderInline(para, `${k}.${pi}`)}
              </p>
            ))}
          </blockquote>
        );
      case "callout": {
        const meta = CALLOUTS[b.kind] ?? CALLOUTS.note;
        return (
          <div key={k} className="my-[1.15em] rounded-xl border border-(--callout-line) bg-(--callout) px-[0.95em] py-[0.8em] shadow-[inset_0_1px_0_color-mix(in_oklab,white_45%,transparent)]">
            <div className="mb-[0.45em] flex items-center gap-[0.45em] font-ui text-[0.64em] font-semibold uppercase tracking-[0.15em] text-(--primary-ink)">
              <meta.Icon aria-hidden weight="bold" className="size-[1.3em]" />
              {b.title || meta.label}
            </div>
            {paragraphs(b.lines).map((para, pi) => (
              <p key={pi} className="mb-[0.45em] text-[0.95em] leading-[1.6] last:mb-0">
                {renderInline(para, `${k}.${pi}`)}
              </p>
            ))}
          </div>
        );
      }
      case "ul": {
        const tasks = b.items.some((it) => it.task !== null);
        if (tasks) {
          return (
            <ul key={k} className="my-[0.8em] flex flex-col gap-[0.32em]">
              {b.items.map((it, ii) => {
                const done = it.task === true;
                return (
                  <li key={ii} className="flex items-start gap-[0.6em]">
                    <span
                      aria-hidden
                      className={cx(
                        "mt-[0.32em] grid size-[0.95em] shrink-0 place-items-center rounded-[0.24em]",
                        done
                          ? "bg-(--primary) text-white shadow-[0_1px_2px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
                          : "border-[1.5px] border-(--box-line) bg-(--sheet)",
                      )}
                    >
                      {done && <Check weight="bold" className="size-[0.7em]" />}
                    </span>
                    <span className={cx("min-w-0", done && "text-(--muted-fg) line-through decoration-(--line-strong)")}>
                      <span className="sr-only">{done ? "Done: " : "To do: "}</span>
                      {renderInline(it.text, `${k}.${ii}`)}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }
        return (
          <ul key={k} className="my-[0.8em] list-disc pl-[1.2em] marker:text-(--primary)">
            {b.items.map((it, ii) => (
              <li key={ii} className="my-[0.28em] pl-[0.2em]">
                {renderInline(it.text, `${k}.${ii}`)}
              </li>
            ))}
          </ul>
        );
      }
      case "ol":
        return (
          <ol
            key={k}
            start={b.start}
            className="my-[0.8em] list-decimal pl-[1.35em] marker:font-medium marker:text-(--primary-ink)"
          >
            {b.items.map((it, ii) => (
              <li key={ii} className="my-[0.3em] pl-[0.2em]">
                {renderInline(it.text, `${k}.${ii}`)}
              </li>
            ))}
          </ol>
        );
      case "code":
        return <CodeCard key={k} lang={b.lang} code={b.code} />;
      case "mermaid":
        return <MermaidCard key={k} code={b.code} />;
    }
  });
}

/* ------------------------------------------------------- source overlay */

const S = {
  mark: "text-(--faint)",
  head: "font-semibold text-(--primary-ink)",
  code: "text-(--src-code)",
  lang: "text-(--primary-ink)",
  link: "text-(--primary-ink)",
  wiki: "rounded-[0.2em] bg-(--tint) text-(--primary-ink)",
  math: "text-(--indigo)",
  list: "text-(--primary-ink)",
  quote: "text-(--muted-fg)",
  strong: "font-semibold text-(--fg)",
};

/** Highlights one line of inline Markdown, keeping every character. */
function inlineSource(src: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let n = 0;
  const k = () => `${key}.${n++}`;
  const push = (node: ReactNode) => {
    if (buf) {
      out.push(buf);
      buf = "";
    }
    out.push(node);
  };
  const mark = (text: string) => (
    <span key={k()} className={S.mark}>
      {text}
    </span>
  );

  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "`") {
      const end = src.indexOf("`", i + 1);
      if (end > i + 1) {
        push(
          <span key={k()} className={S.code}>
            {mark("`")}
            {src.slice(i + 1, end)}
            {mark("`")}
          </span>,
        );
        i = end + 1;
        continue;
      }
    }
    if (c === "$") {
      const end = src.indexOf("$", i + 1);
      if (end > i + 1) {
        push(
          <span key={k()} className={S.math}>
            {src.slice(i, end + 1)}
          </span>,
        );
        i = end + 1;
        continue;
      }
    }
    if (c === "[" && src[i + 1] === "[") {
      const end = src.indexOf("]]", i + 2);
      if (end > i + 2) {
        push(
          <Fragment key={k()}>
            {mark("[[")}
            <span className={S.wiki}>{src.slice(i + 2, end)}</span>
            {mark("]]")}
          </Fragment>,
        );
        i = end + 2;
        continue;
      }
    }
    if (c === "[") {
      const close = src.indexOf("]", i + 1);
      if (close > i + 1 && src[close + 1] === "(") {
        const end = src.indexOf(")", close + 2);
        if (end > close + 1) {
          push(
            <Fragment key={k()}>
              {mark("[")}
              <span className={S.link}>{src.slice(i + 1, close)}</span>
              {mark(src.slice(close, end + 1))}
            </Fragment>,
          );
          i = end + 1;
          continue;
        }
      }
    }
    if ((c === "*" || c === "_") && src[i + 1] === c) {
      const end = src.indexOf(c + c, i + 2);
      if (end > i + 2) {
        push(
          <Fragment key={k()}>
            {mark(c + c)}
            <span className={S.strong}>{src.slice(i + 2, end)}</span>
            {mark(c + c)}
          </Fragment>,
        );
        i = end + 2;
        continue;
      }
    }
    if (c === "*" || (c === "_" && !isWordChar(src[i - 1]))) {
      const end = findSingle(src, c, i + 1);
      if (end > i + 1 && src[i + 1] !== " " && src[end - 1] !== " ") {
        push(
          <Fragment key={k()}>
            {mark(c)}
            <span className="italic">{src.slice(i + 1, end)}</span>
            {mark(c)}
          </Fragment>,
        );
        i = end + 1;
        continue;
      }
    }
    buf += c;
    i++;
  }
  if (buf) out.push(buf);
  return out;
}

/**
 * The tinted mirror that sits under the transparent textarea. It must keep
 * the exact characters of `src` so wrapping matches the textarea line for
 * line. Heading lines carry `data-hidx` so the Spine can track them in Edit.
 */
export function renderSource(src: string, caretLine: number | null, caret: ReactNode): ReactNode[] {
  const lines = src.split("\n");
  const out: ReactNode[] = [];
  let fence: RegExp | null = null;
  let headingIdx = 0;

  lines.forEach((line, li) => {
    const k = `l${li}`;
    let node: ReactNode = line;

    if (fence) {
      if (fence.test(line)) {
        fence = null;
        node = <span className={S.mark}>{line}</span>;
      } else {
        node = <span className={S.code}>{line}</span>;
      }
    } else {
      const open = RX.fence.exec(line);
      const heading = open ? null : RX.headingParts.exec(line);
      if (open) {
        fence = fenceCloser(open[2]);
        const cut = open[1].length + open[2].length;
        node = (
          <>
            <span className={S.mark}>{line.slice(0, cut)}</span>
            <span className={S.lang}>{line.slice(cut)}</span>
          </>
        );
      } else if (heading && RX.heading.test(line)) {
        const hasText = !!RX.heading.exec(line)?.[2].trim();
        node = hasText ? (
          <span data-hidx={headingIdx++} className={S.head}>
            <span className={S.mark}>{heading[1]}</span>
            {heading[2]}
          </span>
        ) : (
          <span className={S.mark}>{line}</span>
        );
      } else if (RX.hr.test(line)) {
        node = <span className={S.mark}>{line}</span>;
      } else if (RX.quote.test(line)) {
        const q = RX.quoteParts.exec(line);
        const body = q?.[2] ?? "";
        const callout = /^\[!\w+\]/.exec(body);
        node = (
          <>
            <span className={S.list}>{q?.[1] ?? ""}</span>
            {callout ? (
              <>
                <span className={S.head}>{callout[0]}</span>
                {inlineSource(body.slice(callout[0].length), k)}
              </>
            ) : (
              <span className={S.quote}>{inlineSource(body, k)}</span>
            )}
          </>
        );
      } else {
        const bullet = RX.ul.exec(line) ?? RX.ol.exec(line);
        if (bullet) {
          const rest = line.slice(bullet[0].length);
          const box = RX.ul.test(line) ? RX.task.exec(rest) : null;
          node = (
            <>
              <span className={S.list}>{bullet[0]}</span>
              {box && <span className={S.list}>{box[0]}</span>}
              {inlineSource(box ? rest.slice(box[0].length) : rest, k)}
            </>
          );
        } else if (line) {
          node = inlineSource(line, k);
        }
      }
    }

    out.push(
      <Fragment key={k}>
        {node}
        {li === caretLine ? caret : null}
        {li < lines.length - 1 ? "\n" : null}
      </Fragment>,
    );
  });

  return out;
}
