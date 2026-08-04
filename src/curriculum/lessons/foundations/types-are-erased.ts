import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "types-are-erased",
  title: "Types are erased",
  tier: "beginner",
  track: "foundations",
  order: 3,
  summary:
    "Every annotation you write disappears before Node sees the file. What that buys you, and the one assumption it stops you from making.",
  prerequisites: ["first-type-error"],
  keywords: ["erasure", "compile time", "runtime", "emit", "no runtime cost"],
  problem:
    "Newcomers assume a type annotation validates data at runtime; it does not, and a wrong assumption there is how untrusted input walks straight in.",
  js: {
    code: `// "Validated" only by hope and a comment.
function sendWelcome(user) {
  return "welcome " + user.email.toLowerCase();
}

const raw = JSON.parse('{"id":"1"}');
sendWelcome(raw);
`,
    highlights: [{ start: 6, end: 7 }],
    caption: "JSON.parse returns whatever the wire sent — no shape check.",
  },
  ts: {
    code: `type User = { id: string; email: string };

function sendWelcome(user: User) {
  return "welcome " + user.email.toLowerCase();
}

// Compiles. Types are gone at runtime — this still blows up if email is missing.
const raw: unknown = JSON.parse('{"id":"1"}');
sendWelcome(raw as User);
`,
    highlights: [{ start: 8, end: 8 }],
    caption:
      "as User is a compile-time claim. The checker is silent; Node still crashes.",
    expectedDiagnostics: [],
  },
  insight: [
    "TypeScript erases types: the emitted JavaScript has no User, no annotations, no assertions.",
    "A type annotation documents intent for the checker; it never validates bytes from the network.",
    "At trust boundaries use unknown + narrowing (or a schema library) — covered in the runtime-boundary track.",
  ],
  security: {
    title: "Assertions are not validation",
    body: "Casting JSON.parse(...) as User (or any) is a security smell: attackers control the wire format. Prefer unknown and check email before use.",
    severity: "critical",
  },
  quiz: [
    {
      id: "q1",
      prompt: "After tsc emits JavaScript, what remains of type User?",
      choices: [
        { id: "a", text: "A runtime class named User" },
        { id: "b", text: "Nothing — types are erased" },
        { id: "c", text: "A Proxy that validates fields" },
        { id: "d", text: "A Symbol attached to the object" },
      ],
      answerId: "b",
      explanation:
        "TypeScript's emit strips types. Runtime behavior is plain JavaScript.",
    },
  ],
  exercise: {
    prompt:
      "Remove the unsafe assertion. Accept unknown and narrow before calling sendWelcome.",
    starter: `type User = { id: string; email: string };

function sendWelcome(user: User) {
  return "welcome " + user.email.toLowerCase();
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    typeof (value as User).id === "string" &&
    typeof (value as User).email === "string"
  );
}

const raw: unknown = JSON.parse('{"id":"1","email":"a@b.co"}');
sendWelcome(raw as User);
`,
    assertion: "no-errors",
    hints: ["if (isUser(raw)) sendWelcome(raw);"],
    solution: `type User = { id: string; email: string };

function sendWelcome(user: User) {
  return "welcome " + user.email.toLowerCase();
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    typeof (value as User).id === "string" &&
    typeof (value as User).email === "string"
  );
}

const raw: unknown = JSON.parse('{"id":"1","email":"a@b.co"}');
if (isUser(raw)) {
  sendWelcome(raw);
}
`,
  },
};
