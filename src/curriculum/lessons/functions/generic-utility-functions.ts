import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "generic-utility-functions",
  title: "Writing generic helpers",
  tier: "intermediate",
  track: "functions",
  order: 11,
  summary:
    "pluck, groupBy, keyBy â the small utilities every Node codebase reinvents, typed so they return something more useful than any.",
  prerequisites: ["generic-constraints", "inferring-type-arguments"],
  keywords: ["utility", "pluck", "groupBy", "keyof", "generic", "lodash"],
  problem:
    "The hand-rolled groupBy at the bottom of utils.js returns an object of arrays of anything, forever.",
  js: {
    code: `function pick(obj, keys) {
  const out = {};
  for (const k of keys) out[k] = obj[k];
  return out;
}
`,
    highlights: [{ start: 1, end: 5 }],
    caption: "pick returns a plain object with no key relationship.",
  },
  ts: {
    code: `function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}
const user = { id: "1", name: "Ada", age: 36 };
const idName = pick(user, ["id", "name"]);
const age: number = idName.age;
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Pick<T,K> only has selected keys — age is gone.",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 11,
        messageIncludes: "Property 'age' does not exist on type 'Pick<{ id",
      },
    ],
  },
  insight: [
    "keyof + generics model dictionary utilities safely.",
    "Return Pick/Omit rather than a loose record.",
    "This is how lodash-style helpers become honest.",
  ],
};
