"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useReducedMotion from "@/components/learn/useReducedMotion";

/** How long the glide from B to C takes: prices adjust slowly, or at once. */
export const GLIDE_SLOW_MS = 1800;
export const GLIDE_FAST_MS = 450;

const ease = (k: number) => 1 - Math.pow(1 - k, 2);

/**
 * Drives the playback position t (0 = A, 1 = B, last = C) for the A / B / C buttons and
 * "Play A to C". Positions are whole numbers; the chart tweens the curves between them.
 */
export function usePlayer(setT: (t: number) => void) {
  const reduced = useReducedMotion();
  const raf = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(false);
  }, []);
  useEffect(() => stop, [stop]);

  /** From B (or `from`) to C: step through the price adjustment, then land on the last position. */
  const toC = useCallback((from: number, settle: number, last: number, ms: number, onDone?: () => void) => {
    if (reduced) { setT(last); onDone?.(); return; }
    const t0 = performance.now();
    const start = Math.max(1, from);
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      if (k >= 1) { setT(last); setPlaying(false); onDone?.(); return; }
      setT(Math.round(start + (settle - start) * ease(k)));
      raf.current = requestAnimationFrame(tick);
    };
    setPlaying(true);
    raf.current = requestAnimationFrame(tick);
  }, [reduced, setT]);

  const goA = useCallback(() => { stop(); setT(0); }, [stop, setT]);
  const goB = useCallback(() => { stop(); setT(1); }, [stop, setT]);
  const goC = useCallback((from: number, settle: number, last: number, ms: number) => {
    stop();
    toC(from, settle, last, ms);
  }, [stop, toC]);

  /** A, hold, B, hold, then prices adjust to C. */
  const playAll = useCallback((settle: number, last: number, ms: number) => {
    stop();
    setT(0);
    if (reduced) { setT(last); return; }
    setPlaying(true);
    timers.current.push(setTimeout(() => setT(1), 500));
    timers.current.push(setTimeout(() => toC(1, settle, last, ms), 1500));
  }, [stop, setT, reduced, toC]);

  return { playing, stop, goA, goB, goC, playAll };
}
