import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "discriminated-results-in-practice",
  title: "A service that never throws",
  tier: "intermediate",
  track: "async",
  order: 9,
  summary:
    "Design a module boundary around `Result`: convert exceptions at the edge, keep the union small, and know when to throw instead.",
  prerequisites: ["result-types", "exhaustiveness-checking"],
  keywords: ["Result", "boundary", "service", "error handling", "design"],
  problem:
    "A service layer returns `null` for not-found, throws for transport errors, and sometimes returns a partial object with an `error` string field. Call sites accumulate ad-hoc checks and still miss a branch. Used everywhere, Result becomes noise; used nowhere, failures stay surprises. The fragile pattern is an inconsistent boundary — not the absence of a fancy library.",
  solution:
    "Pick a small tagged union for domain outcomes (`ok` / `not_found` / `unavailable`) and convert exceptions at the service edge. Call sites switch on the tag instead of sniffing `null`. Map transport failures separately from not-found so UI and retries can differ. Give up and throw when the failure is truly unrecoverable for that layer — Result is a boundary tool, not a religion. The TypeScript pane shows `user` existing only on the success tag.",
  js: {
    code: `async function load(id) {
  const row = await db.get(id);
  if (!row) return null;
  return row;
}
`,
    highlights: [{ start: 1, end: 5 }],
    caption: "`null` cannot tell not-found from a transport failure.",
  },
  ts: {
    code: `type User = { id: string };
type LoadResult =
  | { status: "ok"; user: User }
  | { status: "missing" }
  | { status: "error"; message: string };

declare function dbGet(id: string): Promise<User | undefined>;

export async function load(id: string): Promise<LoadResult> {
  try {
    const row = await dbGet(id);
    if (!row) return { status: "missing" };
    return { status: "ok", user: row };
  } catch {
    return { status: "error", message: "db" };
  }
}

declare const r: LoadResult;
const u: User = r.user;
`,
    highlights: [{ start: 22, end: 22 }],
    caption: "Tagged statuses keep `user` on the `ok` branch only.",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 20,
        messageIncludes: "Property 'user' does not exist on type 'LoadResu",
      },
    ],
  },
  insight: [
    "Model domain outcomes as tagged unions.",
    "Call sites switch on status instead of `null` checks.",
    "Map transport errors separately from not-found.",
  ],
};
