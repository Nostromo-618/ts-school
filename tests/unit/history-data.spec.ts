import { describe, expect, it } from "vitest";
import {
  HISTORY_DATA_INTRO,
  formatCitation,
  milestones,
  npmWeeklyMeta,
  npmWeeklyPoints,
  octoverseGrowthMeta,
  octoverseGrowthPoints,
  runtimeUsageMeta,
  runtimeUsagePoints,
  soLanguageMeta,
  soLanguagePoints,
  tsBalanceMeta,
  tsBalancePoints,
} from "@/data/history";

describe("history data", () => {
  it("keeps milestones in chronological order", () => {
    const keys = milestones.map((m) => m.sortKey);
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
  });

  it("covers javascript, node, typescript, runtimes, and the checker pin", () => {
    const eras = new Set(milestones.map((m) => m.era));
    expect(eras.has("javascript")).toBe(true);
    expect(eras.has("node")).toBe(true);
    expect(eras.has("typescript")).toBe(true);
    expect(eras.has("runtime")).toBe(true);
    expect(eras.has("checker")).toBe(true);
  });

  it("mentions ES5, Node, Deno, Bun, TS majors through 7, and the 6.0.3 pin", () => {
    const blob = milestones.map((m) => `${m.title} ${m.body}`).join(" ");
    expect(blob).toMatch(/ECMAScript 5|ES5/i);
    expect(blob).toMatch(/Node\.js/);
    expect(blob).toMatch(/Deno/);
    expect(blob).toMatch(/Bun/);
    expect(blob).toMatch(/type stripping/i);
    expect(blob).toMatch(/TypeScript 1/);
    expect(blob).toMatch(/TypeScript 6/);
    expect(blob).toMatch(/TypeScript 7/);
    expect(blob).toMatch(/6\.0\.3/);
    expect(blob).toMatch(/Go/);
  });

  it("ships sourced chart series with citations (not illustrative fiction)", () => {
    expect(HISTORY_DATA_INTRO.toLowerCase()).not.toContain("illustrative");
    const metas = [
      npmWeeklyMeta,
      soLanguageMeta,
      tsBalanceMeta,
      runtimeUsageMeta,
      octoverseGrowthMeta,
    ];
    for (const meta of metas) {
      expect(meta.citations.length).toBeGreaterThanOrEqual(1);
      for (const citation of meta.citations) {
        expect(citation.url).toMatch(/^https?:\/\//);
        expect(citation.label.length).toBeGreaterThan(0);
        expect(citation.accessed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(formatCitation(citation)).toContain(citation.label);
      }
    }
  });

  it("ships enough points for line and bar charts with sane ranges", () => {
    expect(npmWeeklyPoints.length).toBeGreaterThanOrEqual(4);
    expect(soLanguagePoints.length).toBeGreaterThanOrEqual(3);
    expect(tsBalancePoints.length).toBeGreaterThanOrEqual(3);
    expect(runtimeUsagePoints.length).toBeGreaterThanOrEqual(3);
    expect(octoverseGrowthPoints.length).toBeGreaterThanOrEqual(3);

    for (const point of npmWeeklyPoints) {
      expect(point.year).toBeGreaterThan(2000);
      expect(point.downloads).toBeGreaterThan(0);
      expect(point.weekStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    for (const point of soLanguagePoints) {
      expect(point.year).toBeGreaterThan(2000);
      expect(point.typescript).toBeGreaterThan(0);
      expect(point.typescript).toBeLessThanOrEqual(100);
      expect(point.javascript).toBeGreaterThan(0);
      expect(point.javascript).toBeLessThanOrEqual(100);
    }
    for (const point of tsBalancePoints) {
      expect(point.bucket.length).toBeGreaterThan(0);
      expect(point.percent).toBeGreaterThanOrEqual(0);
      expect(point.percent).toBeLessThanOrEqual(100);
    }
    for (const point of runtimeUsagePoints) {
      expect(point.runtime.length).toBeGreaterThan(0);
      expect(point.percent).toBeGreaterThan(0);
      expect(point.percent).toBeLessThanOrEqual(100);
    }
    for (const point of octoverseGrowthPoints) {
      expect(point.language.length).toBeGreaterThan(0);
      expect(point.yoyPercent).toBeGreaterThan(0);
    }
  });
});
