import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "const-assertions",
  title: "as const",
  tier: "intermediate",
  track: "types",
  order: 17,
  summary:
    "A const assertion freezes an object or array into its most specific readonly literal type â the cheapest way to build a lookup table the checker understands.",
  prerequisites: ["literal-types", "inference-and-widening"],
  keywords: ["as const", "const assertion", "readonly", "literal", "widening"],
  problem:
    "A config object's values widen to string the moment it is declared, so nothing downstream can depend on what is actually in it.",
  js: {
    code: `const routes = ["/", "/about"];
routes.push("/admin");
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Mutable string[] invites drift.",
  },
  ts: {
    code: `const routes = ["/", "/about"] as const;
type Route = (typeof routes)[number];

const go = (r: Route) => r;
go("/");
go("/admin");
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "as const routes do not include /admin.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 6,
        messageIncludes: "Argument of type '\"/admin\"' is not assignable to",
      },
    ],
  },
  insight: [
    "as const freezes literal types and makes tuples readonly.",
    "Indexed access (typeof routes)[number] builds a union of members.",
    "Use it for route tables, event names, and config maps.",
  ],
};
