"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkspaceShellProps {
  controls: ReactNode;
  chartArea: ReactNode;
  className?: string;
}

const MIN_PANE_PX = 320;
const MAX_PANE_PX = 540;
const DEFAULT_PANE_PX = 360;

export default function WorkspaceShell({
  controls,
  chartArea,
  className,
}: WorkspaceShellProps) {
  const [leftPanePx, setLeftPanePx] = useState(DEFAULT_PANE_PX);
  const [isDragging, setIsDragging] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("islm.controlsPaneWidthPx");
    if (!saved) return;
    const parsed = Number(saved);
    if (Number.isFinite(parsed)) {
      setLeftPanePx(parsed);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("islm.controlsPaneWidthPx", String(leftPanePx));
  }, [leftPanePx]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (event: MouseEvent) => {
      const host = hostRef.current;
      if (!host) return;
      const bounds = host.getBoundingClientRect();
      const max = Math.min(MAX_PANE_PX, bounds.width * 0.5);
      const next = Math.min(Math.max(event.clientX - bounds.left, MIN_PANE_PX), max);
      setLeftPanePx(next);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const desktopColumns = useMemo(
    () => `${leftPanePx}px 10px minmax(0,1fr)`,
    [leftPanePx]
  );

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden sm:min-h-0 sm:h-full sm:max-h-full",
        className
      )}
    >
      <div
        ref={hostRef}
        className="hidden min-h-0 min-w-0 flex-1 overflow-hidden sm:grid sm:h-full sm:max-h-full sm:min-h-0 sm:grid-rows-1 sm:gap-0 sm:items-stretch"
        style={{ gridTemplateColumns: desktopColumns }}
      >
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden sm:h-full sm:max-h-full">
          {controls}
        </div>
        <button
          type="button"
          aria-label="Resize controls panel"
          onMouseDown={() => setIsDragging(true)}
          className={cn(
            "group relative cursor-col-resize",
            isDragging ? "bg-muted/70" : "bg-transparent"
          )}
        >
          <span className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-1 rounded-full bg-border group-hover:bg-primary/40" />
        </button>
        <div className="flex min-h-0 min-w-0 flex-col gap-2 overflow-hidden sm:h-full sm:min-h-0">
          {chartArea}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[clamp(440px,56svh,620px)_auto] gap-2 overflow-visible sm:hidden">
        <div className="flex h-full min-h-0 overflow-hidden [&>*]:h-full [&>*]:min-h-0 [&>*]:flex-1">{chartArea}</div>
        <div className="shrink-0">{controls}</div>
      </div>
    </div>
  );
}
