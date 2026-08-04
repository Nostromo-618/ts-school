import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "discriminated-results-in-practice",
  title: "A service that never throws",
  tier: "intermediate",
  track: "async",
  order: 9,
  summary:
    "Designing a module boundary around Result: where to convert exceptions, how to keep the union small, and when to give up and throw.",
  prerequisites: ["result-types", "exhaustiveness-checking"],
  keywords: ["Result", "boundary", "service", "error handling", "design"],
  problem:
    "Result types used everywhere become noise; used nowhere they become surprises. The boundary is the whole decision.",
  js: {
    code: `async function load(id) {
  const row = await db.get(id);
  if (!row) return null;
  return row;
}
`,
    highlights: [{ start: 1, end: 5 }],
    caption: "null collapses missing and failure.",
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
    caption: "Tagged statuses. user only exists on ok.",
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
    "Call sites switch on status instead of null checks.",
    "Map transport errors separately from not-found.",
  ],
};
