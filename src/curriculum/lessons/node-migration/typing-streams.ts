import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-streams",
  title: "Streams",
  tier: "intermediate",
  track: "node-migration",
  order: 15,
  summary:
    "Readable, Writable, Transform and their generics, object mode, pipeline, and the async-iterator interface that makes them tolerable.",
  prerequisites: ["async-iterators-and-generators", "typing-fs-and-path"],
  keywords: [
    "stream",
    "Readable",
    "Transform",
    "pipeline",
    "object mode",
    "backpressure",
  ],
  problem:
    "Streams predate generics in Node's types, so object-mode chunks are typed as `any` unless you say otherwise. Look at the left pane: calling string methods on a Buffer chunk. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "Decode explicitly. BufferLike has no toUpperCase. Object-mode vs byte streams change chunk types — model that in wrappers. Always handle stream error events. Prefer pipeline() for cleanup over hand-rolled listeners. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
  js: {
    code: `readable.on("data", (chunk) => {
  sink.write(chunk.toUpperCase());
});
`,
    highlights: [{ start: 1, end: 3 }],
    caption: "Calling string methods on a Buffer chunk.",
  },
  ts: {
    code: `type BufferLike = { toString(enc?: string): string };
interface Readable {
  on(event: "data", listener: (chunk: BufferLike) => void): void;
}
interface Writable {
  write(chunk: string | BufferLike): boolean;
}
declare const readable: Readable;
declare const sink: Writable;

readable.on("data", (chunk) => {
  sink.write(chunk.toString("utf8").toUpperCase());
});

readable.on("data", (chunk) => {
  const upper: string = chunk.toUpperCase();
});
`,
    highlights: [{ start: 15, end: 16 }],
    caption: "Decode explicitly. BufferLike has no toUpperCase.",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 16,
        messageIncludes: "Property 'toUpperCase' does not exist on type 'B",
      },
    ],
  },
  insight: [
    "Object-mode vs byte streams change chunk types — model that in wrappers.",
    "Always handle stream error events.",
    "Prefer pipeline() for cleanup over hand-rolled listeners.",
  ],
  exercise: {
    prompt:
      'Decode chunk with toString("utf8") before toUpperCase. Match the solution text.',
    starter: `type BufferLike = { toString(enc?: string): string };
interface Readable {
  on(event: "data", listener: (chunk: BufferLike) => void): void;
}
declare const readable: Readable;

readable.on("data", (chunk) => {
  const upper: string = chunk.toUpperCase();
  void upper;
});
`,
    assertion: "no-errors",
    hints: ['chunk.toString("utf8").toUpperCase()'],
    solution: `type BufferLike = { toString(enc?: string): string };
interface Readable {
  on(event: "data", listener: (chunk: BufferLike) => void): void;
}
declare const readable: Readable;

readable.on("data", (chunk) => {
  const upper: string = chunk.toString("utf8").toUpperCase();
  void upper;
});
`,
  },
};
