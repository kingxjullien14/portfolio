"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowsOutSimple,
  CaretRight,
  DotsThree,
  DotsThreeVertical,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  House,
  MagnifyingGlass,
  Minus,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useImperativeHandle, useRef, useState, type KeyboardEvent, type Ref } from "react";
import s from "./osai.module.css";
import { DEFAULT_OPEN, EXT_COLOR, TREE, type Git, type TreeNode } from "./data";
import { cx, f, Ico } from "./ui";

export type FilesApi = { reveal: (path: string) => void; focusFilter: () => void };

type Row = { node: TreeNode; depth: number; dir: boolean; open: boolean; parent: string | null };

const GIT_COLOR: Record<Git, string> = {
  M: "var(--o-warning)",
  A: "var(--o-success)",
  U: "var(--o-muted)",
};

function hasGit(node: TreeNode): boolean {
  return !!node.git || !!node.children?.some(hasGit);
}

/** Visible rows for the current open set, or every match (plus ancestors) while filtering. */
function flatten(node: TreeNode, depth: number, parent: string | null, open: Set<string>, q: string, out: Row[]): boolean {
  const dir = !!node.children;
  const self = !q || node.name.toLowerCase().includes(q);
  if (!dir) {
    if (self) out.push({ node, depth, dir, open: false, parent });
    return self;
  }
  const isOpen = depth === 0 || !!q || open.has(node.path);
  const at = out.length;
  out.push({ node, depth, dir, open: isOpen, parent });
  let any = false;
  if (isOpen) {
    for (const child of node.children ?? []) {
      if (flatten(child, depth + 1, node.path, open, q, out)) any = true;
    }
  }
  if (q && depth > 0 && !any && !self) {
    out.splice(at);
    return false;
  }
  return any || self;
}

function fileIcon(name: string) {
  const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
  const color = EXT_COLOR[ext] ?? "var(--o-muted)";
  if (ext === "md") return { icon: FileText, color };
  if (ext === "ts" || ext === "json" || ext === "yaml" || ext === "yml") return { icon: FileCode, color };
  return { icon: File, color };
}

function ChromeButton({ icon }: { icon: typeof X }) {
  return (
    <span className="grid size-6 place-items-center rounded-md text-(--o-muted) transition-colors hover:bg-(--o-panel-2) hover:text-(--o-text)">
      <Ico icon={icon} className="size-3.25" />
    </span>
  );
}

export function FilesWindow({ ref }: { ref?: Ref<FilesApi> }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(DEFAULT_OPEN));
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState("src/webhooks/payout.ts");
  const [flash, setFlash] = useState<{ path: string; key: number } | null>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());

  const q = filter.trim().toLowerCase();
  const rows: Row[] = [];
  flatten(TREE, 0, null, open, q, rows);
  const tabStop = rows.some((r) => r.node.path === selected) ? selected : (rows[0]?.node.path ?? "");

  useImperativeHandle(
    ref,
    () => ({
      reveal: (path: string) => {
        const parts = path.split("/");
        setOpen((prev) => {
          const next = new Set(prev);
          for (let i = 1; i < parts.length; i++) next.add(parts.slice(0, i).join("/"));
          return next;
        });
        setFilter("");
        setSelected(path);
        setFlash((prev) => ({ path, key: (prev?.key ?? 0) + 1 }));
      },
      focusFilter: () => filterRef.current?.focus({ preventScroll: true }),
    }),
    [],
  );

  const toggle = (path: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  const moveTo = (path: string | null | undefined) => {
    if (path == null) return;
    setSelected(path);
    rowRefs.current.get(path)?.focus({ preventScroll: true });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>, row: Row, i: number) => {
    const key = e.key;
    if (key === "ArrowDown") moveTo(rows[i + 1]?.node.path);
    else if (key === "ArrowUp") moveTo(rows[i - 1]?.node.path);
    else if (key === "Home") moveTo(rows[0]?.node.path);
    else if (key === "End") moveTo(rows[rows.length - 1]?.node.path);
    else if (key === "ArrowRight") {
      if (row.dir && !row.open) toggle(row.node.path);
      else if (row.dir && rows[i + 1]?.parent === row.node.path) moveTo(rows[i + 1].node.path);
    } else if (key === "ArrowLeft") {
      if (row.dir && row.open && row.depth > 0 && !q) toggle(row.node.path);
      else moveTo(row.parent);
    } else if (key === "Enter" || key === " ") {
      if (row.dir && row.depth > 0) toggle(row.node.path);
    } else return;
    e.preventDefault();
  };

  return (
    <section
      aria-label="files window"
      className={cx(s.window, "absolute top-10.5 left-149 z-20 flex h-137 w-81 flex-col overflow-hidden rounded-lg")}
    >
      {/* window chrome: the 28px title strip */}
      <div className={cx(s.chrome, "flex h-7 shrink-0 items-center justify-between border-b border-(--o-border) pr-1.5 pl-2.5")}>
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#555] opacity-60" aria-hidden />
          <span className={cx("truncate font-mono text-(--o-muted)", f.s11)}>files</span>
        </div>
        <div className="flex items-center gap-0.5" aria-hidden>
          <ChromeButton icon={DotsThreeVertical} />
          <ChromeButton icon={Minus} />
          <ChromeButton icon={ArrowsOutSimple} />
          <ChromeButton icon={X} />
        </div>
      </div>

      {/* in-pane toolbar: history, breadcrumbs, git chip */}
      <div className="flex h-9 shrink-0 items-center gap-0.5 border-b border-(--o-border) bg-(--o-panel)/40 px-1.5 text-(--o-muted)">
        <span className="grid size-6 place-items-center opacity-30" aria-hidden>
          <Ico icon={ArrowLeft} className="size-3.25" />
        </span>
        <span className="grid size-6 place-items-center opacity-30" aria-hidden>
          <Ico icon={ArrowRight} className="size-3.25" />
        </span>
        <span className="grid size-6 place-items-center" aria-hidden>
          <Ico icon={House} className="size-3.25" />
        </span>
        <span className="mx-1 h-4 w-px shrink-0 bg-(--o-border)" aria-hidden />
        <p className={cx("flex min-w-0 flex-1 items-center gap-1.5 font-mono", f.s11)} aria-label="path ~/code/payout-service">
          <span className="truncate">
            <span className="text-(--o-muted)">~/code/</span>
            <span className="font-medium text-(--o-text-2)">payout-service</span>
          </span>
          <span className="shrink-0 rounded-sm border border-(--o-cyan)/32 px-1.5 py-0.5 leading-none text-(--o-cyan) text-3xs">git</span>
        </p>
        <span className="grid size-6 shrink-0 place-items-center rounded-md" aria-hidden>
          <Ico icon={DotsThree} className="size-3.25" />
        </span>
      </div>

      {/* filter rail */}
      <div className="flex shrink-0 items-center gap-1.5 border-b border-(--o-border) px-2 py-1.5">
        <div className="relative min-w-0 flex-1">
          <Ico icon={MagnifyingGlass} className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-(--o-faint)" />
          <input
            ref={filterRef}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && filter) {
                e.preventDefault();
                setFilter("");
              }
            }}
            placeholder="filter files"
            aria-label="Filter files"
            spellCheck={false}
            autoComplete="off"
            className={cx(
              "w-full rounded-lg border border-(--o-border) bg-(--o-bg)/70 py-1 pr-6 pl-7 text-(--o-text) outline-none transition-colors duration-150 placeholder:text-(--o-faint) focus:border-(--o-accent)/60",
              f.s12,
            )}
          />
          {filter ? (
            <button
              type="button"
              onClick={() => {
                setFilter("");
                filterRef.current?.focus({ preventScroll: true });
              }}
              aria-label="Clear filter"
              className="absolute top-1/2 right-1 grid size-4 -translate-y-1/2 place-items-center rounded-sm text-(--o-faint) hover:text-(--o-text)"
            >
              <Ico icon={X} className="size-2.75" />
            </button>
          ) : null}
        </div>
        <span
          className="shrink-0 rounded-full border border-(--o-border) px-2 py-0.5 tracking-wide text-(--o-faint) uppercase text-[length:calc(var(--mu)*9)]"
          aria-hidden
        >
          junk
        </span>
      </div>

      {/* the tree */}
      <div role="tree" aria-label="payout-service" className={cx("min-h-0 flex-1 overflow-y-auto py-1 font-mono", f.s12)}>
        {rows.length <= 1 && q ? (
          <p className={cx("px-4 py-3 text-(--o-faint) italic", f.s115)}>no files match “{filter.trim()}”</p>
        ) : null}
        {rows.map((row, i) => {
          const { node, depth, dir } = row;
          const isSel = node.path === selected;
          const dirty = dir && depth > 0 && hasGit(node);
          const fi = dir ? null : fileIcon(node.name);
          const flashing = flash?.path === node.path;
          const nameColor = node.git ? GIT_COLOR[node.git] : "var(--o-text-2)";
          return (
            <div
              key={flashing ? `${node.path}#${flash?.key}` : node.path || "root"}
              ref={(el) => {
                if (el) rowRefs.current.set(node.path, el);
                else rowRefs.current.delete(node.path);
              }}
              role="treeitem"
              aria-level={depth + 1}
              aria-expanded={dir ? row.open : undefined}
              aria-selected={isSel}
              tabIndex={node.path === tabStop ? 0 : -1}
              onClick={() => {
                setSelected(node.path);
                if (dir && depth > 0) toggle(node.path);
              }}
              onKeyDown={(e) => onKey(e, row, i)}
              onFocus={() => {
                if (!isSel) setSelected(node.path);
              }}
              className={cx(
                s.treeRow,
                "group flex h-5.75 cursor-default items-center gap-1 pr-2.5 pl-2 transition-colors duration-100",
                flashing && s.flash,
                isSel
                  ? "bg-(--o-accent)/13 shadow-[inset_calc(var(--mu)*2)_0_0_var(--o-accent)]"
                  : "hover:bg-(--o-accent)/6",
              )}
            >
              {Array.from({ length: depth }, (_, g) => (
                <span key={g} className="h-full w-3 shrink-0 border-l border-(--o-border)" aria-hidden />
              ))}
              {dir ? (
                <Ico
                  icon={CaretRight}
                  className={cx("size-3 shrink-0 text-(--o-faint) transition-transform duration-150", row.open && "rotate-90")}
                />
              ) : (
                <span className="w-3 shrink-0" aria-hidden />
              )}
              {dir ? (
                <Ico icon={row.open ? FolderOpen : Folder} className="size-3.5 shrink-0 text-(--o-muted)" />
              ) : (
                <span style={{ color: fi!.color }} className="grid shrink-0 place-items-center">
                  <Ico icon={fi!.icon} className="size-3.5" />
                </span>
              )}
              <span
                className={cx("min-w-0 flex-1 truncate pl-0.5", (node.git || dirty || depth === 0) && "font-medium")}
                style={{ color: isSel ? "var(--o-text)" : depth === 0 ? "var(--o-text)" : nameColor }}
              >
                {node.name}
              </span>
              {node.git ? (
                <span className={cx("shrink-0", f.s10)} style={{ color: GIT_COLOR[node.git] }} aria-label={node.git === "M" ? "modified" : node.git === "A" ? "added" : "untracked"}>
                  {node.git}
                </span>
              ) : dirty ? (
                <span className="size-1.5 shrink-0 rounded-full bg-(--o-warning)/80" aria-hidden />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
