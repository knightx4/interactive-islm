import { describe, expect, it } from "vitest";
import { linearScale, niceTicks, nudgeLabels, sample } from "./geometry";

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
