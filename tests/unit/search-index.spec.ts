import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { allLessons } from "@/curriculum";

const indexPath = resolve(process.cwd(), "public/search/search-index.json");
const vectorsPath = resolve(process.cwd(), "public/search/vectors.json");

describe("curriculum Neptune search index", () => {
  it("ships search-index.json covering every lesson", () => {
    expect(existsSync(indexPath)).toBe(true);
    const payload = JSON.parse(readFileSync(indexPath, "utf8"));
    expect(Array.isArray(payload.documents)).toBe(true);
    const ids = new Set(payload.documents.map((d: { id: string }) => d.id));
    for (const lesson of allLessons) {
      expect(ids.has(lesson.id)).toBe(true);
    }
    for (const doc of payload.documents) {
      expect(doc.title).toBeTruthy();
      expect(doc.route).toMatch(/^\//);
      expect(Array.isArray(doc.keywords)).toBe(true);
      expect(typeof doc.bodyText).toBe("string");
    }
  });

  it("ships vectors.json aligned to the index", () => {
    expect(existsSync(vectorsPath)).toBe(true);
    const index = JSON.parse(readFileSync(indexPath, "utf8"));
    const vectors = JSON.parse(readFileSync(vectorsPath, "utf8"));
    expect(vectors.documents.length).toBe(index.documents.length);
    const vectorIds = new Set(
      vectors.documents.map((d: { id: string }) => d.id),
    );
    for (const doc of index.documents) {
      expect(vectorIds.has(doc.id)).toBe(true);
    }
    const dim = vectors.documents[0]?.embedding?.length;
    expect(dim).toBeGreaterThan(10);
    for (const row of vectors.documents) {
      expect(row.embedding).toHaveLength(dim);
    }
  });
});
