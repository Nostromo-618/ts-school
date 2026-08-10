import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "utility-types-tour",
  title: "The built-in utility types",
  tier: "intermediate",
  track: "type-level",
  order: 4,
  summary:
    "`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable` — what each one does and, more usefully, which one you actually meant.",
  prerequisites: ["indexed-access-types", "optional-and-readonly-properties"],
  keywords: ["Partial", "Pick", "Omit", "Record", "Exclude", "utility types"],
  problem:
    "Patch can overwrite id. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases. Hover the resulting type; if it widened, the transform is wrong.",
  solution:
    "`Partial<Pick<.>>` forbids patching id. `Partial`, `Pick`, `Omit`, `Required` cover most object transforms. Compose utilities instead of hand-rolling mapped types first. `Readonly` and `Record` round out the everyday set. Make the impossible state unrepresentable, then move on.",
  js: {
    code: `function update(user, patch) { return Object.assign({}, user, patch); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Patch can overwrite id.",
  },
  ts: {
    code: `type User = { id: string; name: string; age: number };
type UserPatch = Partial<Pick<User, "name" | "age">>;
function update(user: User, patch: UserPatch): User {
  return { ...user, ...patch };
}
const u = update({ id: "1", name: "Ada", age: 1 }, { name: "Bob" });
const bad = update(u, { id: "2" });
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "`Partial<Pick<...>>` forbids patching id.",
    expectedDiagnostics: [
      {
        code: 2353,
        line: 7,
        messageIncludes: "Object literal may only specify known properties",
      },
    ],
  },
  insight: [
    "`Partial`, `Pick`, `Omit`, `Required` cover most object transforms.",
    "Compose utilities instead of hand-rolling mapped types first.",
    "`Readonly` and `Record` round out the everyday set.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which utility makes every property optional?",
      choices: [
        { id: "a", text: "`Required<T>`" },
        { id: "b", text: "`Partial<T>`" },
        { id: "c", text: "`Record<string, T>`" },
        { id: "d", text: "`Exclude<T, U>`" },
      ],
      answerId: "b",
      explanation:
        "`Partial<T>` maps each property to optional — useful for patches when composed with `Pick`/`Omit`.",
    },
  ],
};
