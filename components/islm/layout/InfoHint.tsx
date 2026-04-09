"use client";

import { useState } from "react";

interface InfoHintProps {
  text: string;
  className?: string;
}

export default function InfoHint({ text, className }: InfoHintProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className={`relative inline-flex ${className ?? ""}`}>
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-muted-foreground/35 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        aria-label="Show info"
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
      >
        i
      </button>
      {open && (
        <span className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 rounded-md border bg-popover px-2 py-1.5 text-[11px] font-normal leading-snug text-popover-foreground shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
