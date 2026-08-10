import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "function-overloads",
  title: "Overloads",
  tier: "intermediate",
  track: "functions",
  order: 12,
  summary:
    "Several signatures over one implementation, when the return type depends on the arguments — and the union or generic that is usually better.",
  prerequisites: ["generics-intro", "function-type-expressions"],
  keywords: [
    "overload",
    "signature",
    "implementation signature",
    "union",
    "api design",
  ],
  problem:
    "One function, two call shapes, no guidance. Shared helpers amplify the hole: wrong arguments, erased returns, or forgotten type relationships spread to every caller. Callers copy the signature they see — if it lies, the lie spreads.",
  solution:
    "Overload signatures document call forms. boolean is not accepted. List public overload signatures, then one implementation signature. Keep overloads minimal — unions often suffice. Implementation signature must accept every overload input. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `function read(x) {
  if (typeof x === 'number') return items[x];
  return items.find(i => i.id === x);
}
`,
    highlights: [{ start: 1, end: 4 }],
    caption: "One function, two call shapes, no guidance.",
  },
  ts: {
    code: `type Item = { id: string; name: string };
declare const items: Item[];

function read(id: number): Item | undefined;
function read(id: string): Item | undefined;
function read(id: number | string): Item | undefined {
  if (typeof id === "number") return items[id];
  return items.find((i) => i.id === id);
}

const a = read(0);
const b = read("1");
const c: number = read(true);
`,
    highlights: [{ start: 13, end: 13 }],
    caption:
      "Overload signatures document call forms. boolean is not accepted.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 13,
        messageIncludes: "Type 'Item | undefined' is not assignable to typ",
      },
      {
        code: 2769,
        line: 13,
        messageIncludes: "No overload matches this call",
      },
    ],
  },
  insight: [
    "List public overload signatures, then one implementation signature.",
    "Keep overloads minimal — unions often suffice.",
    "Implementation signature must accept every overload input.",
  ],
};
