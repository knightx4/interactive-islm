"use client";

import { isR, lmR, type Frame, type Params, type Simulation } from "@/lib/macro/model";

const W = 420, H = 320, PAD = { l: 44, r: 14, t: 14, b: 36 };
const X0 = 60, X1 = 140, R0 = 0, R1 = 10;
const sx = (y: number) => PAD.l + ((y - X0) / (X1 - X0)) * (W - PAD.l - PAD.r);
const sy = (r: number) => H - PAD.b - ((r - R0) / (R1 - R0)) * (H - PAD.t - PAD.b);

function line(f: (y: number) => number) {
  return `M${sx(X0)},${sy(f(X0))} L${sx(X1)},${sy(f(X1))}`;
}

function curvesFor(p: Params, fr: Frame) {
  return {
    is: (y: number) => isR(p, y, fr.q),
    lm: (y: number) => lmR(p, y, fr.Meff / fr.P),
  };
}

export default function CurvesFigure({ sim, index }: { sim: Simulation; index: number }) {
  const fr = sim.frames[index];
  const params = index === 0 ? sim.before : sim.after;
  const now = curvesFor(params, fr);
  const base = curvesFor(sim.before, sim.baseline);
  const open = params.regime !== "closed";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="IS, LM and FE curves">
      <defs>
        <clipPath id="plot">
          <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} />
        </clipPath>
      </defs>
      <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} fill="none" stroke="#d1d5db" />
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#4b5563">Output Y</text>
      <text x={12} y={H / 2} textAnchor="middle" fontSize="12" fill="#4b5563" transform={`rotate(-90 12 ${H / 2})`}>Interest rate r (%)</text>
      <g clipPath="url(#plot)" fill="none" strokeWidth="2.5">
        {/* ghost baseline */}
        <path d={line(base.is)} stroke="#93c5fd" strokeDasharray="4 4" />
        <path d={line(base.lm)} stroke="#fca5a5" strokeDasharray="4 4" />
        <line x1={sx(sim.baseline.Ystar)} x2={sx(sim.baseline.Ystar)} y1={PAD.t} y2={H - PAD.b} stroke="#86efac" strokeDasharray="4 4" />
        {open && <line x1={sx(X0)} x2={sx(X1)} y1={sy(params.rw)} y2={sy(params.rw)} stroke="#9ca3af" strokeDasharray="2 4" />}
        {/* current */}
        <path d={line(now.is)} stroke="#2563eb" />
        <path d={line(now.lm)} stroke="#dc2626" />
        <line x1={sx(fr.Ystar)} x2={sx(fr.Ystar)} y1={PAD.t} y2={H - PAD.b} stroke="#16a34a" strokeWidth="2.5" />
      </g>
      <text x={W - 20} y={sy(now.is(X1)) - 4} fontSize="12" fill="#2563eb" textAnchor="end">IS</text>
      <text x={W - 20} y={Math.max(PAD.t + 12, sy(now.lm(X1)) + 14)} fontSize="12" fill="#dc2626" textAnchor="end">LM</text>
      <text x={sx(fr.Ystar) + 4} y={PAD.t + 12} fontSize="12" fill="#16a34a">FE</text>
      <circle cx={sx(fr.Y)} cy={sy(fr.r)} r="6" fill="#111827" style={{ transition: "all 120ms linear" }} />
      <text x={PAD.l} y={H - PAD.b + 14} fontSize="10" fill="#6b7280">{X0}</text>
      <text x={W - PAD.r} y={H - PAD.b + 14} fontSize="10" fill="#6b7280" textAnchor="end">{X1}</text>
      <text x={PAD.l - 4} y={sy(R0)} fontSize="10" fill="#6b7280" textAnchor="end">{R0}</text>
      <text x={PAD.l - 4} y={sy(R1) + 8} fontSize="10" fill="#6b7280" textAnchor="end">{R1}</text>
    </svg>
  );
}
