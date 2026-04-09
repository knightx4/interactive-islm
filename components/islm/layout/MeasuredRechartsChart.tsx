"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type ChartChild = ReactElement<{ width?: number; height?: number }>;

/** Safe fallback so Recharts never sees 0/undefined width×height (avoids NaN in clip rects / offset). */
const DEFAULT_DIMS = { w: 800, h: 480 };

function clampSize(n: number, fallback: number): number {
  if (!Number.isFinite(n)) return fallback;
  return Math.max(88, Math.min(Math.floor(n), 4096));
}

/**
 * Recharts computes `state.offset` from props.width/height and axis sizes. If those are 0 or
 * axes are unmeasured (`undefined` width/height), offset math becomes NaN. We always pass numeric
 * chart dimensions and resize via ResizeObserver with sane clamps.
 */
export default function MeasuredRechartsChart({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState(DEFAULT_DIMS);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const read = () => {
      const el = shellRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const w = clampSize(r.width, DEFAULT_DIMS.w);
      const h = clampSize(r.height, DEFAULT_DIMS.h);
      setDims((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    read();
    const ro = new ResizeObserver(() => read());
    ro.observe(shell);

    let n = 0;
    const raf = () => {
      read();
      if (n++ < 32) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const poll = window.setInterval(read, 48);
    const stop = window.setTimeout(() => clearInterval(poll), 2500);

    return () => {
      ro.disconnect();
      clearInterval(poll);
      clearTimeout(stop);
    };
  }, []);

  const only = Children.only(children);
  if (!isValidElement(only)) return null;

  return (
    <div
      ref={shellRef}
      className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden [&_.recharts-wrapper]:!mx-auto"
    >
      {cloneElement(only as ChartChild, { width: dims.w, height: dims.h })}
    </div>
  );
}
