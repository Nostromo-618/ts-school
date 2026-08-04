import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typed-event-emitters",
  title: "Typed event emitters",
  tier: "intermediate",
  track: "node-migration",
  order: 17,
  summary:
    "EventEmitter's untyped on and emit, generic emitter maps, and the typed-events option that arrived in newer Node types.",
  prerequisites: ["template-literal-types-intro", "typing-http-servers"],
  keywords: ["EventEmitter", "events", "typed events", "on", "emit", "generic"],
  problem:
    "emitter.on('conected', handler) compiles, runs, and never fires, because event names are just strings.",
  js: {
    code: `emitter.on("user", (u) => {
  send(u.email);
});
emitter.emit("user", { id: 1 });
`,
    highlights: [{ start: 1, end: 4 }],
    caption: "Emitting a partial payload while listeners assume email exists.",
  },
  ts: {
    code: `type User = { id: string; email: string };
interface TypedEmitter {
  on(event: "user", listener: (user: User) => void): void;
  emit(event: "user", user: User): boolean;
}
declare const emitter: TypedEmitter;

emitter.on("user", (u) => {
  const email: string = u.email;
});

emitter.emit("user", { id: "1" });
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Typed emit requires a full User — missing email is an error.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 12,
        messageIncludes: "Argument of type '{ id: string; }' is not assign",
      },
    ],
  },
  insight: [
    "Map event names to payload types so emit/on stay in sync.",
    "Wrap EventEmitter or use a typed emitter helper.",
    "Remove listeners with AbortSignal to avoid leaks.",
  ],
};
