// A deliberately small Markdown reader for the Stone & Chisel recreation.
// It turns source text into plain data (blocks, headings, tokens); the React
// side (render.tsx) builds elements from that data, so user text is never
// injected as HTML.

export type ListItem = { text: string; task: boolean | null };

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; level: number; text: string; idx: number }
  | { t: "hr" }
  | { t: "quote"; lines: string[] }
  | { t: "callout"; kind: string; title: string; lines: string[] }
  | { t: "ul"; items: ListItem[] }
  | { t: "ol"; start: number; items: ListItem[] }
  | { t: "code"; lang: string; code: string }
  | { t: "mermaid"; code: string };

export type Heading = { idx: number; level: number; text: string };

/** Line classifiers, shared with the source highlighter so both agree. */
export const RX = {
  fence: /^(\s{0,3})(`{3,}|~{3,})[ \t]*([^`\s]*)/,
  heading: /^\s{0,3}(#{1,6})[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/,
  headingParts: /^(\s{0,3}#{1,6}[ \t]+)(.*)$/,
  hr: /^\s{0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/,
  quote: /^\s{0,3}>/,
  quoteParts: /^(\s{0,3}>[ \t]?)(.*)$/,
  callout: /^\[!(\w+)\][ \t]*(.*)$/,
  ul: /^\s*[-*+][ \t]+/,
  ol: /^\s*(\d{1,9})[.)][ \t]+/,
  task: /^\[([ xX])\](?:[ \t]+|$)/,
};

/** A regex that matches the closing line of a fence opened by `mark`. */
export function fenceCloser(mark: string): RegExp {
  const ch = mark[0] === "~" ? "~" : "`";
  return new RegExp(`^\\s{0,3}${ch}{${mark.length},}[ \\t]*$`);
}

function startsBlock(line: string): boolean {
  return (
    RX.fence.test(line) ||
    RX.heading.test(line) ||
    RX.hr.test(line) ||
    RX.quote.test(line) ||
    RX.ul.test(line) ||
    RX.ol.test(line)
  );
}

export function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out: Block[] = [];
  let headingIdx = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = RX.fence.exec(line);
    if (fence) {
      const close = fenceCloser(fence[2]);
      const lang = fence[3].toLowerCase();
      const body: string[] = [];
      i++;
      while (i < lines.length && !close.test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      i++; // the closing fence, or past the end of an unclosed one
      const code = body.join("\n");
      out.push(lang === "mermaid" ? { t: "mermaid", code } : { t: "code", lang, code });
      continue;
    }

    const heading = RX.heading.exec(line);
    if (heading) {
      const text = heading[2].trim();
      if (text) out.push({ t: "h", level: heading[1].length, text, idx: headingIdx++ });
      i++;
      continue;
    }

    if (RX.hr.test(line)) {
      out.push({ t: "hr" });
      i++;
      continue;
    }

    if (RX.quote.test(line)) {
      const body: string[] = [];
      while (i < lines.length && RX.quote.test(lines[i])) {
        body.push(lines[i].replace(/^\s{0,3}>[ \t]?/, ""));
        i++;
      }
      const callout = RX.callout.exec(body[0] ?? "");
      if (callout) {
        out.push({
          t: "callout",
          kind: callout[1].toLowerCase(),
          title: callout[2].trim(),
          lines: body.slice(1),
        });
      } else {
        out.push({ t: "quote", lines: body });
      }
      continue;
    }

    const ol = RX.ol.exec(line);
    if (RX.ul.test(line) || ol) {
      const ordered = !RX.ul.test(line);
      const marker = ordered ? RX.ol : RX.ul;
      const items: ListItem[] = [];
      while (i < lines.length) {
        const cur = lines[i];
        const m = marker.exec(cur);
        if (m) {
          let text = cur.slice(m[0].length);
          let task: boolean | null = null;
          const box = ordered ? null : RX.task.exec(text);
          if (box) {
            task = box[1] !== " ";
            text = text.slice(box[0].length);
          }
          items.push({ text, task });
          i++;
          continue;
        }
        // Lazy continuation: an indented line that does not start a block.
        if (items.length && cur.trim() && /^\s+\S/.test(cur) && !startsBlock(cur)) {
          const last = items[items.length - 1];
          items[items.length - 1] = { ...last, text: `${last.text} ${cur.trim()}` };
          i++;
          continue;
        }
        break;
      }
      out.push(ordered ? { t: "ol", start: Number(ol?.[1] ?? 1), items } : { t: "ul", items });
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && (para.length === 0 || !startsBlock(lines[i]))) {
      para.push(lines[i].trim());
      i++;
    }
    out.push({ t: "p", text: para.join(" ") });
  }

  return out;
}

/** Strip inline markup so a heading reads cleanly in the outline. */
export function plainInline(md: string): string {
  return md
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, "$2")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\$([^$]*)\$/g, "$1")
    .replace(/(\*\*|__|~~)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .trim();
}

export function headingsOf(blocks: Block[]): Heading[] {
  const out: Heading[] = [];
  for (const b of blocks) {
    if (b.t === "h") out.push({ idx: b.idx, level: b.level, text: plainInline(b.text) });
  }
  return out;
}

/** Same rule as the real app's counter: runs of letters, digits, _ ' -. */
export function countWords(src: string): number {
  return src.match(/[\p{L}\p{N}_'-]+/gu)?.length ?? 0;
}

export function formatCount(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Reads node labels out of simple mermaid chains (A --> B --> C). */
export function mermaidNodes(code: string): string[] {
  const nodes: string[] = [];
  for (const raw of code.split("\n")) {
    const line = raw.trim();
    if (!line || /^(flowchart|graph)\b/i.test(line) || line.startsWith("%%")) continue;
    for (const part of line.split(/\s*(?:-{2,}>|={2,}>|-\.+->|-{3,})\s*/)) {
      const bare = part.replace(/^\|[^|]*\|\s*/, "").trim();
      const shaped = /^[\w-]+\s*[[({]+\s*"?(.*?)"?\s*[\])}]+$/.exec(bare);
      const label = (shaped ? shaped[1] : bare).trim();
      if (label && !nodes.includes(label)) nodes.push(label);
    }
  }
  return nodes.slice(0, 6);
}

/* ------------------------------------------------------------ TypeScript */

export type TsKind = "kw" | "type" | "fn" | "str" | "num" | "com" | "punct" | "plain";
export type TsToken = { text: string; kind: TsKind };

const TS_KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "export", "import", "from", "default",
  "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "new",
  "type", "interface", "await", "async", "typeof", "keyof", "as", "of", "in", "class",
  "extends", "implements", "readonly", "private", "public", "this", "throw", "try", "catch",
]);
const TS_LITERALS = new Set(["true", "false", "null", "undefined", "void"]);
const TS_TYPES = new Set(["number", "string", "boolean", "unknown", "any", "never", "object", "bigint", "symbol"]);
const TS_TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g;

export function tokenizeTs(code: string): TsToken[] {
  const out: TsToken[] = [];
  const push = (text: string, kind: TsKind) => {
    const last = out[out.length - 1];
    if (last && last.kind === kind) out[out.length - 1] = { text: last.text + text, kind };
    else out.push({ text, kind });
  };
  for (const m of code.matchAll(TS_TOKEN)) {
    const [text, com, str, num, ident, space] = m;
    if (com) push(text, "com");
    else if (str) push(text, "str");
    else if (num) push(text, "num");
    else if (ident) {
      const after = code.slice((m.index ?? 0) + text.length).match(/^\s*(\S)/)?.[1];
      let kind: TsKind = "plain";
      if (TS_KEYWORDS.has(ident)) kind = "kw";
      else if (TS_LITERALS.has(ident)) kind = "num";
      else if (TS_TYPES.has(ident) || /^[A-Z]/.test(ident)) kind = "type";
      else if (after === "(") kind = "fn";
      push(text, kind);
    } else if (space) push(text, "plain");
    else push(text, "punct");
  }
  return out;
}
