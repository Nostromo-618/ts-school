import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "non-null-assertion",
  title: "The non-null assertion",
  tier: "beginner",
  track: "runtime-boundary",
  order: 5,
  summary:
    "value! tells TypeScript a value is not `null` or `undefined` — another claim that can lie at runtime.",
  prerequisites: ["null-and-undefined", "type-assertions-are-claims"],
  keywords: ["non-null assertion", "!", "definite assignment"],
  problem:
    "Map.get returns `undefined` when absent. Types erase at runtime, so a boundary annotation without a check is a claim, not a proof. Parse or validate before you trust fields — especially for JSON, HTTP, and env. Validate before field access — annotations are not runtime checks.",
  solution:
    "No TypeScript error here — that's the point: ! removes | `undefined` from the type, not from reality. Prefer an explicit check. is shorthand for 'I promise x is not nullish' — same family as as. Use if (!x) throw new Error(.) when absence is a bug you want to see. in lint for app code if your team keeps foot-gunning with it. Apply the same refusal at the next boundary you own.",
  js: {
    code: `const users = new Map();
users.set("1", { name: "Ada" });
users.get("missing").name;
`,
    highlights: [{ start: 3, end: 3 }],
    caption: "Map.get returns `undefined` when absent.",
  },
  ts: {
    code: `type User = { name: string };
const users = new Map<string, User>();
users.set("1", { name: "Ada" });

// ! removes | undefined from the type — not from reality.
users.get("missing")!.name;
`,
    highlights: [{ start: 6, end: 6 }],
    caption:
      "No TypeScript error here — that's the point: ! removes | `undefined` from the type, not from reality. Prefer an explicit check.",
    expectedDiagnostics: [],
  },
  insight: [
    "x! is shorthand for 'I promise x is not nullish' — same family as as.",
    "Use if (!x) throw new Error(...) when absence is a bug you want to see.",
    "Ban ! in lint for app code if your team keeps foot-gunning with it.",
  ],
  security: {
    title: "Non-null assertions hide missing auth context",
    body: "req.user! in middleware stacks is a classic crash and a confused-deputy risk when the middleware order changes. Check and return 401 instead.",
    severity: "caution",
  },
  quiz: [
    {
      id: "q1",
      prompt: "What does expr! change at runtime?",
      choices: [
        { id: "a", text: "Throws if `null`" },
        { id: "b", text: "Nothing — it is erased" },
        { id: "c", text: "Converts `null` to `undefined`" },
        { id: "d", text: "Freezes the object" },
      ],
      answerId: "b",
      explanation: "It only affects the type.",
    },
  ],
  exercise: {
    prompt: "Handle a missing map entry without !.",
    starter: `type User = { name: string };
const users = new Map<string, User>();
users.set("1", { name: "Ada" });

users.get("missing")!.name;
`,
    assertion: "no-errors",
    hints: ["const u = users.get(...); if (!u) throw ...; u.name"],
    solution: `type User = { name: string };
const users = new Map<string, User>();
users.set("1", { name: "Ada" });

const user = users.get("missing");
if (!user) {
  throw new Error("user not found");
}
user.name;
`,
  },
};
