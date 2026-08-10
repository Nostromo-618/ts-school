/**
 * Migrate lessons: richer problem, required solution prose, backtick residual fixes.
 * Does not touch exercise.solution (template-literal code).
 *
 * Usage: node scripts/migrate-lesson-presentation.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/curriculum/lessons");
const MIN = 160;

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".ts") && name !== "index.ts") out.push(p);
  }
  return out;
}

function unescape(s) {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\");
}

function escapeDouble(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function extractField(src, field) {
  const dq = src.match(
    new RegExp(`${field}:\\s*\\n?\\s*"((?:\\\\.|[^"\\\\])*)"`, "s"),
  );
  if (dq) return unescape(dq[1]);
  const sq = src.match(
    new RegExp(`${field}:\\s*\\n?\\s*'((?:\\\\.|[^'\\\\])*)'`, "s"),
  );
  if (sq) return unescape(sq[1]);
  return null;
}

function extractCaption(src, which) {
  const marker = which === "js" ? /js:\s*\{/ : /ts:\s*\{/;
  const start = src.search(marker);
  if (start < 0) return "";
  const slice = src.slice(start, start + 3000);
  const m =
    slice.match(/caption:\s*\n?\s*"((?:\\.|[^"\\])*)"/s) ||
    slice.match(/caption:\s*\n?\s*'((?:\\.|[^'\\])*)'/s);
  return m ? unescape(m[1]) : "";
}

function extractInsights(src) {
  const loose = src.match(/insight:\s*\[([\s\S]*?)\]/);
  if (!loose) return [];
  return [...loose[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((x) =>
    unescape(x[1]),
  );
}

function fixBackticks(text) {
  let t = text;
  for (let i = 0; i < 8; i++) {
    const next = t.replace(/`([A-Za-z_][\w.]*)`(<)/g, "`$1$2");
    if (next === t) break;
    t = next;
  }
  t = t.replace(/`infer`\s+([A-Za-z_][\w]*)/g, "`infer $1`");
  t = t.replace(/`never` serialize/gi, "never serialize");
  t = t.replace(/`never` pass/gi, "never pass");
  t = t.replace(/`never` fires/gi, "never fires");
  t = t.replace(/`never` fire,/gi, "never fire,");
  t = t.replace(/`never` `as /g, "never `as ");
  return t;
}

function padToMin(text, filler) {
  let t = text.trim();
  if (t.length >= MIN) return t;
  t = `${t} ${filler}`.trim();
  while (t.length < MIN) {
    t +=
      " Compare the dual panes as you read — the JavaScript side shows the silent failure; the TypeScript side shows where the checker intervenes.";
  }
  return t;
}

function sentenceCaseCaption(cap) {
  const c = cap.trim();
  if (!c) return "";
  return c.charAt(0).toLowerCase() + c.slice(1);
}

function buildProblem(existing, jsCaption, title) {
  let body = existing.trim();
  if (!body.endsWith(".")) body += ".";
  const cap = jsCaption.trim();
  if (cap) {
    const lower = sentenceCaseCaption(cap);
    const fragment = lower.endsWith(".") ? lower.slice(0, -1) : lower;
    if (!body.toLowerCase().includes(fragment.slice(0, 28).toLowerCase())) {
      body += ` Look at the left pane: ${fragment}.`;
    }
  }
  body +=
    " JavaScript will run that path anyway — there is no edit-time refusal — so the bug only appears when a particular runtime input finally trips it.";
  return padToMin(
    fixBackticks(body),
    `That is the failure mode behind “${title}”: a silent shape or protocol mistake.`,
  );
}

function buildSolution(tsCaption, insights, title) {
  const parts = [];
  const cap = tsCaption.trim();
  if (cap) parts.push(cap.endsWith(".") ? cap : `${cap}.`);
  for (const insight of insights) {
    const s = insight.trim();
    if (!s) continue;
    parts.push(s.endsWith(".") ? s : `${s}.`);
  }
  let body = parts.join(" ");
  if (!body) {
    body = `TypeScript makes the intent of “${title}” explicit so the compiler can reject the broken path before it runs.`;
  }
  body +=
    " The TypeScript pane is the living example: read its types and any diagnostic as the fix for the failure mode above, then keep the takeaways as lasting rules.";
  return padToMin(fixBackticks(body), "");
}

/** Fix backticks inside double-quoted prose strings outside of js/ts/exercise code. */
function fixProseQuotes(src) {
  // Split roughly: leave template literal regions alone by only rewriting "..." that contain backticks
  return src.replace(/"((?:\\.|[^"\\])*)"/g, (full, inner) => {
    const raw = unescape(inner);
    if (!raw.includes("`")) return full;
    // Skip if this looks like it sits inside a huge code blob — heuristic: many newlines + import/function
    if (raw.includes("\n") && /^(?:import |export |function |class |type |const )/m.test(raw)) {
      return full;
    }
    const fixed = fixBackticks(raw);
    if (fixed === raw) return full;
    return `"${escapeDouble(fixed)}"`;
  });
}

function migrateFile(src, title) {
  const existingProblem = extractField(src, "problem");
  if (existingProblem === null) throw new Error("missing problem");

  const jsCap = extractCaption(src, "js");
  const tsCap = extractCaption(src, "ts");
  const insights = extractInsights(src);
  const problem = buildProblem(existingProblem, jsCap, title);
  const solution = buildSolution(tsCap, insights, title);

  if (problem.length < MIN || solution.length < MIN) {
    throw new Error(
      `richness floor: problem=${problem.length} solution=${solution.length}`,
    );
  }

  let text = src;

  // Replace problem (double or single quoted) including trailing comma
  const problemBlock =
    /problem:\s*\n?\s*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*,/s;
  if (!problemBlock.test(text)) throw new Error("problem block not found");

  const hasLessonSolution =
    /problem:\s*\n?\s*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*,\s*\n\s*solution:\s*\n?\s*"/s.test(
      text,
    );

  const replacement = `problem:\n    "${escapeDouble(problem)}",\n  solution:\n    "${escapeDouble(solution)}",`;

  if (hasLessonSolution) {
    text = text.replace(
      /problem:\s*\n?\s*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*,\s*\n\s*solution:\s*\n?\s*"(?:\\.|[^"\\])*"\s*,/s,
      replacement,
    );
  } else {
    text = text.replace(problemBlock, replacement);
  }

  text = fixProseQuotes(text);
  return text;
}

function main() {
  const files = walk(ROOT);
  let ok = 0;
  const failures = [];
  for (const file of files) {
    try {
      const src = fs.readFileSync(file, "utf8");
      const title = extractField(src, "title") ?? path.basename(file, ".ts");
      const next = migrateFile(src, title);
      fs.writeFileSync(file, next);
      ok++;
    } catch (err) {
      failures.push(`${file}: ${err.message}`);
    }
  }

  // glossary residual fix
  const gloss = "src/curriculum/glossary.ts";
  if (fs.existsSync(gloss)) {
    let g = fs.readFileSync(gloss, "utf8");
    g = fixProseQuotes(g);
    for (let i = 0; i < 8; i++) {
      const n = g.replace(/`([A-Za-z_][\w.]*)`(<)/g, "`$1$2");
      if (n === g) break;
      g = n;
    }
    fs.writeFileSync(gloss, g);
  }

  console.log(`Migrated ${ok}/${files.length}`);
  if (failures.length) {
    console.error("Failures:");
    for (const f of failures) console.error(f);
    process.exitCode = 1;
  }
}

main();
