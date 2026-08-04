import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "worker-threads-and-structured-clone",
  title: "Worker threads",
  tier: "advanced",
  track: "node-migration",
  order: 24,
  summary:
    "Typing the message protocol between threads, what structured clone can carry, and why the boundary deserves the same scepticism as the network.",
  prerequisites: [
    "discriminated-payloads-and-versioning",
    "typing-child-process-and-buffers",
  ],
  keywords: [
    "worker_threads",
    "postMessage",
    "structured clone",
    "protocol",
    "MessagePort",
  ],
  problem:
    "postMessage accepts any, so the protocol between two threads in the same repository is documented nowhere.",
  js: {
    code: `// JS workers: postMessage anything — functions silently drop.
parentPort.postMessage({ type: "result", fn: () => 1 });
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Structured clone cannot carry functions; JS will not warn.",
  },
  ts: {
    code: `type WorkerReq = { type: "hash"; payload: string };
type WorkerRes = { type: "result"; digest: string };

declare function postMessage(msg: WorkerRes): void;

function onMessage(msg: WorkerReq) {
  if (msg.type === "hash") {
    postMessage({ type: "result", digest: msg.payload });
  }
}

// Reject non-protocol messages at the type boundary:
const bad: WorkerRes = { type: "result", digest: 1 as unknown as string };
void bad;
const worse: WorkerRes = { type: "result", digest: 10 };
void onMessage;
`,
    highlights: [{ start: 15, end: 15 }],
    caption: "Protocol types make illegal messages a compile error.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 15,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "Define request/response unions shared by both threads — same as a network protocol.",
    "Structured clone supports many built-ins but not functions or DOM nodes in Node workers the same way.",
    "Validate unknown messages at the edge; do not trust postMessage peers blindly.",
  ],
  security: {
    title: "Workers are a trust boundary",
    body: "A compromised or buggy worker can send unexpected messages. Parse with the same discipline you use for HTTP bodies.",
    severity: "caution",
  },
  quiz: [
    {
      id: "worker-q",
      prompt: "Why type worker messages as discriminated unions?",
      choices: [
        { id: "a", text: "postMessage requires it at runtime" },
        { id: "b", text: "So both sides share an exhaustive protocol" },
        { id: "c", text: "Unions make cloning faster" },
        { id: "d", text: "Workers cannot use interfaces" },
      ],
      answerId: "b",
      explanation:
        "A shared union documents and checks every message kind.",
    },
  ],
  exercise: {
    prompt:
      "Define Msg = { type: \"ping\" } | { type: \"pong\" } and a function that handles both.",
    starter: `type Msg = { type: "ping" } | { type: "pong" };
function handle(m: Msg) {
  void m;
}
`,
    assertion: "no-errors",
    hints: ["switch on m.type"],
    solution: `type Msg = { type: "ping" } | { type: "pong" };
function handle(m: Msg): string {
  switch (m.type) {
    case "ping":
      return "ping";
    case "pong":
      return "pong";
  }
}
`,
  },
};
