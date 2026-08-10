import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "key-remapping-with-as",
  title: "Key remapping",
  tier: "advanced",
  track: "type-level",
  order: 13,
  summary:
    "as inside a mapped type renames or drops keys as it goes — getters from fields, prefixed events, filtered shapes.",
  prerequisites: ["mapped-types-intro", "template-literal-types-intro"],
  keywords: ["key remapping", "as clause", "mapped type", "rename", "filter"],
  problem:
    "Generating a getter interface from a model interface means renaming every key, and a mapped type could not do that at all until remapping arrived. Manual getter maps fall out of sync when fields change.",
  solution:
    "as renames keys; mapping to `never` drops them. Key remapping uses `as NewKey` after `in`; `as never` filters a key out of the result. Template literal types pair naturally with remapping for getX / setX / onX patterns. `Capitalize` and other intrinsic string helpers are part of how library APIs mint names.",
  js: {
    code: `// JS: rename by hand, drift forever.
const user = { id: 1, name: "Ada" };
const getters = {
  getId: () => user.id,
  getName: () => user.name,
};
`,
    highlights: [{ start: 3, end: 6 }],
    caption: "Manual getter maps fall out of sync when fields change.",
  },
  ts: {
    code: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type User = { id: number; name: string };
type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string }

// Filter keys by remapping to never:
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

const g: UserGetters = {
  getId: () => 1,
  // getName missing
};
`,
    highlights: [
      { start: 1, end: 3 },
      { start: 15, end: 18 },
    ],
    caption: "as renames keys; mapping to `never` drops them.",
    expectedDiagnostics: [
      {
        code: 2741,
        line: 14,
        messageIncludes: "getName",
      },
    ],
  },
  insight: [
    "Key remapping uses `as NewKey` after `in`; `as never` filters a key out of the result.",
    "Template literal types pair naturally with remapping for getX / setX / onX patterns.",
    "`Capitalize` and other intrinsic string helpers are part of how library APIs mint names.",
  ],
  quiz: [
    {
      id: "remap-never",
      prompt: "What happens if a remapped key resolves to `never`?",
      choices: [
        { id: "a", text: "The property becomes optional" },
        { id: "b", text: "The property is omitted from the result type" },
        { id: "c", text: "A compile error is always raised" },
        { id: "d", text: 'The key becomes the string "`never`"' },
      ],
      answerId: "b",
      explanation:
        "Remapping to `never` is the idiomatic filter: that key contributes no property.",
    },
  ],
  exercise: {
    prompt:
      'Implement Prefixed<T, P extends string> that prefixes every key with P (e.g. Prefixed<{ id: number }, "user_"> has user_id).',
    starter: `type Prefixed<T, P extends string> = T; // TODO

type Out = Prefixed<{ id: number }, "user_">;
const x: Out = { id: 1 }; // wrong key until Prefixed remaps
`,
    assertion: "no-errors",
    hints: ["[K in `keyof` T as `${P}${string & K}`]"],
    solution: `type Prefixed<T, P extends string> = {
  [K in keyof T as \`\${P}\${string & K}\`]: T[K];
};

type Out = Prefixed<{ id: number }, "user_">;
const x: Out = { user_id: 1 };
void x;
`,
  },
};
