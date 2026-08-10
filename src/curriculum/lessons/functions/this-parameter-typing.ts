import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "this-parameter-typing",
  title: "Typing this",
  tier: "intermediate",
  track: "functions",
  order: 13,
  summary:
    "The fake first parameter that types the receiver, why arrow functions do not have one, and what `noImplicitThis` is protecting you from.",
  prerequisites: ["function-type-expressions"],
  keywords: ["this", "noImplicitThis", "receiver", "bind", "arrow function"],
  problem:
    "Relying on dynamic this without binding. Shared helpers amplify the hole: wrong arguments, erased returns, or forgotten type relationships spread to every caller. Callers copy the signature they see — if it lies, the lie spreads.",
  solution:
    "this: Entity requires a proper receiver. Bare call errors. The this parameter is erased and only types the receiver. Methods on objects usually get this from the containing type. Prefer arrows or explicit args when this is confusing. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `function label() { return this.id; }
label(); // boom
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Relying on dynamic this without binding.",
  },
  ts: {
    code: `type Entity = { id: string };

function label(this: Entity): string {
  return this.id;
}

const e: Entity = { id: "1" };
label.call(e);

label();
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "this: Entity requires a proper receiver. Bare call errors.",
    expectedDiagnostics: [
      {
        code: 2684,
        line: 10,
        messageIncludes: "The 'this' context of type 'void' is not assigna",
      },
    ],
  },
  insight: [
    "The this parameter is erased and only types the receiver.",
    "Methods on objects usually get this from the containing type.",
    "Prefer arrows or explicit args when this is confusing.",
  ],
};
