import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "module-augmentation",
  title: "Augmenting another package's types",
  tier: "advanced",
  track: "structures",
  order: 24,
  summary:
    "declare module to add to a dependency's types, declare global for the runtime globals — done in a way that survives an upgrade.",
  prerequisites: ["declaration-merging", "namespaces-and-legacy-code"],
  keywords: [
    "module augmentation",
    "declare module",
    "declare global",
    "d.ts",
    "express",
  ],
  problem:
    "Attaching a user object to Express's Request is a five-line change that half of all Node codebases get subtly wrong.",
  js: {
    code: `// JS: just hang properties on req — no types to update.
function auth(req, _res, next) {
  req.user = { id: "u1" };
  next();
}
`,
    highlights: [{ start: 2, end: 5 }],
    caption: "JS monkey-patches freely; TypeScript needs an augmentation.",
  },
  ts: {
    code: `// Interface merging models the same idea as declare module augmentation.
interface Request {
  url: string;
}

interface Request {
  user?: { id: string };
}

function handle(req: Request) {
  const id: string = req.user.id;
  void id;
}

const req: Request = { url: "/" };
handle(req);
`,
    highlights: [{ start: 11, end: 11 }],
    caption: "Merged optional user still needs a narrowing before .id.",
    expectedDiagnostics: [
      {
        code: 18048,
        line: 11,
        messageIncludes: "possibly 'undefined'",
      },
    ],
  },
  insight: [
    'In real packages, augmentation uses `declare module "pkg"` in a .d.ts that is itself a module.',
    "Match the dependency’s module name exactly; path mapping typos silently create a new ambient module.",
    "Prefer documenting required app-owned fields as required only when middleware always sets them.",
  ],
  security: {
    title: "Augmentation is not authentication",
    body: "Typing req.user does not mean a user is present or trusted. Middleware must establish identity; the type only records what you promise after that middleware runs.",
    severity: "caution",
  },
  quiz: [
    {
      id: "aug-q",
      prompt: "Where should Express Request augmentation usually live?",
      choices: [
        { id: "a", text: "Inside node_modules/express" },
        {
          id: "b",
          text: "In an app .d.ts that declare module 'express-serve-static-core' (or the correct target)",
        },
        { id: "c", text: "In tsconfig paths only" },
        { id: "d", text: "It is impossible" },
      ],
      answerId: "b",
      explanation:
        "You merge into the package’s interface via declare module in your own declaration file.",
    },
  ],
  exercise: {
    prompt:
      "Merge interface Box { value: number } with label?: string, then read value.",
    starter: `interface Box {
  value: number;
}
`,
    assertion: "no-errors",
    hints: ["Second interface Box { label?: string }"],
    solution: `interface Box {
  value: number;
}

interface Box {
  label?: string;
}

const b: Box = { value: 1 };
void b.value;
`,
  },
};
