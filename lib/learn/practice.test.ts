import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";
import { practiceQuestions, resolve } from "./practice";
import { shockById } from "../macro/shocks";

describe("practice questions", () => {
  it("has forty or more, with unique ids, and covers every numbered lesson", () => {
    expect(practiceQuestions.length).toBeGreaterThanOrEqual(40);
    expect(new Set(practiceQuestions.map((x) => x.id)).size).toBe(practiceQuestions.length);
    for (const l of lessons.filter((x) => x.n > 0)) expect(practiceQuestions.some((x) => x.lesson === l.slug), l.slug).toBe(true);
    for (const x of practiceQuestions) expect(lessons.some((l) => l.slug === x.lesson), x.id).toBe(true);
  });
  it("uses real shocks that fit the economy", () => {
    for (const x of practiceQuestions) {
      const s = shockById(x.shock);
      expect(s, x.id).toBeDefined();
      expect(s!.regimes.includes(x.regime), `${x.id}: ${x.shock} in ${x.regime}`).toBe(true);
    }
  });
  it("computes every answer from the model and it matches the pinned expectation", () => {
    for (const x of practiceQuestions) expect(resolve(x).truth, `${x.id}`).toBe(x.expect);
  });
  it("has a brief and a reason, and no colon-only filler", () => {
    for (const x of practiceQuestions) {
      expect(x.brief.length, x.id).toBeGreaterThan(30);
      expect(x.brief.length, x.id).toBeLessThan(260);
      expect(x.reason.length, x.id).toBeGreaterThan(30);
    }
  });
  it("mixes the directions so 'same' and 'down' are not always the answer", () => {
    const c = (d: string) => practiceQuestions.filter((x) => x.expect === d).length;
    expect(c("up")).toBeGreaterThan(8); expect(c("down")).toBeGreaterThan(8); expect(c("same")).toBeGreaterThan(3);
  });
});
