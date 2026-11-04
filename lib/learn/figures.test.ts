import { describe, expect, it } from "vitest";
import { figureFor, STAGES, stageOfSection } from "./figures";
import { lessons } from "./lessons";
import { shockById, shocksFor } from "../macro/shocks";

describe("lesson figures", () => {
  it("every lesson has a valid shock for its economy", () => {
    for (const l of lessons.filter((x) => x.kind !== "practice")) {
      const f = figureFor(l);
      const s = shockById(f.shockId);
      expect(s, `${l.slug}: ${f.shockId}`).toBeDefined();
      expect(shocksFor(f.regime), `${l.slug}`).toContain(s);
    }
  });
  it("covers all thirteen lessons", () => {
    expect(lessons.filter((x) => x.kind !== "practice")).toHaveLength(13);
  });
  it("spreads sections evenly over the four stages", () => {
    expect([0, 1, 2, 3].map((i) => stageOfSection(i, 4))).toEqual([0, 1, 2, 3]);
    expect(stageOfSection(0, 1)).toBe(0);
    expect([0, 1, 2, 3, 4].map((i) => stageOfSection(i, 5))).toEqual([0, 1, 2, 2, 3]);
    expect(Math.max(...[...Array(9).keys()].map((i) => stageOfSection(i, 9)))).toBe(STAGES.length - 1);
  });
});
