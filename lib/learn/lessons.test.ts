import { describe, expect, it } from "vitest";
import { legacySlugs, lessonBySlug, lessons, parts } from "./lessons";
import { news, realWorld } from "./context";
import { shocksFor, workedShockIds, shockById } from "../macro/shocks";

describe("the course outline", () => {
  const numbered = lessons.filter((l) => l.n > 0);
  it("has thirteen numbered lessons in order, in four parts, plus the Practice page last", () => {
    expect(numbered.map((l) => l.n)).toEqual(Array.from({ length: 13 }, (_, i) => i + 1));
    expect(parts).toHaveLength(4);
    expect(numbered.map((l) => l.part)).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]);
    expect(lessons[lessons.length - 1]).toMatchObject({ slug: "practice", kind: "practice", part: 4 });
    expect(new Set(lessons.map((l) => l.slug)).size).toBe(lessons.length);
  });
  it("sends every old address to a lesson that exists", () => {
    for (const k of ["islm", "productivity", "labor-market", "fx"]) expect(legacySlugs[k]).toBeDefined();
    for (const [from, to] of Object.entries(legacySlugs)) {
      expect(lessonBySlug(to), `${from} -> ${to}`).toBeDefined();
      expect(lessonBySlug(from), `${from} must not also be a lesson`).toBeUndefined();
    }
  });
  it("gives every lab real shocks that fit its economy", () => {
    for (const l of lessons.filter((x) => x.lab)) {
      const lab = l.lab!;
      expect(lab.shocks).toContain(lab.defaultShock);
      for (const id of lab.shocks) {
        expect(shockById(id), id).toBeDefined();
        expect(shocksFor(lab.regime).some((s) => s.id === id), `${l.slug}: ${id}`).toBe(true);
      }
    }
  });
  it("plays the recipe on a money rise and a spending rise on the IS-LM-FE page, and offers every shifter in its sandbox", () => {
    const secs = lessonBySlug("is-lm-fe")!.sections!;
    expect(secs.map((s) => s.widget)).toEqual(expect.arrayContaining(["recipe-two", "money-neutrality", "price-lm", "lm-puzzle", "ge-sandbox"]));
    expect(secs[secs.length - 1].widget).toBe("ge-sandbox");
  });
  it("has a real-world note and a headline for each worked shock", () => {
    for (const id of workedShockIds) {
      expect(realWorld[id], id).toBeDefined();
      expect(news.some((n) => n.shockId === id), id).toBe(true);
    }
  });
  it("keeps written lessons well formed: no colon in a title, valid prediction answers, known widgets", () => {
    const known = new Set(["three-ways", "expenditure-sorter", "imports-demo", "real-nominal", "cpi-basket"]);
    for (const l of lessons) {
      expect(l.title, l.slug).not.toContain(":");
      for (const sec of l.sections ?? []) {
        expect(sec.heading, l.slug).not.toContain(":");
        if (sec.widget) expect(known.has(sec.widget) || sec.widget.length > 0, sec.widget).toBe(true);
      }
      for (const p of l.predictions ?? []) {
        expect(p.answer).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBeLessThan(p.options.length);
      }
    }
  });
});
