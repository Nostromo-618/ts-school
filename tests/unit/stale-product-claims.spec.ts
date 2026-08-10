import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Product-truth guard: lesson sources must not claim a live in-browser
 * typecheck worker after the build-time Strada migration.
 */

const lessonsDir = resolve(process.cwd(), "src/curriculum/lessons");

const BANNED = [
  /live typecheck worker/i,
  /LiveTsPane/,
  /typecheck worker/i,
  /in-browser createProgram/i,
];

/** Intentional wrong quiz distractor in the Go-port lesson only. */
const ALLOWED_DISTRACTOR =
  /It runs createProgram in a Web Worker from typescript@7/;

function lessonFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return lessonFiles(path);
    return entry.name.endsWith(".ts") ? [path] : [];
  });
}

describe("stale product claims", () => {
  it("bans live-worker / LiveTsPane product language in lesson sources", () => {
    const offenders: string[] = [];
    for (const path of lessonFiles(lessonsDir)) {
      let text = readFileSync(path, "utf8");
      if (path.endsWith("typescript-versions-and-the-go-port.ts")) {
        text = text.replace(ALLOWED_DISTRACTOR, "");
      }
      for (const re of BANNED) {
        if (re.test(text)) {
          offenders.push(`${relative(process.cwd(), path)} matches ${re}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
