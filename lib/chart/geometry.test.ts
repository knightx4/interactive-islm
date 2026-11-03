import { describe, expect, it } from "vitest";
import { linearScale, niceTicks, nudgeLabels, placeMarkLabels, sample } from "./geometry";

describe("chart geometry", () => {
  it("scales linearly and can invert the range", () => {
    const s = linearScale(0, 10, 100, 0);
    expect(s(0)).toBe(100);
    expect(s(10)).toBe(0);
    expect(s(5)).toBe(50);
  });
  it("gives nice ticks inside the domain", () => {
    expect(niceTicks(0, 10, 5)).toEqual([0, 2, 4, 6, 8, 10]);
    expect(niceTicks(60, 140, 4)).toEqual([60, 80, 100, 120, 140]);
    expect(niceTicks(0.3, 0.9, 3).every((t) => t >= 0.3 && t <= 0.9)).toBe(true);
  });
  it("separates colliding labels and keeps order and bounds", () => {
    const out = nudgeLabels([50, 52, 51], 14, 10, 200);
    const sorted = [...out].sort((a, b) => a - b);
    expect(sorted[1] - sorted[0]).toBeGreaterThanOrEqual(14);
    expect(sorted[2] - sorted[1]).toBeGreaterThanOrEqual(14);
    expect(out[0]).toBeLessThan(out[2]);
    expect(out[2]).toBeLessThan(out[1]);
  });
  it("pushes labels back inside the upper bound", () => {
    const out = nudgeLabels([195, 198], 14, 10, 200);
    expect(Math.max(...out)).toBeLessThanOrEqual(200);
    expect(Math.abs(out[1] - out[0])).toBeGreaterThanOrEqual(14);
  });
  it("samples endpoints", () => {
    expect(sample((x) => 2 * x, 0, 4, 3)).toEqual([{ x: 0, y: 0 }, { x: 2, y: 4 }, { x: 4, y: 8 }]);
  });
});

describe("placeMarkLabels", () => {
  const bounds = { x0: 0, x1: 400, y0: 0, y1: 300 };
  const hit = (a: { x: number; y: number }, ad: { dx: number; dy: number }, b: { x: number; y: number }, bd: { dx: number; dy: number }, w = 14) =>
    a.x + ad.dx < b.x + bd.dx + w && b.x + bd.dx < a.x + ad.dx + w && a.y + ad.dy - 12 < b.y + bd.dy + 3 && b.y + bd.dy - 12 < a.y + ad.dy + 3;
  it("keeps labels of coincident marks apart", () => {
    const pts = [{ x: 200, y: 150, w: 14 }, { x: 200, y: 150, w: 14 }, { x: 200, y: 150, w: 14 }];
    const off = placeMarkLabels(pts, bounds);
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) expect(hit(pts[i], off[i], pts[j], off[j])).toBe(false);
  });
  it("keeps labels inside the plot near an edge", () => {
    const off = placeMarkLabels([{ x: 395, y: 5, w: 14 }], bounds);
    expect(5 + off[0].dy - 12).toBeGreaterThanOrEqual(0);
    expect(395 + off[0].dx + 14).toBeLessThanOrEqual(400);
  });
});
