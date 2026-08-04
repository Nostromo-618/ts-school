import { describe, expect, it } from "vitest";
import {
  HISTORY_CHART_DISCLAIMER,
  adoptionLineMeta,
  adoptionLinePoints,
  milestones,
  stackShareMeta,
  stackSharePoints,
} from "@/data/history";

describe("history data", () => {
  it("keeps milestones in chronological order", () => {
    const keys = milestones.map((m) => m.sortKey);
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
  });

  it("covers javascript, node, typescript, and the checker pin", () => {
    const eras = new Set(milestones.map((m) => m.era));
    expect(eras.has("javascript")).toBe(true);
    expect(eras.has("node")).toBe(true);
    expect(eras.has("typescript")).toBe(true);
    expect(eras.has("checker")).toBe(true);
  });

  it("mentions ES5, Node, TS majors through 7, and the 6.0.3 pin", () => {
    const blob = milestones.map((m) => `${m.title} ${m.body}`).join(" ");
    expect(blob).toMatch(/ECMAScript 5|ES5/i);
    expect(blob).toMatch(/Node\.js/);
    expect(blob).toMatch(/TypeScript 1/);
    expect(blob).toMatch(/TypeScript 6/);
    expect(blob).toMatch(/TypeScript 7/);
    expect(blob).toMatch(/6\.0\.3/);
    expect(blob).toMatch(/Go/);
  });

  it("labels chart series as illustrative", () => {
    expect(adoptionLineMeta.illustrative).toBe(true);
    expect(stackShareMeta.illustrative).toBe(true);
    expect(HISTORY_CHART_DISCLAIMER.toLowerCase()).toContain("illustrative");
  });

  it("ships enough points for line and bar charts", () => {
    expect(adoptionLinePoints.length).toBeGreaterThanOrEqual(4);
    expect(stackSharePoints.length).toBeGreaterThanOrEqual(3);
    for (const point of adoptionLinePoints) {
      expect(point.year).toBeGreaterThan(2000);
      expect(point.typescript).toBeGreaterThanOrEqual(0);
      expect(point.javascript).toBeGreaterThanOrEqual(0);
    }
    for (const point of stackSharePoints) {
      expect(point.stack.length).toBeGreaterThan(0);
      expect(point.share).toBeGreaterThanOrEqual(0);
      expect(point.share).toBeLessThanOrEqual(100);
    }
  });
});
