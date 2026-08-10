import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guard against UTF-8 mojibake in lesson modules (em dashes / ellipses
 * double-encoded as latin1). Visible as "â" in summaries and problems.
 */

const lessonsDir = resolve(process.cwd(), "src/curriculum/lessons");

function lessonFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return lessonFiles(path);
    return entry.name.endsWith(".ts") ? [path] : [];
  });
}

describe("lesson encoding", () => {
  it("contains no UTF-8 mojibake of punctuation (â sequences)", () => {
    const offenders: string[] = [];
    for (const path of lessonFiles(lessonsDir)) {
      const bytes = readFileSync(path);
      // U+00E2 as UTF-8 (C3 A2) starting a mojibake run for em dash / ellipsis
      if (bytes.includes(Buffer.from([0xc3, 0xa2]))) {
        offenders.push(relative(process.cwd(), path));
      }
    }
    expect(offenders).toEqual([]);
  });
});
