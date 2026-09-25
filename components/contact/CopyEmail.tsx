"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const t = document.createElement("textarea");
      t.value = email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button type="button" onClick={copy} className="keycap keycap-dark min-w-[9.5rem]">
      {copied ? <Check weight="bold" className="size-4 text-amber" aria-hidden /> : <Copy weight="bold" className="size-4" aria-hidden />}
      {copied ? "Copied" : "Copy address"}
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to the clipboard" : ""}
      </span>
    </button>
  );
}
