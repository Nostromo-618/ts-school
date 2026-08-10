#!/usr/bin/env node
/**
 * Build-time Neptune search index for the curriculum.
 *
 * Loads lessons via Vite SSR, writes Neptune Document payloads to
 * `public/search/search-index.json` and MiniLM vectors to
 * `public/search/vectors.json`.
 *
 * Usage: node scripts/generate-search-index.mjs [--check] [--skip-vectors]
 */

import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = resolve(repoRoot, "public/search");
const indexPath = resolve(outDir, "search-index.json");
const vectorsPath = resolve(outDir, "vectors.json");
const checkOnly = process.argv.includes("--check");
const skipVectors = process.argv.includes("--skip-vectors");

function cap(text, max) {
  const s = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

function embedInput(doc) {
  return cap(
    [
      doc.title,
      doc.category,
      (doc.keywords || []).join(" "),
      (doc.headings || []).join(" "),
      doc.bodyText,
    ].join(". "),
    512,
  );
}

function l2Normalize(vec) {
  let sum = 0;
  for (const v of vec) sum += v * v;
  const mag = Math.sqrt(sum) || 1;
  return vec.map((v) => v / mag);
}

const server = await createServer({
  configFile: false,
  root: repoRoot,
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(repoRoot, "src"),
    },
  },
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { allLessons, lessonRoute, trackById, TRACKS } =
    await server.ssrLoadModule("/src/curriculum/index.ts");
  const { nav } = await server.ssrLoadModule("/src/nav.ts");

  /** @type {object[]} */
  const documents = [];

  for (const lesson of allLessons) {
    const track = trackById(lesson.track);
    const bodyText = cap(
      [
        lesson.summary,
        lesson.problem,
        ...(lesson.insight || []),
        lesson.js?.caption,
        lesson.ts?.caption,
        lesson.exercise?.prompt,
        (lesson.quiz || []).map((q) => q.prompt).join(" "),
        cap(lesson.js?.code || "", 400),
        cap(lesson.ts?.code || "", 400),
      ]
        .filter(Boolean)
        .join(". "),
      8000,
    );

    documents.push({
      id: lesson.id,
      title: lesson.title,
      category: track?.title || lesson.track,
      tab: lesson.tier,
      route: lessonRoute(lesson),
      icon: track?.icon ? `ph-${track.icon}` : "ph-file-text",
      keywords: [...(lesson.keywords || []), lesson.track, lesson.tier],
      headings: ["Problem", "TypeScript", "Insight"],
      bodyText,
      classes: [],
      chunks: [
        {
          type: "paragraph",
          text: cap(lesson.summary, 400),
          heading: "Summary",
        },
        {
          type: "paragraph",
          text: cap(lesson.problem, 400),
          heading: "Problem",
        },
      ],
    });
  }

  for (const page of nav.pages || []) {
    documents.push({
      id: `page-${page.id}`,
      title: page.title,
      category: "Pages",
      tab: "pages",
      route: page.route,
      icon: page.icon ? `ph-${page.icon}` : "ph-file-text",
      keywords: page.keywords || [],
      headings: [page.title],
      bodyText: cap((page.keywords || []).join(". ") || page.title, 2000),
      classes: [],
      chunks: [],
    });
  }

  documents.sort((a, b) => String(a.id).localeCompare(String(b.id)));

  const indexPayload = {
    version: 1,
    documentCount: documents.length,
    tracks: TRACKS.map((t) => t.id),
    documents,
  };

  let vectorsPayload = {
    version: 1,
    model: "Xenova/all-MiniLM-L6-v2",
    dimensions: 0,
    documents: [],
  };

  if (checkOnly) {
    const indexJson = `${JSON.stringify(indexPayload, null, 2)}\n`;
    const indexOk =
      existsSync(indexPath) &&
      createHash("sha256").update(readFileSync(indexPath)).digest("hex") ===
        createHash("sha256").update(indexJson).digest("hex");
    let vectorsOk = existsSync(vectorsPath);
    if (vectorsOk) {
      const existing = JSON.parse(readFileSync(vectorsPath, "utf8"));
      const existingIds = new Set(
        (existing.documents || []).map((d) => d.id),
      );
      vectorsOk =
        documents.every((d) => existingIds.has(d.id)) &&
        existingIds.size === documents.length;
    }
    if (!indexOk || !vectorsOk) {
      console.error(
        "Search index out of date. Run: pnpm generate:search-index",
      );
      process.exit(1);
    }
    console.log("✓ search index up to date");
    process.exit(0);
  }

  if (!skipVectors) {
    console.log(`🧠 Embedding ${documents.length} curriculum documents…`);
    const { pipeline } = await import("@huggingface/transformers");
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { dtype: "q8" },
    );
    const rows = [];
    for (const doc of documents) {
      const input = embedInput(doc);
      const output = await extractor(input, {
        pooling: "mean",
        normalize: false,
      });
      const raw = Array.from(output.data);
      const embedding = l2Normalize(raw);
      rows.push({ id: doc.id, embedding });
      if (rows.length % 25 === 0) {
        process.stdout.write(`  … ${rows.length}/${documents.length}\n`);
      }
    }
    vectorsPayload = {
      version: 1,
      model: "Xenova/all-MiniLM-L6-v2",
      dimensions: rows[0]?.embedding.length ?? 0,
      documents: rows,
    };
  } else if (existsSync(vectorsPath)) {
    vectorsPayload = JSON.parse(readFileSync(vectorsPath, "utf8"));
  }

  const indexJson = `${JSON.stringify(indexPayload, null, 2)}\n`;
  const vectorsJson = `${JSON.stringify(vectorsPayload)}\n`;

  mkdirSync(outDir, { recursive: true });
  writeFileSync(indexPath, indexJson);
  writeFileSync(vectorsPath, vectorsJson);
  console.log(
    `✓ wrote ${documents.length} docs → ${indexPath.replace(repoRoot, ".")}`,
  );
  console.log(
    `✓ wrote vectors (${vectorsPayload.documents.length}) → ${vectorsPath.replace(repoRoot, ".")}`,
  );
} finally {
  await server.close();
}
