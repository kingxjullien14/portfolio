// Invented content for the Stone & Chisel recreation. Neutral, personal, and
// free of em and en dashes by design.

export const DOC_TITLE = "Carving a calm editor";

export const SAMPLE_DOC = [
  "Most notes apps want to be a second brain. I wanted a quiet desk: one sheet of paper, a good pen, and nothing that blinks while I think.",
  "",
  "## Why another notes app",
  "",
  "I tried the big ones. Each was clever, and each asked for attention in return: badges, spinners, a sidebar that never closed. So this one starts from the other end. *Take things away until it feels empty*, then add back only what earns a place on the desk.",
  "",
  "The test is simple. If a feature makes me look at the app instead of the page, it waits in a menu until I call for it.",
  "",
  "> [!note]",
  "> Every note is plain Markdown. If the app vanished tomorrow, the files would still open anywhere.",
  "",
  "## Three rules",
  "",
  "1. **Plain text first.** The source is [CommonMark](https://commonmark.org); formatting is only a view.",
  "2. **Nothing moves unless you move it.** No toasts, no confetti.",
  "3. **Links are cheap.** Typing [[Backlinks]] should cost nothing.",
  "",
  "## Split view, done properly",
  "",
  "Source on the left, page on the right. Both scroll together, so the line you are fixing is always the line you are reading. The outline on the far right keeps my place without asking for a click.",
  "",
  "> A good tool disappears into the work, the way a pen does.",
  "",
  "### Quiet saves",
  "",
  "Every keystroke calls `queueSave`. It waits for a pause of $t_{save} = 800ms$, then writes a version I can roll back to. No save button, no dialog, nothing lost when the tab closes.",
  "",
  "```ts",
  "let timer: number | undefined;",
  "",
  "export function queueSave(doc: Doc) {",
  "  window.clearTimeout(timer);",
  "  timer = window.setTimeout(() => {",
  "    save(doc).then(snapshot);",
  "  }, 800);",
  "}",
  "```",
  "",
  "### The flow",
  "",
  "```mermaid",
  "flowchart LR",
  "  Type --> Debounce --> Save --> Version",
  "```",
  "",
  "Each step is boring on purpose. Boring is what lets me stop thinking about it.",
  "",
  "---",
  "",
  "## Next",
  "",
  "- [x] Scroll sync that survives long code blocks",
  "- [x] Wiki links with hover previews",
  "- [ ] Let the spine fold long outlines",
  "- [ ] Write up today in [[Journal 2026-09-25]]",
  "",
  "Carve a little every day. The shape shows up on its own.",
].join("\n");

/** Appended to the end of the first line by the one-time typing flourish. */
export const TYPED_SNIPPET = " This is that desk.";

export const DOC_TAGS = [
  { name: "writing", color: "var(--primary)" },
  { name: "craft", color: "var(--indigo)" },
  { name: "stone-chisel", color: "var(--sage)" },
];

/* ------------------------------------------------------------- library */

export type LibNote = {
  title: string;
  kind: "md" | "mdx" | "journal";
  meta?: string;
  selected?: boolean;
};

export type LibFolder = {
  name: string;
  color: string;
  count: number;
  notes?: LibNote[];
};

export const LIB_TAGS = [
  { name: "writing", color: "var(--primary)" },
  { name: "craft", color: "var(--indigo)" },
  { name: "ideas", color: "var(--sage)" },
];

export const LIB_PINNED: LibNote[] = [{ title: "Reading list", kind: "md" }];

export const LIB_FOLDERS: LibFolder[] = [
  {
    name: "Writing",
    color: "var(--primary)",
    count: 7,
    notes: [
      { title: "Carving a calm editor", kind: "md", selected: true },
      { title: "On keeping notes", kind: "md" },
      { title: "Callout gallery", kind: "mdx" },
    ],
  },
  { name: "Projects", color: "var(--indigo)", count: 5 },
  { name: "Reading", color: "var(--sage)", count: 4 },
  {
    name: "Journal",
    color: "var(--amber)",
    count: 12,
    notes: [
      { title: "2026-09-25", kind: "journal", meta: "today" },
      { title: "2026-09-24", kind: "journal", meta: "Thu" },
    ],
  },
  { name: "Archive", color: "var(--faint)", count: 16 },
];
